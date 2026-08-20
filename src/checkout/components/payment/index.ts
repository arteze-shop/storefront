/** Payment components: billing address and integrated provider UI. */

export { PaymentGatewayAlerts } from "./payment-gateway-alerts";

export { PaymentMethodArea } from "./payment-method-area";

export { IntegratedPaymentUi } from "./integrated-payment-ui";

export { ZiinaPayment, type ZiinaBillingContext } from "./ziina/ziina-payment";

export { ZiinaCheckoutCompletionHost } from "./ziina/ziina-checkout-completion-host";

export { PaymentError } from "./payment-error";

export {
	PaymentTrustSignals,
	type PaymentTrustProvider,
	type PaymentTrustSignalsProps,
} from "./payment-trust-signals";

export { DummyPaymentPlaceholder, type DummyPaymentPlaceholderProps } from "./dummy-payment-placeholder";

export {
	BillingAddressSection,
	useBillingAddressValidation,
	type BillingAddressData,
	type BillingAddressSectionProps,
} from "./billing-address-section";
