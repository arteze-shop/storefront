import { NavHrefLink } from "@/ui/atoms/nav-href-link";
import { buttonClassName } from "@/ui/components/ui/button";
import { getStorefrontContent } from "@/lib/content/server";

export interface ExploreCta {
	label: string;
	href: string;
	variant?: "primary" | "secondary";
}

function ExploreCtaLink({ cta, className }: { cta: ExploreCta; className: string }) {
	return (
		<NavHrefLink href={cta.href} className={className}>
			{cta.label}
		</NavHrefLink>
	);
}

export default async function AboutPage({
	params,
}: {
	params: Promise<{ locale: string; channel: string }>;
}) {
	const { locale, channel } = await params;
	const content = await getStorefrontContent(channel, locale);
	const { hero, vision, values, explore } = content.surfaces.aboutpage;
	return (
		<div className="w-full">
			{/* Hero */}
			<div className="relative flex h-[60vh] min-h-[400px] items-center justify-center overflow-hidden">
				<div className="absolute inset-0">
					{hero.image ? (
						<img src={hero.image} alt="Artisan weaving" className="h-full w-full object-cover" />
					) : null}
					<div className="absolute inset-0 bg-primary/30 mix-blend-multiply" />
				</div>
				<div className="relative z-10 px-4 text-center">
					<h1 className="mb-4 font-fraunces text-4xl text-background md:text-6xl">{hero.heading}</h1>
					<p className="mx-auto max-w-xl text-lg font-light text-background/90">{hero.subheading}</p>
				</div>
			</div>

			{/* Content Section 1 */}
			<section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center gap-12 md:flex-row lg:gap-20">
					<div className="w-full md:w-1/2">
						{vision.eyebrow ? (
							<span className="mb-4 block text-eyebrow text-sm font-medium uppercase tracking-widest text-primary">
								{vision.eyebrow}
							</span>
						) : null}
						<h2 className="mb-6 font-fraunces text-3xl text-secondary-foreground md:text-4xl">
							{vision.heading}
						</h2>
						<div className="space-y-4 font-light leading-relaxed text-secondary-foreground/80">
							{vision.content.map((item, i) => (
								<p key={i}>{item}</p>
							))}
						</div>
					</div>
					<div className="w-full md:w-1/2">
						<div className="relative aspect-square bg-secondary p-4">
							<div className="pattern-overlay-light absolute inset-0 opacity-30" />
							{vision.image ? (
								<img
									src={vision.image}
									alt={vision.imageAlt}
									className="relative z-10 h-full w-full object-cover shadow-lg"
								/>
							) : null}
						</div>
					</div>
				</div>
			</section>

			{/* Values Band */}
			{values.length > 0 ? (
				<section className="relative overflow-hidden bg-primary py-20 text-background">
					<div className="pattern-overlay-dark absolute inset-0 opacity-10" />
					<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">
							{values.map((item) => (
								<div key={item.id}>
									<h3 className="mb-4 font-serif text-xl text-background">{item.heading}</h3>
									<p className="font-light text-background/80">{item.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>
			) : null}

			{/* Content Section 2 */}
			<section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl">
					{explore.logo ? (
						<img src={explore.logo} alt="Arteze" className="mx-auto mb-8 h-16 object-contain" />
					) : null}
					<h2 className="text-brand-maroon mb-6 font-serif text-3xl">{explore.heading}</h2>
					<p className="text-brand-maroon/80 mb-10 font-light leading-relaxed">{explore.content}</p>
					<ExploreCtaLink
						cta={{ label: explore.ctaLabel ?? "Explore the Shop", href: "/shop" }}
						className={buttonClassName({
							asLink: true,
							size: "lg",
							variant: "default",
							className: "h-auto rounded-full px-7 py-3.5 text-sm font-semibold hover:gap-3",
						})}
					/>
				</div>
			</section>
		</div>
	);
}
