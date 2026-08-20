import type { PortableTextBlock } from "@portabletext/react";

export interface SanityPostSummary {
	_id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	category: string | null;
	publishedAt: string;
	author: string | null;
	imageUrl: string | null;
}

export interface SanityPostDetail extends SanityPostSummary {
	body: PortableTextBlock[] | null;
}

export interface SanitySlug {
	slug: string;
}
