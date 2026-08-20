"use client";

interface ContactSuccessProps {
	onReset: () => void;
}

export function ContactSuccess({ onReset }: ContactSuccessProps) {
	return (
		<div className="flex h-full flex-col items-center justify-center border border-secondary-foreground/10 p-8 text-center">
			<h3 className="mb-4 font-fraunces text-2xl text-secondary-foreground">Message Sent</h3>
			<p className="mb-8 font-light text-secondary-foreground/80">
				Thank you for reaching out. We&rsquo;ll get back to you within 24-48 hours.
			</p>
			<button
				onClick={onReset}
				className="text-sm font-medium uppercase tracking-widest text-primary transition-colors hover:text-secondary-foreground"
			>
				Send Another Message
			</button>
		</div>
	);
}
