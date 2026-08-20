import { client } from "./client";

export async function sanityFetch<T = unknown>({
	query,
	params = {},
	tags = [],
}: {
	query: string;
	params?: Record<string, unknown>;
	tags?: string[];
	stega?: boolean;
	perspective?: "published" | "previewDrafts";
}): Promise<{ data: T }> {
	const data = await client.fetch<T>(query, params, {
		next: { tags },
	});

	return { data };
}
