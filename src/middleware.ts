import { type NextRequest, NextResponse } from "next/server";
import { DefaultChannelSlug } from "@/app/config";
import { getStaticStorefrontChannelSlugs, isAllowedStorefrontChannel } from "@/config/channels";
import { getDefaultLocaleSlug, isLocaleSlug, isStorefrontLocaleSlug } from "@/config/locale";
import { BROWSE_LOCALE_COOKIE, getBrowseLocaleCookieOptions } from "@/lib/browse-locale";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { geolocation } from "@vercel/functions";

const RESERVED_ROOT_SEGMENTS = new Set([
	"api",
	"checkout",
	"_next",
	"favicon.ico",
	"robots.txt",
	"sitemap.xml",
]);

// Dynamic country to channel mapping
function getCountryToChannelMap(): Record<string, string> {
	const channels = getStaticStorefrontChannelSlugs();
	const map: Record<string, string> = {};

	channels.forEach((channel) => {
		// Convert channel slug to uppercase for country code
		// e.g., "ae" → "AE", "bh" → "BH"
		const countryCode = channel.toUpperCase();
		map[countryCode] = channel;
	});

	return map;
}

function isChannelSlug(segment: string): boolean {
	const allowed = getStaticStorefrontChannelSlugs();
	return isAllowedStorefrontChannel(segment, allowed);
}

function withBrowseLocaleCookie(request: NextRequest, response: NextResponse, locale: string): NextResponse {
	if (!isStorefrontLocaleSlug(locale)) {
		return response;
	}

	// Skip Set-Cookie when the value is already correct — re-setting on every HTML response
	// marks responses as uncacheable at shared CDNs even when nothing changed.
	const current = request.cookies.get(BROWSE_LOCALE_COOKIE)?.value;
	if (current === locale) {
		return response;
	}

	response.cookies.set(BROWSE_LOCALE_COOKIE, locale, getBrowseLocaleCookieOptions());
	return response;
}

/**
 * Detect the user's country from the request
 * - On Vercel: geolocation(request)?.country
 * - On other platforms: check for x-vercel-ip-country header or similar
 */
function detectCountry(request: NextRequest): string | null {
	const country = geolocation(request)?.country;
	if (country) return country;

	const countryHeader =
		request.headers.get("x-vercel-ip-country") ||
		request.headers.get("x-country") ||
		request.headers.get("cf-ipcountry"); // Cloudflare

	if (countryHeader) return countryHeader;

	return null;
}

/**
 * Get the appropriate channel based on the user's location
 * Returns null if no matching channel is found
 */
function getChannelFromLocation(request: NextRequest): string | null {
	const country = detectCountry(request);
	if (!country) return null;

	const countryToChannel = getCountryToChannelMap();
	const channel = countryToChannel[country];
	if (!channel) return null;

	// Ensure the channel is allowed in STOREFRONT_CHANNELS
	const allowedChannels = getStaticStorefrontChannelSlugs();
	if (!isAllowedStorefrontChannel(channel, allowedChannels)) {
		return null;
	}

	return channel;
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.includes(".") // static files
	) {
		return NextResponse.next();
	}

	const segments = pathname.split("/").filter(Boolean);
	const defaultLocale = getDefaultLocaleSlug();
	const defaultChannel = DefaultChannelSlug ?? getStaticStorefrontChannelSlugs()[0];

	// Root → default browse home
	if (segments.length === 0) {
		if (!defaultChannel) {
			return NextResponse.next();
		}

		// Try to detect channel from location <-- NEW
		const detectedChannel = getChannelFromLocation(request);
		const targetChannel = detectedChannel || defaultChannel;

		const url = request.nextUrl.clone();
		// url.pathname = buildStorefrontPath(defaultLocale, defaultChannel); // <-- OLD
		url.pathname = buildStorefrontPath(defaultLocale, targetChannel); // <-- NEW

		// Store the detected channel in a cookie for analytics/debugging <-- NEW
		const response = NextResponse.redirect(url, 307);
		response.cookies.set("x-detected-channel", targetChannel, {
			maxAge: 60 * 60 * 24, // 1 day
			path: "/",
			sameSite: "lax",
		});

		return withBrowseLocaleCookie(request, NextResponse.redirect(url, 307), defaultLocale);
	}

	const [first, second, ...rest] = segments;

	if (RESERVED_ROOT_SEGMENTS.has(first)) {
		return NextResponse.next();
	}

	// ============================================================
	// Handle /{locale} only - detect channel from location
	// ============================================================
	if (isStorefrontLocaleSlug(first) && !second) {
		if (!defaultChannel) {
			return NextResponse.next();
		}

		// Try to detect channel from location
		const detectedChannel = getChannelFromLocation(request);
		const targetChannel = detectedChannel || defaultChannel;

		const url = request.nextUrl.clone();
		url.pathname = buildStorefrontPath(first, targetChannel);
		return withBrowseLocaleCookie(request, NextResponse.redirect(url, 307), first);
	}

	// Disabled locale slug (defined but not in NEXT_PUBLIC_STOREFRONT_LOCALES) → canonical default locale
	if (isLocaleSlug(first) && !isStorefrontLocaleSlug(first)) {
		if (second && isChannelSlug(second)) {
			const url = request.nextUrl.clone();
			const suffix = rest.length > 0 ? `/${rest.join("/")}` : "";
			url.pathname = buildStorefrontPath(defaultLocale, second, suffix);
			return withBrowseLocaleCookie(request, NextResponse.redirect(url, 307), defaultLocale);
		}
		return NextResponse.next();
	}

	// Canonical format: /{locale}/{channel}/…
	if (isStorefrontLocaleSlug(first)) {
		if (second && isChannelSlug(second)) {
			return withBrowseLocaleCookie(request, NextResponse.next(), first);
		}

		// /{locale} only → add default channel
		if (!second && defaultChannel) {
			const url = request.nextUrl.clone();
			url.pathname = buildStorefrontPath(first, defaultChannel);
			return withBrowseLocaleCookie(request, NextResponse.redirect(url, 307), first);
		}

		return NextResponse.next();
	}

	// Legacy: /{channel}/… → /{defaultLocale}/{channel}/…
	if (isChannelSlug(first)) {
		const url = request.nextUrl.clone();
		const suffix = [second, ...rest].filter(Boolean).join("/");
		url.pathname = buildStorefrontPath(defaultLocale, first, suffix ? `/${suffix}` : "");
		return withBrowseLocaleCookie(request, NextResponse.redirect(url, 307), defaultLocale);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image).*)"],
};
