interface PageHeroProps {
	title: string;
	subtitle?: string;
	eyebrow?: string;
}

export function PageHero({ title, subtitle, eyebrow }: PageHeroProps) {
	return (
		<div className="relative overflow-hidden bg-secondary-foreground px-4 py-16 text-background md:py-20">
			<div className="pattern-overlay-dark absolute inset-0 opacity-20" aria-hidden="true"></div>
			<div className="relative z-10 mx-auto max-w-3xl text-center">
				{eyebrow && (
					<span className="mb-4 block text-xs font-medium uppercase tracking-[0.25em] text-secondary">
						{eyebrow}
					</span>
				)}
				<h1 className="mb-4 font-fraunces text-4xl md:text-5xl">{title}</h1>
				{subtitle && <p className="text-lg font-light leading-relaxed text-background/80">{subtitle}</p>}
			</div>
		</div>
	);
}
