import { getStorefrontContent } from "@/lib/content/get-storefront-content";
import { resolveContactContent } from "@/lib/content/contact";
import { ContactPage } from "@/ui/sections/contact-page/contact-page";

export default async function Contact({ params }: { params: Promise<{ locale: string; channel: string }> }) {
	const { locale, channel } = await params; // ae, bh, default-channel, etc..
	const content = await getStorefrontContent(channel, locale);
	const contact = resolveContactContent(content.surfaces.contact, channel);

	return <ContactPage phone={contact.phone} address={contact.address} />;
}
