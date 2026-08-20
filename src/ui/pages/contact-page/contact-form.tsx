"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas";
import { Button } from "@/ui/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface ContactFormProps {
	onSuccess: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
	const [submitError, setSubmitError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ContactFormData>({
		resolver: zodResolver(contactFormSchema),
	});

	const onSubmit = async (data: ContactFormData) => {
		setSubmitError(null);

		try {
			const res = await fetch("/api/form/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				const err = (await res.json()) as { error?: string };
				throw new Error(err.error ?? "Failed to send message");
			}

			onSuccess();
		} catch {
			setSubmitError("Something went wrong. Please try again.");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label htmlFor="firstName" className="mb-2 block text-sm font-light text-secondary-foreground/80">
						First Name
					</label>
					<input
						id="firstName"
						{...register("firstName")}
						className="w-full border border-secondary-foreground/20 bg-transparent px-4 py-3 text-secondary-foreground focus:border-primary focus:outline-none"
					/>
					{errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
				</div>
				<div>
					<label htmlFor="lastName" className="mb-2 block text-sm font-light text-secondary-foreground/80">
						Last Name
					</label>
					<input
						id="lastName"
						{...register("lastName")}
						className="w-full border border-secondary-foreground/20 bg-transparent px-4 py-3 text-secondary-foreground focus:border-primary focus:outline-none"
					/>
					{errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
				</div>
			</div>
			<div>
				<label htmlFor="email" className="mb-2 block text-sm font-light text-secondary-foreground/80">
					Email Address
				</label>
				<input
					id="email"
					type="email"
					{...register("email")}
					className="w-full border border-secondary-foreground/20 bg-transparent px-4 py-3 text-secondary-foreground focus:border-primary focus:outline-none"
				/>
				{errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
			</div>
			<div>
				<label htmlFor="subject" className="mb-2 block text-sm font-light text-secondary-foreground/80">
					Subject
				</label>
				<select
					id="subject"
					{...register("subject")}
					className="w-full border border-secondary-foreground/20 bg-transparent px-4 py-3 font-light text-secondary-foreground focus:border-primary focus:outline-none"
				>
					<option value="">Select a subject</option>
					<option value="General Inquiry">General Inquiry</option>
					<option value="Order Status">Order Status</option>
					<option value="Returns & Exchanges">Returns & Exchanges</option>
					<option value="Product Question">Product Question</option>
				</select>
				{errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
			</div>
			<div>
				<label htmlFor="message" className="mb-2 block text-sm font-light text-secondary-foreground/80">
					Message
				</label>
				<textarea
					id="message"
					rows={5}
					{...register("message")}
					className="w-full resize-none border border-secondary-foreground/20 bg-transparent px-4 py-3 text-secondary-foreground focus:border-primary focus:outline-none"
				></textarea>
				{errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
			</div>
			{submitError && <p className="text-sm text-red-500">{submitError}</p>}
			<Button
				type="submit"
				disabled={isSubmitting}
				className="h-auto rounded-full px-7 py-3.5 text-sm font-semibold hover:gap-3"
			>
				{isSubmitting ? "Sending..." : "Send Message"}
				<ArrowRight />
			</Button>
		</form>
	);
}
