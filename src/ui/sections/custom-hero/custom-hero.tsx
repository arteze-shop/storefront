import { NavHrefLink } from "@/ui/atoms/nav-href-link";
import { buttonClassName } from "@/ui/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface EditorialHeroCta {
	label: string;
	href: string;
	variant?: "primary" | "secondary";
}

export interface EditorialHeroProps {
	/** Short uppercase overline above the heading. */
	// eyebrow?: string;
	// heading: string;
	subheading?: string;
	primaryCta?: EditorialHeroCta;
	secondaryCta?: EditorialHeroCta;
	/** Large product/editorial image shown on the soft panel beside the copy. */
	image?: string | null;
	imageAlt?: string;
	/** Rendered on the image panel when no image is provided. */
	// placeholder?: ReactNode;
	/** Unique heading id for `aria-labelledby`. Override when rendering more than one per page. */
	id?: string;
	className?: string;
}

function HeroCtaLink({
	cta,
	withArrow,
	className,
}: {
	cta: EditorialHeroCta;
	withArrow?: Boolean;
	className: string;
}) {
	return (
		<NavHrefLink href={cta.href} className={className}>
			{cta.label} {withArrow ? <ArrowRight size={16} /> : null}
		</NavHrefLink>
	);
}

export function CustomHero({
	subheading,
	primaryCta,
	secondaryCta,
	image,
	imageAlt = "",
	id = "homepage-hero-heading",
}: EditorialHeroProps) {
	return (
		<section className="relative flex min-h-[88vh] items-center overflow-hidden" aria-labelledby={id}>
			{/* Pattern right-side panel */}
			<div
				className="absolute bottom-0 right-0 top-0 w-full md:w-[48%]"
				style={{
					backgroundImage: `url(/brand-pattern-02.svg)`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					opacity: 0.12,
				}}
			/>
			<div
				className="absolute bottom-0 right-0 top-0 hidden w-[48%] md:block"
				style={{
					backgroundImage: `url(/brand-pattern-02.svg)`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					opacity: 0.55,
				}}
			/>
			{/* Overlay on pattern side */}
			<div
				className="absolute bottom-0 right-0 top-0 hidden w-[48%] md:block"
				style={{ backgroundColor: "oklch(var(--hero-cream) / 0.45)" }}
			/>

			{/* Hero image (right half) */}
			{image ? (
				<div className="absolute bottom-0 right-0 top-0 hidden w-[48%] overflow-hidden md:block">
					<img
						src={image}
						alt={imageAlt}
						className="h-full w-full object-cover mix-blend-multiply"
						style={{ opacity: 0.85 }}
					/>
				</div>
			) : null}

			{/* Hero Content */}
			<div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 md:grid-cols-2">
				<div>
					<p className="mb-4 text-xs uppercase tracking-[0.2em] text-primary">
						Handmade • Artisan • Sustainable
					</p>
					<h1 className="mb-6 text-display" style={{ color: "oklch(var(--hero-ink))" }}>
						Home goods made
						<br />
						<em className="text-primary">by hand,</em>
						<br />
						with heart.
					</h1>
					{subheading ? (
						<p
							className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground"
							// style={{ color: "oklch(var(--hero-taupe))" }}
						>
							{subheading}
						</p>
					) : null}
					{(primaryCta || secondaryCta) && (
						<div className="mt-9 flex flex-wrap gap-3">
							{primaryCta ? (
								<HeroCtaLink
									cta={primaryCta}
									withArrow={true}
									className={buttonClassName({
										asLink: true,
										size: "lg",
										variant: primaryCta.variant === "secondary" ? "secondary" : "default",
										className: "h-auto rounded-full px-7 py-3.5 text-sm font-semibold hover:gap-3",
									})}
								/>
							) : null}
							{secondaryCta ? (
								<HeroCtaLink
									cta={secondaryCta}
									className={buttonClassName({
										asLink: true,
										size: "lg",
										variant: secondaryCta.variant === "primary" ? "default" : "outline-solid",
										className:
											"h-auto rounded-full border-[1.5px] border-secondary-foreground px-7 py-3.5 text-sm font-semibold text-secondary-foreground hover:bg-secondary",
									})}
								/>
							) : null}
						</div>
					)}
				</div>
				<div className="hidden md:block" />
			</div>

			{/* Bottom pattern strip */}
			<div
				className="absolute bottom-0 left-0 right-0 h-8"
				style={{
					backgroundImage: `url(/brand-pattern-02.svg)`,
					backgroundSize: "auto 100%",
					backgroundRepeat: "repeat-x",
					opacity: 0.25,
				}}
			/>
		</section>
	);
}
