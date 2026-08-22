import { Suspense } from "react";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { sanityFetch } from "@/sanity/live";
import { postsByRegionQuery, resolveRegionFromChannel, type PostRegion } from "@/sanity/queries";
import type { SanityPostSummary } from "@/sanity/types";
import { BlogHome } from "@/ui/pages/blog-home/blog-home";

export const metadata = {
	title: "Journal",
};

/**
 * ISR-style freshness for the uncached (streaming) blog index slot: the `blog`
 * manifest profile applies the `catalog` cacheLife tier (revalidate = 60s).
 */

async function getBlogIndexPosts(region: PostRegion): Promise<SanityPostSummary[]> {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.blog);

	const { data } = await sanityFetch<SanityPostSummary[]>({
		query: postsByRegionQuery(region),
		params: region ? { region } : {},
	});
	return data;
}

async function BlogPageSlot({ locale, channel }: { locale: string; channel: string }) {
	const region = resolveRegionFromChannel(channel);
	const posts = await getBlogIndexPosts(region);
	const featuredPost = posts[0] ?? null;
	const regularPosts = posts.slice(1);

	return <BlogHome featuredPost={featuredPost} posts={regularPosts} locale={locale} channel={channel} />;
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string; channel: string }> }) {
	const { locale, channel } = await params;
	return (
		<Suspense fallback={<div />}>
			<BlogPageSlot locale={locale} channel={channel} />
		</Suspense>
	);
}
