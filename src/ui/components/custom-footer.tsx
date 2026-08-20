import Link from "next/link";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { StorefrontRegionPicker } from "./storefront-region-picker";
import {
	getStaticStorefrontChannelSlugs,
	needsAsyncChannelDiscovery,
	shouldFetchChannelMetadata,
	toChannelSelectOptions,
} from "@/config/channels";
import { getCachedChannelsList } from "@/lib/channels/get-channels-data";
import { getStorefrontChannelSlugs } from "@/lib/channel-slugs";
import { getStorefrontLocaleOptions } from "@/lib/locale-display";
import { type MenuItem } from "@/lib/menus/get-menu-data";
import { NewsletterForm } from "@/ui/components/newsletter-form";
import { FooterMenuColumns } from "./footer-menu-columns";
import { CopyrightText } from "./copyright-text";
import { brandConfig } from "@/config/brand";
import { Logo } from "./shared/logo";

import { buildStorefrontPath } from "@/lib/storefront-path";

export const customFooterMenuItems: MenuItem[] = [
	{
		id: "Shop",
		level: 0,
		name: "Shop",
		children: [
			{
				id: "all-products",
				level: 1,
				name: "All Products",
				url: "/products",
			},
			{
				id: "rugs",
				level: 1,
				name: "Category",
				category: {
					id: "rugs",
					name: "Rugs",
					slug: "rugs",
				},
			},
			{
				id: "throws",
				level: 1,
				name: "Category",
				category: {
					id: "throws",
					name: "Throws",
					slug: "throws",
				},
			},
			{
				id: "cushions",
				level: 1,
				name: "Category",
				category: {
					id: "cushions",
					name: "Cushion Covers",
					slug: "cushion-covers",
				},
			},
			{
				id: "accessories",
				level: 1,
				name: "Category",
				category: {
					id: "accessories",
					name: "Accessories",
					slug: "accessories",
				},
			},
		],
	},
	{
		id: "Arteze",
		level: 0,
		name: brandConfig.siteName,
		children: [
			{ id: "our-story", level: 1, name: "Our Story", url: "/about" },
			{ id: "Journal", level: 1, name: "Journal", url: "/blog" },
			{ id: "contact", level: 1, name: "Contact Us", url: "/contact" },
			{ id: "faq", level: 1, name: "FAQ", url: "/faq" },
			{ id: "shipping", level: 1, name: "Shipping & Returns", url: "/shipping" },
		],
	},
];

export async function CustomFooter({ locale, channel }: { locale: string; channel: string }) {
	const resolvedSlugs = needsAsyncChannelDiscovery()
		? await getStorefrontChannelSlugs()
		: getStaticStorefrontChannelSlugs();

	const [channels] = await Promise.all([
		shouldFetchChannelMetadata(resolvedSlugs) ? getCachedChannelsList() : Promise.resolve(null),
	]);

	const localeOptions = getStorefrontLocaleOptions();
	const selectorChannels =
		channels?.channels && resolvedSlugs.length > 0
			? toChannelSelectOptions(channels.channels, resolvedSlugs)
			: [];
	return (
		<footer className="relative overflow-hidden bg-secondary-foreground text-secondary">
			{/* Decorative top border pattern */}
			<div className="pattern-overlay-light h-10 w-full opacity-30"></div>

			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
					{/* Brand Col */}
					<div className="space-y-6">
						<Link href={buildStorefrontPath(locale, channel)} prefetch={false} className="inline-block">
							<Logo className="h-6 w-auto" inverted />
						</Link>
						<p className="max-w-xs text-sm font-light text-accent/80">{brandConfig.tagline}</p>
						<div className="flex space-x-4">
							<a
								href="https://instagram.com/arteze.shop"
								target="_blank"
								rel="noopener noreferrer"
								className="text-accent transition-colors hover:text-secondary"
							>
								<svg
									role="img"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 fill-current"
								>
									<title>Instagram</title>
									<path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
								</svg>
							</a>
							<a
								href="https://tiktok.com/"
								className="text-accent transition-colors hover:text-secondary"
								target="_blank"
								rel="noopener noreferrer"
							>
								<svg
									role="img"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 fill-current"
								>
									<title>TikTok</title>
									<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
								</svg>
							</a>
						</div>
						{/* Language + market — hidden when only one option on each axis */}
						{(localeOptions.length > 1 || selectorChannels.length > 1) && (
							<div className="mt-10">
								<StorefrontRegionPicker locales={localeOptions} channels={selectorChannels} />
							</div>
						)}
					</div>

					<FooterMenuColumns items={customFooterMenuItems} />

					{/* Newsletter */}
					<div>
						<h4 className="mb-6 font-serif text-xl text-secondary">Join the Journey</h4>
						<p className="mb-4 text-sm font-light text-secondary/80">
							Subscribe for early access to new artisan collections and stories from the makers.
						</p>
						<NewsletterForm />
					</div>
				</div>

				<div className="mt-16 flex flex-col items-center justify-between border-t border-accent/20 pt-8 text-sm font-light text-accent/60 md:flex-row">
					<p>
						<CopyrightText />
					</p>
					<div className="mt-4 flex space-x-6 md:mt-0">
						<LinkWithChannel href="/privacy" className="transition-colors hover:text-secondary">
							Privacy Policy
						</LinkWithChannel>
						<LinkWithChannel href="/terms" className="transition-colors hover:text-secondary">
							Terms of Service
						</LinkWithChannel>
					</div>
				</div>
			</div>

			{/* Large background pattern watermark */}
			<div className="pattern-overlay-dark pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full opacity-10 mix-blend-overlay"></div>
		</footer>
	);
}
