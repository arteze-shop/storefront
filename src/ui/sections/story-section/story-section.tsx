import { cn } from "@/lib/utils";
import { NavHrefLink } from "@/ui/atoms/nav-href-link";
import { buttonClassName } from "@/ui/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface StoryCta {
	label: string;
	href: string;
	variant?: "primary" | "underline";
}

export interface StorySectionProps {
	/** Unique heading id for `aria-labelledby`. Override when rendering more than one per page. */
	id?: string;
	eyebrow?: string;
	heading: string;
	paragraphs: readonly string[];
	primaryCta?: StoryCta;
	image?: string | null;
	imageAlt?: string;
	className?: string;
	headingClassName?: string;
}

function StoryCtaLink({
	cta,
	withArrow,
	className,
}: {
	cta: StoryCta;
	withArrow?: Boolean;
	className: string;
}) {
	return (
		<NavHrefLink href={cta.href} className={className}>
			{cta.label} {withArrow ? <ArrowRight size={16} /> : null}
		</NavHrefLink>
	);
}

export function StorySection({
	id = "homepage-story-section",
	eyebrow,
	heading,
	paragraphs,
	primaryCta,
	image,
	imageAlt,
	className,
	headingClassName,
}: StorySectionProps) {
	return (
		<section className={cn("relative overflow-hidden py-24", className)} aria-labelledby={id}>
			<div className="pattern-overlay-light absolute inset-0 opacity-40"></div>
			<div className="absolute inset-0 bg-secondary/80 backdrop-blur-[2px]"></div>

			<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
					<div className="w-full lg:w-1/2">
						{image ? (
							<img src={image} alt={imageAlt} className="aspect-[4/5] w-full object-cover shadow-xl" />
						) : null}
					</div>
					<div className="w-full space-y-6 lg:w-1/2">
						{eyebrow ? (
							<p className="text-eyebrow font-medium uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
						) : null}

						{heading ? (
							<h2 id={id} className={cn("text-balance text-h2 text-secondary-foreground", headingClassName)}>
								{heading}
							</h2>
						) : null}
						{paragraphs.length > 0
							? paragraphs.map((paragraph, i) => (
									<p key={i} className="font-light leading-relaxed text-secondary-foreground/80">
										{paragraph}
									</p>
								))
							: null}
						{primaryCta ? (
							<div className="pt-6">
								<StoryCtaLink
									cta={primaryCta}
									withArrow={true}
									className={buttonClassName({
										asLink: true,
										size: "lg",
										variant: primaryCta.variant === "underline" ? "underline" : "default",
										className: "h-auto p-0 hover:gap-3",
									})}
								/>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</section>
	);
}
