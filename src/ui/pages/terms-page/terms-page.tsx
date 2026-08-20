import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { PageHero } from "@/ui/components/page-hero";
import { LegalSection } from "@/ui/sections/legal-section";

interface TermsOfServiceProps {
	currencyCode: string;
}

export function TermsOfService({ currencyCode }: TermsOfServiceProps) {
	return (
		<div className="w-full">
			<PageHero
				eyebrow="Legal"
				title="Terms of Service"
				subtitle="The agreement between you and Arteze when you shop with us."
			/>

			<div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
				<p className="mb-12 border-b border-secondary-foreground/10 pb-6 text-sm uppercase tracking-widest text-secondary-foreground/50">
					Last updated: 6 August 2026
				</p>

				<LegalSection title="Agreement to These Terms">
					<p>
						By browsing arteze.shop or placing an order, you agree to these terms. If you do not agree with
						them, please do not use the site. These terms apply alongside our{" "}
						<LinkWithChannel href="/privacy" className="text-primary hover:underline">
							Privacy Policy
						</LinkWithChannel>{" "}
						and{" "}
						<LinkWithChannel href="/shipping" className="text-primary hover:underline">
							Shipping & Returns
						</LinkWithChannel>{" "}
						policy.
					</p>
				</LegalSection>

				<LegalSection title="About Our Products">
					<p>
						Every piece sold by Arteze is handmade by independent artisans. Because these are not factory
						goods, variations in colour, weave, dye depth, dimensions, and finish are expected and are not
						defects — they are the signature of the maker.
					</p>
					<p>
						Product photography is representative. Natural dyes and hand-loomed textiles will differ slightly
						from piece to piece, and screen calibration can affect how colour appears.
					</p>
				</LegalSection>

				<LegalSection title="Orders & Pricing">
					<p>
						Placing an order is an offer to purchase. We confirm your order by email once payment is
						authorised. Because our stock is small-batch and often one-of-a-kind, we reserve the right to
						decline or cancel an order if an item sells out, if pricing was listed in error, or if we suspect
						fraudulent activity. In those cases you will be refunded in full.
					</p>
					<p>
						All prices are shown in {currencyCode} and exclude taxes and duties unless otherwise stated at
						checkout.
					</p>
				</LegalSection>

				<LegalSection title="Accounts">
					<p>
						You are responsible for keeping your account credentials secure and for activity that takes place
						under your account. Please let us know promptly if you believe your account has been accessed
						without your permission.
					</p>
				</LegalSection>

				<LegalSection title="Intellectual Property">
					<p>
						The Arteze name, wordmark, block-print pattern artwork, photography, and Journal articles are the
						property of Arteze or our artisan partners. You may not reproduce or use them commercially without
						written permission. Traditional craft motifs remain the cultural heritage of the communities that
						create them.
					</p>
				</LegalSection>

				<LegalSection title="Acceptable Use">
					<p>
						Please do not misuse the site — that includes attempting to disrupt it, scraping product data,
						reselling our imagery, or submitting false orders. We may suspend access where these terms are
						broken.
					</p>
				</LegalSection>

				<LegalSection title="Limitation of Liability">
					<p>
						To the extent permitted by law, Arteze is not liable for indirect or consequential loss arising
						from your use of the site. Our total liability for any order is limited to the amount you paid for
						that order.
					</p>
				</LegalSection>

				<LegalSection title="Contact">
					<p>
						Questions about these terms can be sent to{" "}
						<a href="mailto:info@arteze.shop" className="text-primary hover:underline">
							info@arteze.shop
						</a>
						.
					</p>
				</LegalSection>
			</div>
		</div>
	);
}
