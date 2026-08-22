import { client } from "./client";

export async function sanityFetch<T = unknown>({
	query,
	params = {},
	tags = [],
	revalidate,
}: {
	query: string;
	params?: Record<string, unknown>;
	tags?: string[];
	revalidate?: number;
	stega?: boolean;
	perspective?: "published" | "previewDrafts";
}): Promise<{ data: T }> {
	const data = await client.fetch<T>(query, params, {
		next: { tags, ...(revalidate !== undefined ? { revalidate } : {}) },
	});

	return { data };
}
