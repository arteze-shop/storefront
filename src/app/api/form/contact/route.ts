import { NextRequest } from "next/server";
import { contactFormSchema } from "@/lib/schemas";
import { sendEmail } from "@/lib/emails";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const parsed = contactFormSchema.safeParse(body);

		if (!parsed.success) {
			return Response.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
		}

		const { firstName, email, subject } = parsed.data;

		const [adminResult, confirmationResult] = await Promise.all([
			sendEmail({
				to: ["hello@arteze.shop"],
				template: {
					id: "contact-form-notification",
					variables: { ...parsed.data },
				},
				idempotencyKey: `contact-admin/${email}`,
			}),
			sendEmail({
				to: [email],
				template: {
					id: "contact-us-confirmation",
					variables: {
						firstName,
						subject,
					},
				},
				idempotencyKey: `contact-confirmation/${email}`,
			}),
		]);

		if (!adminResult && !confirmationResult) {
			return Response.json({ error: "Failed to send emails" }, { status: 500 });
		}

		return Response.json({ success: true });
	} catch (error) {
		console.error("[Contact API] Error:", error);
		return Response.json({ error: "Internal server error" }, { status: 500 });
	}
}
