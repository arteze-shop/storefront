import { NextRequest } from "next/server";
import { newsletterFormSchema } from "@/lib/schemas";
import { sendEmail, createContact, getContact, addContactToSegment } from "@/lib/emails";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const parsed = newsletterFormSchema.safeParse(body);

		if (!parsed.success) {
			return Response.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
		}

		const { email } = parsed.data;
		const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID;

		const existing = await getContact(email);

		if (existing) {
			if (segmentId) await addContactToSegment(email, segmentId);
			return Response.json({ success: true });
		}

		const [createResult, confirmationResult] = await Promise.all([
			createContact({ email, segments: segmentId ? [{ id: segmentId }] : undefined }),
			sendEmail({
				to: [email],
				template: {
					id: "welcome-newsletter",
				},
				idempotencyKey: `newsletter-welcome/${email}`,
			}),
		]);

		if (!createResult && !confirmationResult) {
			return Response.json({ error: "Failed to send emails" }, { status: 500 });
		}

		return Response.json({ success: true });
	} catch (error) {
		console.error("[Newsletter API] Error:", error);
		return Response.json({ error: "Internal server error" }, { status: 500 });
	}
}
