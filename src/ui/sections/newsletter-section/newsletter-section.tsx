import { Section, type SectionTone } from "@/ui/sections/section";
import { NewsletterSectionForm } from "./custom-form";
import { SectionHeader } from "@/ui/sections/section-header";

export interface NewsletterBlockProps {
	heading?: string;
	eyebrow?: string;
	paragraph: string;
	tone?: SectionTone;
	className?: string;
}

export function NewsletterSection({
	heading,
	eyebrow,
	paragraph,
	tone = "default",
	className,
}: NewsletterBlockProps) {
	const headingId = "newsletter-heading";

	return (
		<Section tone={tone} bleed className={className} aria-labelledby={heading ? headingId : undefined}>
			<SectionHeader id={headingId} eyebrow={eyebrow} heading={heading} intro={paragraph} align="center" />
			<NewsletterSectionForm />
		</Section>
	);
}
