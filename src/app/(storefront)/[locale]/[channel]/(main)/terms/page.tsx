import { resolveChannelCurrency } from "@/lib/channels/resolve-channel-currency";
import { TermsOfService } from "@/ui/pages/terms-page/terms-page";

export default async function TermsPage({
	params,
}: {
	params: Promise<{ locale: string; channel: string }>;
}) {
	const { channel } = await params;
	const currencyCode = await resolveChannelCurrency(channel);

	return <TermsOfService currencyCode={currencyCode} />;
}
