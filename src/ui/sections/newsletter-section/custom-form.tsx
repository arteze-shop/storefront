"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterFormSchema, type NewsletterFormData } from "@/lib/schemas";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Button } from "@/ui/components/ui/button";

interface FormProps {
	onSuccess?: () => void;
}

export function NewsletterSectionForm({}: FormProps) {
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
		<>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mx-auto mt-5 flex max-w-sm flex-col gap-3 md:flex-row"
				noValidate
			>
				<input
					id="email"
					type="email"
					placeholder="Your Email address"
					{...register("email")}
					className="flex-1 rounded-full border border-border px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
				/>
				<Button
					type="submit"
					disabled={isSubmitting}
					className="mx-auto h-auto rounded-full px-7 py-3.5 text-sm font-semibold"
				>
					{isSubmitting ? <Loader className="h-5 w-5 animate-spin" /> : "Subscribe"}
				</Button>
			</form>
			{errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
			{submitError && <p className="text-sm text-red-500">{submitError}</p>}
			{isSubmitSuccessful && (
				<p className="text-sm text-green-500">You have succesfully subscribed to our newsletter!</p>
			)}
		</>
	);
}
