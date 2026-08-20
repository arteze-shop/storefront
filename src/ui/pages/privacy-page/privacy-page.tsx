import { PageHero } from "@/ui/components/page-hero";
import { LegalSection } from "@/ui/sections/legal-section";
import { NavHrefLink } from "@/ui/atoms/nav-href-link";
import { buttonClassName } from "@/ui/components/ui/button";

interface Cta {
	label: string;
	href: string;
}

function CtaLink({ cta, className }: { cta: Cta; className: string }) {
	return (
		<NavHrefLink href={cta.href} className={className}>
			{cta.label}
		</NavHrefLink>
	);
}

export function PrivacyPolicy() {
	return (
		<div className="w-full">
			<PageHero
				eyebrow="Legal"
				title="Privacy Policy"
				subtitle="How Arteze collects, uses, and protects your information."
			/>

			<div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
				<p className="mb-12 border-b border-secondary-foreground/15 pb-6 text-sm uppercase tracking-widest text-secondary-foreground/50">
					Last updated: 6 August 2026
				</p>

				<LegalSection title="Who We Are">
					<p>
						Arteze is a curated marketplace for handmade home goods sourced directly from independent artisans
						and craft cooperatives around the world, with a particular focus on India. We do not manufacture
						in-house. This policy explains what happens to your personal information when you shop with us or
						browse arteze.shop.
					</p>
				</LegalSection>

				<LegalSection title="Information We Collect">
					<p>We only collect what we need to run the shop well:</p>
					<ul className="list-disc space-y-2 pl-5 marker:text-primary">
						<li>
							<span className="font-medium text-secondary-foreground">Order information</span> — your name,
							shipping and billing address, email, and phone number, so we can deliver your rugs, throws,
							cushion covers, and accessories.
						</li>
						<li>
							<span className="font-medium text-secondary-foreground">Payment details</span> — processed
							securely by our payment provider. Arteze never sees or stores your full card number.
						</li>
						<li>
							<span className="font-medium text-secondary-foreground">Account and wishlist data</span> — saved
							items and order history, stored so you can pick up where you left off.
						</li>
						<li>
							<span className="font-medium text-secondary-foreground">Usage data</span> — pages viewed and
							products browsed, which helps us understand which artisan collections resonate.
						</li>
					</ul>
				</LegalSection>

				<LegalSection title="How We Use Your Information">
					<p>
						We use your information to process and ship orders, respond to questions about a piece or its
						maker, handle returns, prevent fraud, and — only if you have opted in — send you the Arteze
						Journal and early access to new artisan collections. You can unsubscribe from marketing email at
						any time using the link in any message.
					</p>
				</LegalSection>

				<LegalSection title="Sharing Your Information">
					<p>
						We share your details only with the partners required to fulfil your order: our payment processor,
						shipping and customs carriers, and the email platform that sends your order confirmations. Where
						an item ships directly from an artisan workshop, we share only the delivery details needed to get
						the piece to you. We never sell your personal information.
					</p>
				</LegalSection>

				<LegalSection title="Cookies">
					<p>
						We use essential cookies to keep your cart and wishlist intact between visits, and analytics
						cookies to understand how the shop is used. You can clear or block cookies in your browser
						settings, though your cart may not persist if you do.
					</p>
				</LegalSection>

				<LegalSection title="Data Retention & Your Rights">
					<p>
						We keep order records for as long as required for tax and accounting purposes, and account data
						until you ask us to remove it. You have the right to access, correct, export, or delete your
						personal information, and to object to marketing at any time.
					</p>
					<p>
						To make a request, email{" "}
						<a href="mailto:info@arteze.shop" className="text-brand-coral hover:underline">
							info@arteze.shop
						</a>{" "}
						and we will respond within 30 days.
					</p>
				</LegalSection>

				<LegalSection title="Changes to This Policy">
					<p>
						We may update this policy as the shop evolves. Material changes will be announced on this page
						with a revised date above.
					</p>
				</LegalSection>

				<div className="relative overflow-hidden bg-secondary/50 p-8">
					<div
						className="pattern-overlay-light pointer-events-none absolute right-0 top-0 h-full w-40 opacity-30"
						aria-hidden="true"
					></div>
					<div className="relative z-10">
						<h3 className="mb-2 font-fraunces text-xl text-secondary-foreground">
							Questions about your data?
						</h3>
						<p className="mb-4 font-light text-secondary-foreground/80">
							We are happy to walk you through anything in this policy.
						</p>
						<CtaLink
							cta={{ href: "/contact", label: "Contact Us" }}
							className={buttonClassName({
								asLink: true,
								size: "default",
								variant: "default",
								className: "h-auto rounded-full px-7 py-3.5 text-sm font-semibold",
							})}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
