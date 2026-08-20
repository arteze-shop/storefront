"use client";

import { useState } from "react";
import { NavHrefLink } from "@/ui/atoms/nav-href-link";
import { buttonClassName } from "@/ui/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { PageHero } from "@/ui/components/page-hero";
import { FAQ_GROUPS } from "@/lib/content/faq";
import { Plus, Minus } from "lucide-react";

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

export function FAQPage() {
	const [openKey, setOpenKey] = useState<string | null>("0-0");

	return (
		<div className="w-full">
			<PageHero
				eyebrow="Help Centre"
				title="Frequently Asked Questions"
				subtitle="Answers on our artisan partners, handmade variation, shipping, and returns."
			/>

			<div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
				{FAQ_GROUPS.map((group, groupIdx) => (
					<section key={group.category} className="mb-14 last:mb-0">
						<h2 className="mb-6 text-sm font-medium uppercase tracking-[0.25em] text-primary">
							{group.category}
						</h2>

						<div className="border-t border-secondary-foreground/10">
							{group.items.map((item, itemIdx) => {
								const key = `${groupIdx}-${itemIdx}`;
								const isOpen = openKey === key;

								return (
									<div key={key} className="border-b border-secondary-foreground/10">
										<h3>
											<button
												onClick={() => setOpenKey(isOpen ? null : key)}
												aria-expanded={isOpen}
												aria-controls={`faq-panel-${key}`}
												className="group flex w-full items-start justify-between gap-6 py-5 text-left"
											>
												<span className="font-fraunces text-lg text-secondary-foreground transition-colors group-hover:text-primary">
													{item.question}
												</span>
												<span className="text-brand-coral mt-1 flex-shrink-0">
													{isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
												</span>
											</button>
										</h3>

										<AnimatePresence initial={false}>
											{isOpen && (
												<motion.div
													id={`faq-panel-${key}`}
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: "auto", opacity: 1 }}
													exit={{ height: 0, opacity: 0 }}
													transition={{ duration: 0.25, ease: "easeInOut" }}
													className="overflow-hidden"
												>
													<p className="pb-6 pr-10 font-light leading-relaxed text-secondary-foreground/80">
														{item.answer}
													</p>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								);
							})}
						</div>
					</section>
				))}

				<div className="relative mt-16 overflow-hidden bg-secondary/50 p-8 text-center md:p-10">
					<div
						className="pattern-overlay-light pointer-events-none absolute inset-0 opacity-10"
						aria-hidden="true"
					/>
					<div className="relative z-10">
						<h2 className="mb-3 font-fraunces text-2xl text-secondary-foreground">Still have a question?</h2>
						<p className="mx-auto mb-6 max-w-md font-light text-secondary-foreground/80">
							Ask us anything about a piece, its maker, or your order — we usually reply within 24–48 hours.
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
