import { Resend } from "resend";
import type { Contact, CreateEmailOptions } from "resend";
import type { ReactElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
	from?: string;
	to: string[];
	subject?: string;
	template?: { id: string; variables?: Record<string, string | number> };
	react?: ReactElement;
	idempotencyKey?: string;
}

export interface CreateContactOptions {
	email: string;
	firstName?: string;
	lastName?: string;
	unsubscribed?: boolean;
	segments?: { id: string }[];
}

export async function sendEmail({ from, to, subject, template, react, idempotencyKey }: SendEmailOptions) {
	const { data, error } = await resend.emails.send(
		{
			from: from ?? "Arteze <no-reply@arteze.shop>",
			to,
			subject,
			...(template ? { template } : {}),
			...(react ? { react } : {}),
		} as CreateEmailOptions,
		...(idempotencyKey ? [{ idempotencyKey }] : []),
	);

	if (error) {
		console.error("[Email] Failed to send:", error.message);
		return null;
	}

	return data;
}

/**
 * Look up a contact by email. Any failure (including a missing contact) is
 * treated as "not found", so callers can treat `null` as a new subscriber.
 */
export async function getContact(email: string): Promise<Contact | null> {
	const { data, error } = await resend.contacts.get({ email });

	if (error) {
		console.error("Failed to get contact", error.message);
		return null;
	}

	return data;
}

/**
 * Assign an existing contact to a segment. Returns the assignment result or
 * `null` on error.
 */
export async function addContactToSegment(email: string, segmentId: string) {
	const { data, error } = await resend.contacts.segments.add({ email, segmentId });

	if (error) {
		console.error("Failed to add contact to segment", error.message);
		return null;
	}

	return data;
}

export async function createContact({
	email,
	firstName,
	lastName,
	unsubscribed,
	segments,
}: CreateContactOptions) {
	const { data, error } = await resend.contacts.create({
		email,
		firstName,
		lastName,
		unsubscribed: unsubscribed ?? false,
		segments,
	});

	if (error) {
		console.error("Failed to create contact", error.message);
		return null;
	}

	return data;
}
