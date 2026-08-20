import { NavHrefLink } from "@/ui/atoms/nav-href-link";
import { SectionHeader } from "@/ui/sections/section-header";
import { buttonClassName } from "@/ui/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface BlogSectionPost {
	title: string;
	slug: string;
	excerpt: string | null;
	category: string | null;
	imageUrl: string | null;
}

export interface BlogSectionCta {
	label: string;
	href: string;
	variant?: "primary" | "underline";
}

export interface BlogSectionProps {
	heading: string;
	subHeading?: string;
	post: BlogSectionPost | null;
	cta: BlogSectionCta;
}

function BlogSectionCtaLink({
	cta,
	withArrow,
	className,
}: {
	cta: BlogSectionCta;
	withArrow?: Boolean;
	className: string;
}) {
	return (
		<NavHrefLink href={cta.href} className={className}>
			{cta.label} {withArrow ? <ArrowRight size={16} /> : null}
		</NavHrefLink>
	);
}

export function BlogSection({ post, heading, subHeading, cta }: BlogSectionProps) {
	if (!post) {
		return null;
	}

	return (
		<section className="relative overflow-hidden bg-secondary-foreground py-section-md text-background">
			<div className="pattern-overlay-dark pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-20" />
			<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<SectionHeader
					id="blog-section-heading"
					align="center"
					heading={heading}
					intro={subHeading}
					className="mb-16"
					introClassName="text-background/80 font-light"
				/>

				<div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
					<div className="order-2 space-y-6 md:order-1">
						{post.title ? (
							<SectionHeader
								id="feautred-post-heading"
								eyebrow={post.category ?? ""}
								heading={post.title}
								intro={post.excerpt ?? ""}
								headingClassName="text-muted/80"
								introClassName="text-background/80 font-light"
							/>
						) : null}
						{cta ? (
							<div className="pt-6">
								<BlogSectionCtaLink
									cta={cta}
									withArrow={true}
									className={buttonClassName({
										asLink: true,
										size: "lg",
										variant: cta.variant === "underline" ? "underline" : "default",
										className: "h-auto p-0 text-muted hover:gap-3 hover:text-muted",
									})}
								/>
							</div>
						) : null}
					</div>
					<div className="order-1 md:order-2">
						{post.imageUrl && (
							<img src={post.imageUrl} alt={post.title} className="aspect-[4/3] w-full object-cover" />
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

export function BlogSectionSkeleton() {
	return (
		<section className="relative overflow-hidden bg-foreground py-section-md text-background">
			<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-16 text-center">
					<div className="mx-auto mb-4 h-10 w-48 animate-pulse rounded bg-background/20" />
					<div className="mx-auto h-6 w-96 max-w-full animate-pulse rounded bg-background/20" />
				</div>
				<div className="grid grid-cols-1 gap-12 md:grid-cols-2">
					<div className="space-y-6">
						<div className="h-4 w-24 animate-pulse rounded bg-background/20" />
						<div className="h-8 w-full animate-pulse rounded bg-background/20" />
						<div className="h-20 w-full animate-pulse rounded bg-background/20" />
					</div>
					<div className="aspect-[4/3] w-full animate-pulse rounded bg-background/20" />
				</div>
			</div>
		</section>
	);
}
