import { ShippingZonesForChannelDocument } from "@/gql/graphql";
import { applyCacheProfile, CACHE_PROFILES } from "@/lib/cache-manifest";
import { executeAppGraphQL } from "@/lib/graphql";

export type ShippingMethodInfo = {
	id: string;
	name: string;
	price: { amount: number; currency: string } | null;
	minimumOrderPrice: { amount: number; currency: string } | null;
	minimumDeliveryDays: number | null;
	maximumDeliveryDays: number | null;
};

/**
 * Resolve the shipping methods (and their rates) for a channel from Saleor
 * shipping zones.
 *
 * Collects every shipping method across all zones whose channel listing matches
 * the given channel, preserving zone→method ordering. Returns an empty array
 * (graceful degradation — the page keeps its static defaults) when:
 * - the query is unavailable (no `SALEOR_APP_TOKEN`), or
 * - the query fails, or
 * - `shippingZones` is null (app token likely lacks `MANAGE_SHIPPING`).
 *
 * Cached via the channel-scoped `shipping-methods:{channel}` profile.
 */
export async function resolveShippingMethods(channel: string): Promise<ShippingMethodInfo[]> {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.shippingMethods, { channel });

	if (!process.env.SALEOR_APP_TOKEN) {
		return [];
	}

	const result = await executeAppGraphQL(ShippingZonesForChannelDocument, {
		variables: { channel },
	});

	if (!result.ok) {
		return [];
	}

	if (result.data.shippingZones == null) {
		// Saleor returns null (not an error) when the app token lacks the required
		// permission (MANAGE_SHIPPING) for `shippingZones.channelListings`.
		console.warn(
			`[shipping-methods] shippingZones returned null for channel "${channel}" — ` +
				"the SALEOR_APP_TOKEN likely lacks MANAGE_SHIPPING. Returning no shipping methods.",
		);
		return [];
	}

	const zones = result.data.shippingZones.edges?.map((edge) => edge.node) ?? [];
	const methods: ShippingMethodInfo[] = [];

	for (const zone of zones) {
		for (const method of zone.shippingMethods ?? []) {
			const listing = method.channelListings?.find((l) => l.channel.slug === channel);
			if (!listing) continue;

			methods.push({
				id: method.id,
				name: method.name,
				price: listing.price ? { amount: listing.price.amount, currency: listing.price.currency } : null,
				minimumOrderPrice: listing.minimumOrderPrice
					? { amount: listing.minimumOrderPrice.amount, currency: listing.minimumOrderPrice.currency }
					: null,
				minimumDeliveryDays: method.minimumDeliveryDays ?? null,
				maximumDeliveryDays: method.maximumDeliveryDays ?? null,
			});
		}
	}

	return methods;
}
