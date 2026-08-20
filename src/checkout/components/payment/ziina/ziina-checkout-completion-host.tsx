"use client";

import { isPaymentCompletingOrphaned } from "@/checkout/lib/payment/checkout-payment-completion";
import { useCheckoutSession } from "@/checkout/providers/checkout-session";
import { useCheckoutPaymentReturnError } from "@/checkout/providers/checkout-payment-return-error";
import { useZiinaReturnCompletion } from "./use-ziina-return-completion";

function ZiinaReturnCompletion({ checkoutId }: { checkoutId: string }) {
	const { setError } = useCheckoutPaymentReturnError();

	useZiinaReturnCompletion({
		checkoutId,
		onError: setError,
	});

	return null;
}

/**
 * Mounted at app shell level so return completion keeps running even when the
 * checkout step UI switches to the processing screen. Only mounts when there is a
 * leftover completing flag from the Ziina redirect (i.e. the return navigation).
 */
export function ZiinaCheckoutCompletionHost() {
	const { checkoutId } = useCheckoutSession();

	if (!checkoutId) {
		return null;
	}

	// A completing flag that survived a reload means the process/finalize pipeline died
	// with the Ziina-hosted page — mount so the resume flow can finish the order.
	if (!isPaymentCompletingOrphaned(checkoutId)) {
		return null;
	}

	return <ZiinaReturnCompletion checkoutId={checkoutId} />;
}
