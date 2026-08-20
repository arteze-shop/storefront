"use client";

import { useState, type FC } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { type AddressFragment, type CheckoutFragment } from "@/checkout/graphql";
import { Button } from "@/ui/components/ui/button";
import { LoadingSpinner } from "@/checkout/ui-kit/loading-spinner";
import {
	isCheckoutFreeOrder,
	type CheckoutPriceChangeNotice,
} from "@/checkout/lib/payment/checkout-pay-amount";
import { clearPaymentCompleting } from "@/checkout/lib/payment/checkout-payment-completion";
import { completeFreeOrderCheckout } from "@/checkout/lib/payment/complete-free-order-checkout";
import { rethrowNextInternalError } from "@/checkout/lib/rethrow-next-internal-error";
import { useCheckoutData } from "@/checkout/providers/checkout-data";
import { formatMoneyWithFallback } from "@/checkout/lib/utils/money";
import { PaymentTrustSignals } from "@/checkout/components/payment/payment-trust-signals";
import { executeZiinaPayment } from "@/checkout/lib/payment/providers/ziina-pay";
import { useCheckoutPaymentMessages } from "@/checkout/hooks/use-checkout-payment-messages";
import { useCheckoutGatewayMessages } from "@/checkout/hooks/use-checkout-gateway-messages";
import { type BillingAddressData } from "@/checkout/components/payment";

export type ZiinaBillingContext = {
	billingData: BillingAddressData;
	sameAsBilling: boolean;
	hasShippingAddress: boolean;
	shippingAddress: AddressFragment | null | undefined;
	userAddresses: ReadonlyArray<AddressFragment> | undefined;
	authenticated: boolean;
};

type ZiinaPaymentProps = {
	checkout: CheckoutFragment;
	gatewayName?: string | null;
	billing: ZiinaBillingContext;
	onPaymentError: (message: string) => void;
	onBillingErrors: (errors: Record<string, string>, focusField?: string) => void;
	onPriceChangeNotice: (notice: CheckoutPriceChangeNotice) => void;
	onPaymentActivityChange?: (active: boolean) => void;
};

export const ZiinaPayment: FC<ZiinaPaymentProps> = (props) => {
	if (isCheckoutFreeOrder(props.checkout)) {
		return (
			<ZiinaFreeOrderCheckout
				checkout={props.checkout}
				billing={props.billing}
				onError={props.onPaymentError}
				onBillingErrors={props.onBillingErrors}
				onPaymentActivityChange={props.onPaymentActivityChange}
			/>
		);
	}

	return <ZiinaPaidPayment {...props} />;
};

type ZiinaFreeOrderCheckoutProps = {
	checkout: CheckoutFragment;
	billing: ZiinaBillingContext;
	onError: (message: string) => void;
	onBillingErrors: (errors: Record<string, string>, focusField?: string) => void;
	onPaymentActivityChange?: (active: boolean) => void;
};

/** Completes a $0 checkout without a Ziina transaction. */
const ZiinaFreeOrderCheckout: FC<ZiinaFreeOrderCheckoutProps> = ({
	checkout,
	billing,
	onError,
	onBillingErrors,
	onPaymentActivityChange,
}) => {
	const { refreshCheckout } = useCheckoutData();
	const paymentMessages = useCheckoutPaymentMessages();
	const tActions = useTranslations("checkout.actions");
	const [isLoading, setIsLoading] = useState(false);
	const totalStr = formatMoneyWithFallback(checkout.totalPrice?.gross);

	const handleComplete = async () => {
		onError("");
		setIsLoading(true);
		onPaymentActivityChange?.(true);
		let orderPlaced = false;

		try {
			const result = await completeFreeOrderCheckout({
				checkout,
				billingData: billing.billingData,
				sameAsBilling: billing.sameAsBilling,
				hasShippingAddress: billing.hasShippingAddress,
				shippingAddress: billing.shippingAddress,
				userAddresses: billing.userAddresses,
				authenticated: billing.authenticated,
				refreshCheckout,
			});

			if (!result.ok) {
				if (result.kind === "billing") {
					onBillingErrors(result.errors, result.focusField);
				} else {
					onError(result.error);
				}
				return;
			}

			orderPlaced = true;
		} catch (error) {
			rethrowNextInternalError(error);
			console.error("Free order completion failed:", error);
			onError(paymentMessages.completeOrderFailed);
		} finally {
			if (!orderPlaced) {
				clearPaymentCompleting();
				setIsLoading(false);
				onPaymentActivityChange?.(false);
			}
		}
	};

	return (
		<div className="space-y-4 rounded-lg border border-border bg-muted/30 p-6">
			<p className="text-sm text-muted-foreground">{paymentMessages.freeOrderBody(totalStr)}</p>
			<PaymentTrustSignals />
			<Button
				type="button"
				className="h-12 w-full md:w-auto md:min-w-[200px]"
				disabled={isLoading}
				onClick={() => void handleComplete()}
			>
				{isLoading ? (
					<span className="flex items-center justify-center gap-2">
						<LoadingSpinner />
						{tActions("placingOrder")}
					</span>
				) : (
					tActions("completeOrder")
				)}
			</Button>
		</div>
	);
};

const ZiinaPaidPayment: FC<ZiinaPaymentProps> = ({
	checkout,
	gatewayName,
	billing,
	onPaymentError,
	onBillingErrors,
	onPriceChangeNotice,
	onPaymentActivityChange,
}) => {
	const { refreshCheckout } = useCheckoutData();
	const paymentMessages = useCheckoutPaymentMessages();
	const gatewayMessages = useCheckoutGatewayMessages();
	const tSteps = useTranslations("checkout.steps");
	const tActions = useTranslations("checkout.actions");
	const tPayment = useTranslations("checkout.payment");
	const [isLoading, setIsLoading] = useState(false);
	const totalStr = formatMoneyWithFallback(checkout.totalPrice?.gross);

	const handlePay = async () => {
		onPaymentError("");
		setIsLoading(true);
		onPaymentActivityChange?.(true);
		let navigatingAway = false;

		const result = await executeZiinaPayment({
			checkout,
			billing,
			refreshCheckout,
			paymentMessages,
			gatewayMessages,
		});

		if (result.ok) {
			// `window.location.assign` is already navigating to Ziina — keep the completing
			// flag so the return flow (`ZiinaCheckoutCompletionHost`) can resume.
			navigatingAway = true;
		} else if (result.kind === "billing") {
			onBillingErrors(result.errors, result.focusField);
		} else if (result.kind === "price_change") {
			onPriceChangeNotice(result.notice);
		} else {
			onPaymentError(result.message);
		}

		if (!navigatingAway) {
			clearPaymentCompleting();
			setIsLoading(false);
			onPaymentActivityChange?.(false);
		}
	};

	return (
		<section className="space-y-3">
			<h2 className="font-fraunces text-lg font-semibold">{tSteps("payment")}</h2>
			<div className="space-y-4 rounded-lg border border-border bg-muted/30 p-6">
				<p className="flex items-start gap-2 text-sm text-muted-foreground">
					<ExternalLink className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
					<span>
						<span className="text-foreground">{gatewayName ?? tPayment("ziinaGateway")}</span>
						{" · "}
						{paymentMessages.ziinaRedirecting}
					</span>
				</p>
				<PaymentTrustSignals />
				<Button
					type="button"
					className="h-12 w-full md:w-auto md:min-w-[200px]"
					disabled={isLoading}
					onClick={() => void handlePay()}
				>
					{isLoading ? (
						<span className="flex items-center justify-center gap-2">
							<LoadingSpinner />
							{paymentMessages.ziinaRedirecting}
						</span>
					) : (
						tActions("payTotal", { total: totalStr })
					)}
				</Button>
			</div>
		</section>
	);
};
