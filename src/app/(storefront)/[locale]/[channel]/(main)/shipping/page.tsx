import { resolveFreeShippingThreshold, resolveShippingMethods } from "@/lib/content/server";
import { resolveChannelCurrency } from "@/lib/channels/resolve-channel-currency";
import { resolveLocaleFromSlug } from "@/config/locale";
import { ShippingReturns } from "@/ui/pages/shipping-page/shipping-page";

export default async function ShippingPage({
	params,
}: {
	params: Promise<{ locale: string; channel: string }>;
}) {
	const { locale, channel } = await params;
	const [currencyCode, freeShippingThreshold, shippingMethods] = await Promise.all([
		resolveChannelCurrency(channel),
		resolveFreeShippingThreshold(channel),
		resolveShippingMethods(channel),
	]);
	const bcp47 = resolveLocaleFromSlug(locale).bcp47;

	return (
		<ShippingReturns
			channel={channel}
			currencyCode={currencyCode}
			locale={bcp47}
			freeShippingThreshold={freeShippingThreshold}
			shippingMethods={shippingMethods}
		/>
	);
}
