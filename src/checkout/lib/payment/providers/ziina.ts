import { type PaymentGatewayLike } from "../types";

/** Saleor Ziina app gateway id. */
export const ZIINA_GATEWAY_ID = "saleor.app.payment.ziina";

/** Shown when Ziina is on the checkout but the storefront flag is off. */
export const ZIINA_PAYMENT_NOT_ENABLED_MESSAGE =
	"Ziina payments are not enabled in this environment. Set NEXT_PUBLIC_ENABLE_ZIINA_PAYMENTS=true on the storefront.";

export function isZiinaGateway(gatewayId: string): boolean {
	return gatewayId === ZIINA_GATEWAY_ID;
}

export function findZiinaGateway(
	gateways: ReadonlyArray<PaymentGatewayLike> | null | undefined,
): PaymentGatewayLike | undefined {
	return gateways?.find((gateway) => isZiinaGateway(gateway.id));
}

/**
 * Ziina is a hosted-redirect gateway — opt-in via env (required on cloud/staging
 * where NODE_ENV is production).
 */
export function isZiinaPaymentEnabled(): boolean {
	if (process.env.ENABLE_ZIINA_PAYMENTS === "true") {
		return true;
	}
	if (process.env.NEXT_PUBLIC_ENABLE_ZIINA_PAYMENTS === "true") {
		return true;
	}
	return process.env.NODE_ENV === "development";
}

/**
 * Server-side guard for transactionInitialize — blocks Ziina when the storefront flag is off.
 */
export function getZiinaPaymentGuardError(gatewayId: string | null | undefined): string | null {
	if (!gatewayId || !isZiinaGateway(gatewayId)) {
		return null;
	}
	if (isZiinaPaymentEnabled()) {
		return null;
	}
	return ZIINA_PAYMENT_NOT_ENABLED_MESSAGE;
}

export type ZiinaTransactionData = {
	paymentIntent?: { redirectUrl?: string };
};

export function parseZiinaTransactionData(data: unknown): ZiinaTransactionData | null {
	if (!data || typeof data !== "object") {
		return null;
	}

	const record = data as Record<string, unknown>;
	const paymentIntent = record.paymentIntent;

	if (!paymentIntent || typeof paymentIntent !== "object") {
		return null;
	}

	const intentRecord = paymentIntent as Record<string, unknown>;
	const redirectUrl = intentRecord.redirectUrl;

	return {
		paymentIntent: {
			redirectUrl: typeof redirectUrl === "string" ? redirectUrl : undefined,
		},
	};
}

export function getZiinaRedirectUrl(data: unknown): string | null {
	const parsed = parseZiinaTransactionData(data);
	const redirectUrl = parsed?.paymentIntent?.redirectUrl?.trim();
	return redirectUrl ? redirectUrl : null;
}
