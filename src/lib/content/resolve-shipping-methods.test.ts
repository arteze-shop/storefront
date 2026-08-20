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
		shippingMethods: {
			id: "shipping-methods",
			cacheProfile: "menus",
			tagPattern: "shipping-methods:{channel}",
			pathPattern: null,
		},
	},
	applyCacheProfile: () => {},
}));

import { resolveShippingMethods } from "@/lib/content/resolve-shipping-methods";

function money(amount: number) {
	return {
		__typename: "Money" as const,
		amount,
		currency: "AED",
		fractionDigits: 2,
		fractionalAmount: Math.round(amount * 100),
	};
}

function method(
	id: string,
	name: string,
	channel: string,
	price: number,
	minOrder?: number,
	minDays?: number,
	maxDays?: number,
) {
	return {
		id,
		name,
		__typename: "ShippingMethodType" as const,
		minimumDeliveryDays: minDays != null ? minDays : null,
		maximumDeliveryDays: maxDays != null ? maxDays : null,
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

describe("resolveShippingMethods", () => {
	beforeEach(() => {
		mockExecuteAppGraphQL.mockReset();
		process.env.SALEOR_APP_TOKEN = "test-token";
	});

	it("returns methods with price, minimumOrderPrice, and delivery days for the matching channel", async () => {
		mockExecuteAppGraphQL.mockResolvedValue(
			zones([
				{
					node: {
						id: "zone-1",
						__typename: "ShippingZone" as const,
						shippingMethods: [
							method("m-1", "Standard", "ae", 25, undefined, 2, 4),
							method("m-2", "Express", "ae", 50, 200, 1, 1),
						],
					},
				},
			]),
		);

		await expect(resolveShippingMethods("ae")).resolves.toEqual([
			{
				id: "m-1",
				name: "Standard",
				price: { amount: 25, currency: "AED" },
				minimumOrderPrice: null,
				minimumDeliveryDays: 2,
				maximumDeliveryDays: 4,
			},
			{
				id: "m-2",
				name: "Express",
				price: { amount: 50, currency: "AED" },
				minimumOrderPrice: { amount: 200, currency: "AED" },
				minimumDeliveryDays: 1,
				maximumDeliveryDays: 1,
			},
		]);
	});

	it("ignores other-channel listings and methods with no channel listing for the channel", async () => {
		mockExecuteAppGraphQL.mockResolvedValue(
			zones([
				{
					node: {
						id: "zone-1",
						__typename: "ShippingZone" as const,
						shippingMethods: [
							method("m-1", "Standard", "ae", 25),
							method("m-2", "On bh only", "bh", 30, 100),
							{
								id: "m-3",
								name: "No listing",
								__typename: "ShippingMethodType" as const,
								minimumDeliveryDays: null,
								maximumDeliveryDays: null,
								channelListings: null,
							},
						],
					},
				},
			]),
		);

		await expect(resolveShippingMethods("ae")).resolves.toEqual([
			{
				id: "m-1",
				name: "Standard",
				price: { amount: 25, currency: "AED" },
				minimumOrderPrice: null,
				minimumDeliveryDays: null,
				maximumDeliveryDays: null,
			},
		]);
	});

	it("returns [] when no SALEOR_APP_TOKEN", async () => {
		process.env.SALEOR_APP_TOKEN = "";
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

		await expect(resolveShippingMethods("ae")).resolves.toEqual([]);
		expect(mockExecuteAppGraphQL).not.toHaveBeenCalled();
	});

	it("returns [] when the query fails", async () => {
		mockExecuteAppGraphQL.mockResolvedValue({ ok: false, error: new Error("boom") });

		await expect(resolveShippingMethods("ae")).resolves.toEqual([]);
	});

	it("returns [] when shippingZones is null", async () => {
		mockExecuteAppGraphQL.mockResolvedValue({ ok: true as const, data: { shippingZones: null } });

		await expect(resolveShippingMethods("ae")).resolves.toEqual([]);
	});
});
