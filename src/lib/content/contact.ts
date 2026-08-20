import type { ContactContent, ContactContentByChannel } from "@/lib/content/types";

/**
 * Resolve contact details for a channel, falling back to the `default` entry.
 *
 * Resolution order: `contact[channel]` → `contact.default`.
 * The `default` key is required by the type, so this always returns a value.
 */
export function resolveContactContent(contact: ContactContentByChannel, channel: string): ContactContent {
	return contact[channel] ?? contact.default;
}
