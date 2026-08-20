import { useCallback, useEffect, useRef, useState } from "react";

import { calculateDeliveryOptions } from "@/app/(checkout)/actions";
import { hasStaleDeliveryProblem } from "@/checkout/lib/delivery-problems";
import type { DeliveryOption, ServerCheckout } from "@/checkout/lib/checkout-types";
import { shippingDeliveriesCacheKey } from "@/checkout/lib/shipping-deliveries";

export function useShippingDeliveries(checkout: ServerCheckout | null, isActive: boolean) {
	const [deliveries, setDeliveries] = useState<DeliveryOption[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [loadedKey, setLoadedKey] = useState<string | null>(null);
	const prevStaleRef = useRef(false);

	const isStale = hasStaleDeliveryProblem(checkout);

	const loadDeliveries = useCallback(
		async (force = false) => {
			if (!checkout) return;
			const key = shippingDeliveriesCacheKey(checkout);
			if (!key) return;
			if (!force && loadedKey === key) return;

			setIsLoading(true);
			try {
				const result = await calculateDeliveryOptions(checkout.id);
				if (result.ok) {
					setDeliveries(result.deliveries);
				} else {
					setDeliveries([]);
				}
				setLoadedKey(key);
			} finally {
				setIsLoading(false);
			}
		},
		[checkout, loadedKey],
	);

	useEffect(() => {
		if (!isActive) return;
		const id = setTimeout(() => {
			void loadDeliveries();
		}, 0);
		return () => clearTimeout(id);
	}, [isActive, loadDeliveries]);

	useEffect(() => {
		if (!isActive || !checkout) return;
		if (isStale && !prevStaleRef.current) {
			const id = setTimeout(() => {
				setLoadedKey(null);
				void loadDeliveries(true);
			}, 0);
			prevStaleRef.current = isStale;
			return () => clearTimeout(id);
		}
		prevStaleRef.current = isStale;
	}, [isStale, isActive, checkout, loadDeliveries]);

	const cacheKey = isActive && checkout ? shippingDeliveriesCacheKey(checkout) : null;
	const awaitingFetch = cacheKey !== null && loadedKey !== cacheKey;

	return { deliveries, isLoading: isLoading || awaitingFetch };
}
