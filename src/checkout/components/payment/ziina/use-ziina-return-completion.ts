"use client";

import { useEffect, useRef } from "react";
import { getCheckoutTransport } from "@/checkout/lib/checkout-transport";
import {
	clearPaymentCompleting,
	isPaymentCompletingOrphaned,
	stashPaymentCompletionError,
} from "@/checkout/lib/payment/checkout-payment-completion";
import { useCheckoutPaymentMessages } from "@/checkout/hooks/use-checkout-payment-messages";
import { isCheckoutReadyToComplete } from "@/checkout/lib/payment/checkout-payment-status";
import { finalizeCheckoutOrder } from "@/checkout/lib/payment/finalize-checkout-order";
import { rethrowNextInternalError } from "@/checkout/lib/rethrow-next-internal-error";

type UseZiinaReturnCompletionParams = {
	checkoutId: string;
	onError: (message: string) => void;
};

/**
 * Resumes the payment flow after the shopper returns from Ziina's hosted page.
 * A page reload kills the process/finalize pipeline but leaves the completing flag
 * in sessionStorage — `isPaymentCompletingOrphaned` marks it as ours to finish.
 */
export function useZiinaReturnCompletion({ checkoutId, onError }: UseZiinaReturnCompletionParams) {
	const paymentMessages = useCheckoutPaymentMessages();
	const isProcessingRef = useRef(false);
	const resumeAttemptedRef = useRef(false);

	useEffect(() => {
		if (isProcessingRef.current || resumeAttemptedRef.current) {
			return;
		}

		const orphaned = isPaymentCompletingOrphaned(checkoutId);
		if (!orphaned) {
			return;
		}

		isProcessingRef.current = true;
		resumeAttemptedRef.current = true;

		const resumeAfterReload = async () => {
			let keepProcessingLock = false;

			try {
				const syncResult = await getCheckoutTransport().fetchCheckout(checkoutId);
				if (!syncResult.ok || !syncResult.checkout) {
					// Cannot verify — exit the completing screen and warn against paying again.
					stashPaymentCompletionError(paymentMessages.verificationUnavailable);
					clearPaymentCompleting();
					onError(paymentMessages.verificationUnavailable);
					return;
				}

				if (!isCheckoutReadyToComplete(syncResult.checkout)) {
					// The hosted payment never produced an authorization — safe to pay fresh.
					clearPaymentCompleting();
					return;
				}

				const completeResult = await finalizeCheckoutOrder(checkoutId, syncResult.checkout.channel.slug);
				if (!completeResult.ok) {
					onError(completeResult.error);
					return;
				}

				// Success: hold the processing lock until navigateToOrderConfirmation unloads the page.
				keepProcessingLock = true;
			} catch (error) {
				rethrowNextInternalError(error);
				console.error("Resuming interrupted Ziina payment failed:", error);
				stashPaymentCompletionError(paymentMessages.verificationUnavailable);
				clearPaymentCompleting();
				onError(paymentMessages.verificationUnavailable);
			} finally {
				if (!keepProcessingLock) {
					isProcessingRef.current = false;
				}
			}
		};

		void resumeAfterReload();
	}, [checkoutId, onError, paymentMessages]);
}
