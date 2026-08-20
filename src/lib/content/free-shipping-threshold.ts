import { ShippingZonesForChannelDocument } from "@/gql/graphql";
import { applyCacheProfile, CACHE_PROFILES } from "@/lib/cache-manifest";
import { executeAppGraphQL } from "@/lib/graphql";
import { defaultStorefrontContent } from "@/lib/content/defaults";

/**
 * Resolve the free-shipping threshold for a channel from Saleor shipping zones.
 *
 * Looks for a shipping method whose channel listing price is exactly `0.00`
 * (free shipping) for the given channel, and returns its `minimumOrderPrice`
 * (e.g. "free over AED 200"). Falls back to the code default
 * (`defaultStorefrontContent.policies.shipping.freeShippingThreshold`) when:
 * - no free-shipping method is configured for the channel, or
 * - the query is unavailable (no `SALEOR_APP_TOKEN`), or
 * - the query fails.
 *
 * Cached via the channel-scoped `free-shipping:{channel}` profile.
 */
export async function resolveFreeShippingThreshold(channel: string): Promise<number> {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.freeShipping, { channel });

	const fallback = defaultStorefrontContent.policies.shipping.freeShippingThreshold;
	const allowBackend = defaultStorefrontContent.chrome.announcementBar.backendValues;

	if (!process.env.SALEOR_APP_TOKEN || !allowBackend) {
		return fallback;
	}

	const result = await executeAppGraphQL(ShippingZonesForChannelDocument, {
		variables: { channel },
	});

	if (result.ok && result.data.shippingZones == null) {
		// Saleor returns null (not an error) when the app token lacks the required
		// permission (MANAGE_SHIPPING) for `shippingZones.channelListings`.
		console.warn(
			`[free-shipping] shippingZones returned null for channel "${channel}" — ` +
				"the SALEOR_APP_TOKEN likely lacks MANAGE_SHIPPING. Falling back to the default threshold.",
		);
	}

	const zones = result.ok ? (result.data.shippingZones?.edges?.map((edge) => edge.node) ?? []) : [];

	for (const zone of zones) {
		for (const method of zone.shippingMethods ?? []) {
			const listing = method.channelListings?.find((l) => l.channel.slug === channel);
			if (!listing) continue;

			// Free shipping method: channel price is exactly 0.00.
			const price = listing.price?.amount;
			if (price === undefined || price !== 0) continue;

			// minimumOrderPrice is the threshold above which the method is free.
			const threshold = listing.minimumOrderPrice?.amount;
			if (threshold != null && threshold !== price) {
				return threshold;
			}
		}
	}

	return fallback;
}
