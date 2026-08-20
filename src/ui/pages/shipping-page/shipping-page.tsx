// import Link from "next/link";
import { NavHrefLink } from "@/ui/atoms/nav-href-link";
import { buttonClassName } from "@/ui/components/ui/button";
import { PageHero } from "@/ui/components/page-hero";
import { LegalSection } from "@/ui/sections/legal-section";
import { Truck, RotateCcw, PackageCheck } from "lucide-react";
import { formatPrice } from "@/config/locale";
import type { ShippingMethodInfo } from "@/lib/content/resolve-shipping-methods";

const DEFAULT_SHIPPING_RATES = [
	{ method: "Standard", time: "1–2 business days", cost: "Free over $150, otherwise $15" },
	// { method: "Express", time: "1–2 business days", cost: "$28" },
	// { method: "International", time: "7–14 business days", cost: "Calculated at checkout" },
	// { method: "Oversized rugs", time: "5–10 business days", cost: "Free over $150, otherwise $35" },
];

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

interface ShippingReturnsProps {
	channel: string;
	currencyCode: string;
	locale: string; // bcp47
	freeShippingThreshold: number | null;
	shippingMethods: ShippingMethodInfo[];
}

export function ShippingReturns({
	currencyCode,
	locale,
	freeShippingThreshold,
	shippingMethods,
}: ShippingReturnsProps) {
	const formatTime = (method: ShippingMethodInfo): string => {
		const { minimumDeliveryDays, maximumDeliveryDays } = method;
		if (minimumDeliveryDays != null && maximumDeliveryDays != null) {
			return `${minimumDeliveryDays}–${maximumDeliveryDays} business days`;
		}
		if (minimumDeliveryDays != null) {
			return `${minimumDeliveryDays} business days`;
		}
		if (maximumDeliveryDays != null) {
			return `${maximumDeliveryDays} business days`;
		}
		return "Estimated at checkout";
	};

	const formatCost = (method: ShippingMethodInfo): string => {
		const { price, minimumOrderPrice } = method;
		if (price == null) {
			return "Calculated at checkout";
		}
		if (price.amount === 0) {
			if (minimumOrderPrice != null && minimumOrderPrice.amount > 0) {
				return `Free over ${formatPrice(minimumOrderPrice.amount, currencyCode, locale)}`;
			}
			return "Free";
		}
		return formatPrice(price.amount, currencyCode, locale);
	};

	const rates =
		shippingMethods.length > 0
			? shippingMethods.map((method) => ({
					method: method.name,
					time: formatTime(method),
					cost: formatCost(method),
				}))
			: DEFAULT_SHIPPING_RATES;

	const freeShippingText =
		freeShippingThreshold != null
			? `On all orders over ${formatPrice(freeShippingThreshold, currencyCode, locale)}`
			: "On all orders";

	return (
		<div className="w-full">
			<PageHero
				eyebrow="Customer Care"
				title="Shipping & Returns"
				subtitle="How your handmade pieces reach you, and what to do if something isn't right."
			/>

			<div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
				{/* Highlights */}
				<div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{[
						{ icon: Truck, title: "Free Shipping", text: freeShippingText },
						{ icon: RotateCcw, title: "30-Day Returns", text: "On unused, original-condition items" },
						// { icon: Globe, title: "Worldwide Delivery", text: "Shipped from our partner workshops" },
						{ icon: PackageCheck, title: "Plastic-Free Packing", text: "Recycled kraft and tissue" },
					].map(({ icon: Icon, title, text }) => (
						<div key={title} className="bg-secondary/50 p-6 text-center">
							<Icon className="mx-auto mb-3 h-6 w-6 text-primary" strokeWidth={1.5} />
							<h2 className="mb-1 font-fraunces text-lg text-secondary-foreground">{title}</h2>
							<p className="text-sm font-light text-secondary-foreground/70">{text}</p>
						</div>
					))}
				</div>

				<div className="max-w-3xl">
					<LegalSection title="Processing Times">
						<p>
							In-stock pieces are packed and dispatched within 1–2 business days. Because our goods are
							handmade in small batches, some rugs and larger textiles are made to order and take 3–4 weeks to
							complete on the loom — this is always noted clearly on the product page before you buy.
						</p>
					</LegalSection>

					<LegalSection title="Shipping Rates & Delivery">
						<p>Rates are calculated at checkout based on your destination and the size of your order.</p>
						<div className="mt-4 overflow-x-auto">
							<table className="w-full text-left text-sm">
								<thead>
									<tr className="border-b border-secondary-foreground/20">
										<th className="py-3 pr-4 text-xs font-medium uppercase tracking-widest text-secondary-foreground">
											Method
										</th>
										<th className="py-3 pr-4 text-xs font-medium uppercase tracking-widest text-secondary-foreground">
											Estimated Time
										</th>
										<th className="py-3 text-xs font-medium uppercase tracking-widest text-secondary-foreground">
											Cost
										</th>
									</tr>
								</thead>
								<tbody>
									{rates.map((rate) => (
										<tr key={rate.method} className="border-b border-secondary-foreground/10">
											<td className="py-4 pr-4 font-medium text-secondary-foreground">{rate.method}</td>
											<td className="py-4 pr-4 font-light text-secondary-foreground/80">{rate.time}</td>
											<td className="py-4 font-light text-secondary-foreground/80">{rate.cost}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<p className="pt-2">You will receive tracking by email as soon as your parcel leaves us.</p>
					</LegalSection>

					{/* <LegalSection title="International Orders, Duties & Taxes">
						<p>
							We ship worldwide. For most destinations, duties and import taxes are calculated and collected
							at checkout so there is nothing to pay on arrival. Where they cannot be pre-calculated, any
							charges levied by your local customs authority are the responsibility of the recipient.
						</p>
					</LegalSection> */}

					<LegalSection title="Returns">
						<p>
							If a piece isn&apos;t right for your space, return it within 30 days of delivery for a full
							refund. Items must be unused and in their original condition and packaging.
						</p>
						<p>To start a return:</p>
						<ol className="list-decimal space-y-2 pl-5 marker:text-primary">
							<li>
								Email{" "}
								<a href="mailto:info@arteze.shop" className="text-primary hover:underline">
									hello@arteze.shop
								</a>{" "}
								with your order number and the item you&apos;d like to send back.
							</li>
							<li>We&apos;ll reply within 1–2 business days with a prepaid return label.</li>
							<li>Repack the piece in its original wrapping and drop it with the carrier.</li>
							<li>
								Refunds are issued to your original payment method within 5–7 business days of the return
								arriving with us.
							</li>
						</ol>
						<p>
							Return shipping is free for domestic orders. For international returns, the cost of return
							postage is deducted from your refund.
						</p>
					</LegalSection>

					<LegalSection title="Exchanges">
						<p>
							Because most of our pieces are one-of-a-kind, we don&apos;t run a formal exchange programme. The
							quickest route is to return the original item for a refund and place a new order for the piece
							you&apos;d prefer.
						</p>
					</LegalSection>

					<LegalSection title="Non-Returnable Items">
						<p>
							Made-to-order and custom-sized rugs, personalised pieces, and gift cards are final sale. Natural
							variation in colour, weave, and dimensions is a characteristic of handmade goods and is not
							considered a fault — but if you feel a piece has been misrepresented, contact us and we&apos;ll
							make it right.
						</p>
					</LegalSection>

					<LegalSection title="Damaged or Incorrect Orders">
						<p>
							Please inspect your order on arrival. If anything is damaged in transit or you&apos;ve received
							the wrong item, email{" "}
							<a href="mailto:returns@arteze.shop" className="text-brand-coral hover:underline">
								hello@arteze.shop
							</a>{" "}
							with photographs within 7 days and we will arrange a replacement or refund at no cost to you.
						</p>
					</LegalSection>

					<div className="relative mt-4 overflow-hidden bg-secondary/50 p-8">
						<div
							className="pattern-overlay-light pointer-events-none absolute left-0 top-0 h-20 w-full opacity-30 md:h-full md:w-20"
							aria-hidden="true"
						></div>
						<div className="relative z-10 mt-20 md:ml-20 md:mt-0">
							<h2 className="mb-2 font-fraunces text-xl text-secondary-foreground">Need a hand?</h2>
							<p className="mb-4 font-light text-secondary-foreground/80">
								Our team can help with tracking, returns, or questions about a specific piece.
							</p>
							<div className="flex flex-wrap gap-4">
								<CtaLink
									cta={{ href: "/contact", label: "Contact Us" }}
									className={buttonClassName({
										asLink: true,
										size: "default",
										variant: "default",
										className: "h-auto rounded-full px-7 py-3.5 text-sm font-semibold",
									})}
								/>
								<CtaLink
									cta={{ href: "/faq", label: "Read the FAQ" }}
									className={buttonClassName({
										asLink: true,
										size: "default",
										variant: "outline-solid",
										className:
											"h-auto rounded-full bg-transparent px-7 py-3.5 text-sm font-semibold hover:border-secondary-foreground hover:bg-transparent hover:text-secondary-foreground",
									})}
								/>
								{/* <Link
									href="/contact"
									className="bg-brand-coral hover:bg-brand-maroon inline-block px-6 py-3 text-sm font-medium uppercase tracking-widest text-white transition-colors"
								>
									Contact Us
								</Link>
								<Link
									href="/faq"
									className="border-brand-maroon/20 text-brand-maroon hover:border-brand-coral hover:text-brand-coral inline-block border px-6 py-3 text-sm font-medium uppercase tracking-widest transition-colors"
								>
									Read the FAQ
								</Link> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
