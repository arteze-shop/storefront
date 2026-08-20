"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterFormSchema, type NewsletterFormData } from "@/lib/schemas";
import { ArrowRight, Loader, Check } from "lucide-react";
import { useState } from "react";

interface NewsletterFormProps {
	onSuccess?: () => void;
}

export function NewsletterForm({}: NewsletterFormProps) {
	const [submitError, setSubmitError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = useForm<NewsletterFormData>({
		resolver: zodResolver(newsletterFormSchema),
	});

	const onSubmit = async (data: NewsletterFormData) => {
		setSubmitError(null);

		try {
			const res = await fetch("/api/form/newsletter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				const err = (await res.json()) as { error?: string };
				throw new Error(err.error ?? "Failed to send message");
			}
		} catch {
			setSubmitError("Something went wrong. Please try again.");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex" noValidate>
			<input
				id="email"
				type="email"
				placeholder="Email address"
				{...register("email")}
				className="w-full border border-accent/30 bg-secondary-foreground px-4 py-2 font-light text-secondary placeholder:text-accent/50 focus:border-primary focus:outline-none"
			/>
			{errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
			{submitError && <p className="text-sm text-red-500">{submitError}</p>}
			<button
				type="submit"
				disabled={isSubmitting}
				className="flex items-center justify-center bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
			>
				{isSubmitting ? (
					<Loader className="h-5 w-5 animate-spin" />
				) : isSubmitSuccessful ? (
					<Check className="h-5 w-5" />
				) : (
					<ArrowRight className="h-5 w-5" />
				)}
			</button>
		</form>
	);
}
