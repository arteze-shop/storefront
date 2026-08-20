import { describe, expect, it, vi, beforeEach } from "vitest";

const mockExecuteAppGraphQL = vi.fn();

vi.mock("@/lib/graphql", () => ({
	executeAppGraphQL: (...args: unknown[]) => mockExecuteAppGraphQL(...args),
}));

vi.mock("@/lib/cache-manifest", () => ({
	CACHE_PROFILES: {
		freeShipping: {
			id: "free-shipping",
			cacheProfile: "menus",
			tagPattern: "free-shipping:{channel}",
			pathPattern: null,
		},
	},
	applyCacheProfile: () => {},
}));

import { resolveFreeShippingThreshold } from "@/lib/content/free-shipping-threshold";

function money(amount: number) {
	return {
		__typename: "Money" as const,
		amount,
		currency: "AED",
		fractionDigits: 2,
		fractionalAmount: Math.round(amount * 100),
	};
}

function method(id: string, name: string, channel: string, price: number, minOrder?: number) {
	return {
		id,
		name,
		__typename: "ShippingMethodType" as const,
		channelListings: [
			{
				__typename: "ShippingMethodChannelListing" as const,
				id: `listing-${id}`,
				channel: { __typename: "Channel" as const, slug: channel },
				price: money(price),
				minimumOrderPrice: minOrder != null ? money(minOrder) : null,
			},
		],
	};
}

function zones(edges: unknown[]) {
	return {
		ok: true as const,
		data: { shippingZones: { __typename: "ShippingZoneCountableConnection" as const, edges } },
	};
}

describe("resolveFreeShippingThreshold", () => {
	beforeEach(() => {
		mockExecuteAppGraphQL.mockReset();
		process.env.SALEOR_APP_TOKEN = "test-token";
	});

	it("returns the minimumOrderPrice of a free shipping method for the channel", async () => {
		mockExecuteAppGraphQL.mockResolvedValue(
			zones([
				{
					node: {
						id: "zone-1",
						__typename: "ShippingZone" as const,
						shippingMethods: [
							method("m-1", "Standard", "ae", 25),
							method("m-2", "Free over AED 200", "ae", 0, 200),
						],
					},
				},
			]),
		);

		await expect(resolveFreeShippingThreshold("ae")).resolves.toBe(200);
	});

	it("ignores non-free methods (price > 0) and methods for other channels", async () => {
		mockExecuteAppGraphQL.mockResolvedValue(
			zones([
				{
					node: {
						id: "zone-1",
						__typename: "ShippingZone" as const,
						shippingMethods: [method("m-1", "Paid", "ae", 25), method("m-2", "Free on bh", "bh", 0, 500)],
					},
				},
			]),
		);

		await expect(resolveFreeShippingThreshold("ae")).resolves.toBe(75);
	});

	it("falls back to the default threshold when no free shipping method exists", async () => {
		mockExecuteAppGraphQL.mockResolvedValue(
			zones([
				{
					node: {
						id: "zone-1",
						__typename: "ShippingZone" as const,
						shippingMethods: [method("m-1", "Standard", "ae", 25)],
					},
				},
			]),
		);

		await expect(resolveFreeShippingThreshold("ae")).resolves.toBe(75);
	});

	it("falls back to the default threshold when the query fails", async () => {
		mockExecuteAppGraphQL.mockResolvedValue({ ok: false, error: new Error("boom") });

		await expect(resolveFreeShippingThreshold("ae")).resolves.toBe(75);
	});
});
