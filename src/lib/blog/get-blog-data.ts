import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { sanityFetch } from "@/sanity/live";
import { POST_QUERY, POSTS_QUERY, featuredPostByRegionQuery, type PostRegion } from "@/sanity/queries";
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

/**
 * Newest featured post for a storefront region — powers the homepage blog section.
 * Cached and failure-safe so the PPR island can never crash the page mid-stream.
 */
export async function getFeaturedBlogPost(region: PostRegion): Promise<SanityPostSummary | null> {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.blog);

	try {
		const { data } = await sanityFetch<SanityPostSummary>({
			query: featuredPostByRegionQuery(region),
			params: region ? { region } : {},
		});
		return data;
	} catch (error) {
		console.error("[getFeaturedBlogPost] Failed to fetch featured post:", error);
		return null;
	}
}
