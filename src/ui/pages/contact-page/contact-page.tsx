"use client";

import { useState, useCallback } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "./contact-form";
import { ContactSuccess } from "./contact-success";

interface ContactProps {
	phone: string;
	address: string;
}

export function ContactPage({ phone, address }: ContactProps) {
	const [submitted, setSubmitted] = useState(false);

	const handleSuccess = useCallback(() => {
		setSubmitted(true);
	}, []);

	const handleReset = useCallback(() => {
		setSubmitted(false);
	}, []);

	return (
		<div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
			<div className="mb-16 text-center">
				<h1 className="mb-4 font-fraunces text-4xl text-secondary-foreground md:text-5xl">Get in Touch</h1>
				<p className="mx-auto max-w-2xl font-light text-secondary-foreground/80">
					Whether you have a question about a product, shipping, or our artisan partners, we&rsquo;d love to
					hear from you.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
				<div className="relative overflow-hidden bg-secondary p-8 md:p-12">
					<div className="pattern-overlay-light pointer-events-none absolute right-0 top-0 h-64 w-64 opacity-30" />

					<div className="relative z-10 space-y-10">
						<div>
							<h3 className="mb-6 font-fraunces text-2xl text-secondary-foreground">Contact Details</h3>
							<div className="space-y-6 font-light text-secondary-foreground/80">
								<div className="flex items-start space-x-4">
									<Mail className="mt-0.5 h-5 w-5 text-primary" />
									<div>
										<p className="mb-1 font-medium text-secondary-foreground">Email</p>
										<a href="mailto:hello@arteze.shop" className="transition-colors hover:text-primary">
											hello@arteze.shop
										</a>
									</div>
								</div>
								<div className="flex items-start space-x-4">
									<Phone className="mt-0.5 h-5 w-5 text-primary" />
									<div>
										<p className="mb-1 font-medium text-secondary-foreground">Phone</p>
										<p>{phone}</p>
										<p className="mt-1 text-sm text-secondary-foreground/60">Mon-Fri, 9am-5pm</p>
									</div>
								</div>
								<div className="flex items-start space-x-4">
									<MapPin className="mt-0.5 h-5 w-5 text-primary" />
									<div>
										<p className="mb-1 font-medium text-secondary-foreground">Address</p>
										<p className="whitespace-pre-line">{address}</p>
									</div>
								</div>
							</div>
						</div>

						<div>
							<h3 className="mb-4 font-fraunces text-xl text-secondary-foreground">Trade & Wholesale</h3>
							<p className="text-sm font-light leading-relaxed text-secondary-foreground/80">
								We work with interior designers and select boutiques. Please email{" "}
								<a href="mailto:info@arteze.shop" className="text-primary hover:underline">
									info@arteze.shop
								</a>{" "}
								with your inquiry.
							</p>
						</div>
					</div>
				</div>

				<div>
					{submitted ? <ContactSuccess onReset={handleReset} /> : <ContactForm onSuccess={handleSuccess} />}
				</div>
			</div>
		</div>
	);
}
