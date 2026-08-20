import { type CheckoutFragment } from "@/checkout/graphql";
import { getCheckoutTransport } from "@/checkout/lib/checkout-transport";
import {
	buildCheckoutPriceChangeNotice,
	getCheckoutPayAmount,
	getCheckoutPayCurrency,
	hasMaterialCheckoutTotalChange,
	type CheckoutPriceChangeNotice,
} from "@/checkout/lib/payment/checkout-pay-amount";
import {
	clearPaymentCompleting,
	markPaymentCompleting,
} from "@/checkout/lib/payment/checkout-payment-completion";
import {
	getTransactionInitializeError,
	type CheckoutGatewayMessages,
} from "@/checkout/lib/payment/gateway-messages";
import { ZIINA_GATEWAY_ID } from "@/checkout/lib/payment";
import { buildCheckoutPath } from "@paper/session-bridge";
import { getZiinaRedirectUrl } from "@/checkout/lib/payment/providers/ziina";
import { updateCheckoutBilling } from "@/checkout/lib/payment/update-billing";
import { rethrowNextInternalError } from "@/checkout/lib/rethrow-next-internal-error";
import type { CheckoutPaymentMessages } from "@/checkout/hooks/use-checkout-payment-messages";
import { type ZiinaBillingContext } from "@/checkout/components/payment/ziina/ziina-payment";

export type ZiinaCheckoutPayResult =
	| { ok: true; kind: "redirect" }
	| { ok: false; kind: "error"; message: string }
	| { ok: false; kind: "billing"; errors: Record<string, string>; focusField?: string }
	| { ok: false; kind: "price_change"; notice: CheckoutPriceChangeNotice };

type ExecuteZiinaPaymentParams = {
	checkout: CheckoutFragment;
	billing: ZiinaBillingContext;
	refreshCheckout: (options?: { updateState?: boolean }) => Promise<CheckoutFragment | null>;
	paymentMessages: CheckoutPaymentMessages;
	gatewayMessages: CheckoutGatewayMessages;
};

let payInFlight: Promise<ZiinaCheckoutPayResult> | null = null;

/**
 * Single-flight wrapper: a double click must not run `transactionInitialize` twice
 * (duplicate Saleor transactions are the classic path to CHECKOUT_NOT_FULLY_PAID).
 * Followers join the in-flight attempt and receive its result.
 */
export async function executeZiinaPayment(
	params: ExecuteZiinaPaymentParams,
): Promise<ZiinaCheckoutPayResult> {
	if (payInFlight) {
		return payInFlight;
	}

	const run = runZiinaPayment(params);
	payInFlight = run;

	try {
		return await run;
	} finally {
		if (payInFlight === run) {
			payInFlight = null;
		}
	}
}

async function runZiinaPayment({
	checkout,
	billing,
	refreshCheckout,
	paymentMessages,
	gatewayMessages,
}: ExecuteZiinaPaymentParams): Promise<ZiinaCheckoutPayResult> {
	try {
		const billingResult = await updateCheckoutBilling({
			checkoutId: checkout.id,
			sameAsBilling: billing.sameAsBilling,
			hasShippingAddress: billing.hasShippingAddress,
			billingData: billing.billingData,
			shippingAddress: billing.shippingAddress,
			userAddresses: billing.userAddresses,
			authenticated: billing.authenticated,
		});

		if (!billingResult.ok) {
			return {
				ok: false,
				kind: "billing",
				errors: billingResult.errors,
				focusField: billingResult.focusField,
			};
		}

		const liveCheckout = await refreshCheckout({ updateState: false });
		if (!liveCheckout) {
			return { ok: false, kind: "error", message: paymentMessages.totalsRefreshFailed };
		}

		const displayedAmount = getCheckoutPayAmount(checkout);
		const payAmount = getCheckoutPayAmount(liveCheckout);
		if (payAmount === null) {
			return { ok: false, kind: "error", message: paymentMessages.totalUnavailable };
		}

		const currency = getCheckoutPayCurrency(liveCheckout);
		if (!currency) {
			return { ok: false, kind: "error", message: paymentMessages.currencyUnavailable };
		}

		if (displayedAmount !== null && hasMaterialCheckoutTotalChange(displayedAmount, payAmount)) {
			return {
				ok: false,
				kind: "price_change",
				notice: buildCheckoutPriceChangeNotice(displayedAmount, payAmount, currency),
			};
		}

		// From here on the completing flag is set — every failure path must clear it so
		// the shopper can pay again without triggering the return-completion resume flow.
		markPaymentCompleting(liveCheckout.id);

		const returnUrl = new URL(
			buildCheckoutPath({
				checkoutId: liveCheckout.id,
				step: "payment",
				browseLocale: new URLSearchParams(window.location.search).get("locale") ?? undefined,
			}),
			window.location.origin,
		).toString();

		const initResult = await getCheckoutTransport().initializeTransaction({
			checkoutId: liveCheckout.id,
			amount: payAmount,
			paymentGateway: {
				id: ZIINA_GATEWAY_ID,
				data: {
					returnUrl,
				},
			},
		});

		if (!initResult.ok) {
			clearPaymentCompleting();
			return { ok: false, kind: "error", message: initResult.error };
		}

		const initError = getTransactionInitializeError(initResult.data, gatewayMessages);
		if (initError) {
			clearPaymentCompleting();
			return { ok: false, kind: "error", message: initError };
		}

		const redirectUrl = getZiinaRedirectUrl(initResult.data.data);
		if (!redirectUrl) {
			clearPaymentCompleting();
			return { ok: false, kind: "error", message: paymentMessages.detailsUnavailable };
		}

		// Redirect to Ziina's hosted payment page. The completing flag is intentionally
		// left set: when the shopper returns, `ZiinaCheckoutCompletionHost` resumes the
		// process/finalize pipeline that died with this page load.
		window.location.assign(redirectUrl);

		return { ok: true, kind: "redirect" };
	} catch (error) {
		rethrowNextInternalError(error);
		console.error("Ziina payment failed:", error);
		clearPaymentCompleting();
		return { ok: false, kind: "error", message: paymentMessages.unexpectedError };
	}
}
