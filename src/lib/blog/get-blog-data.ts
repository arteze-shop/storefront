import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { sanityFetch } from "@/sanity/live";
import { POST_QUERY, POSTS_QUERY } from "@/sanity/queries";
import type { SanityPostDetail, SanityPostSummary } from "@/sanity/types";

/**
 * Sanity blog data through the Paper cache layer (`"use cache"` + cache profile).
 * Mirrors `getPageData`/`getFeaturedProducts` so blog content is cacheable and PPR-safe.
 * Returns null/[] on failure so callers always render.
 */
export async function getBlogPost(slug: string): Promise<SanityPostDetail | null> {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.blogPost, slug);

	try {
		const { data } = await sanityFetch<SanityPostDetail>({ query: POST_QUERY, params: { slug } });
		return data;
	} catch (error) {
		console.error(`[getBlogPost] Failed to fetch post ${slug}:`, error);
		return null;
	}
}

/** All published posts, newest first — used for related posts and the blog index. */
export async function getBlogPosts(): Promise<SanityPostSummary[]> {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.blog);

	try {
		const { data } = await sanityFetch<SanityPostSummary[]>({ query: POSTS_QUERY });
		return data;
	} catch (error) {
		console.error("[getBlogPosts] Failed to fetch posts:", error);
		return [];
	}
}
