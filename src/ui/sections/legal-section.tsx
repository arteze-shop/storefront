interface LegalSectionProps {
	title: string;
	children: React.ReactNode;
}

export function LegalSection({ title, children }: LegalSectionProps) {
	return (
		<section className="mb-12">
			<h2 className="mb-4 font-fraunces text-2xl text-secondary-foreground">{title}</h2>
			<div className="space-y-4 font-light leading-relaxed text-secondary-foreground/80">{children}</div>
		</section>
	);
}
