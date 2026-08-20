import { Suspense } from "react";
import { sanityFetch } from "@/sanity/live";
import { postsByRegionQuery, resolveRegionFromChannel } from "@/sanity/queries";
import type { SanityPostSummary } from "@/sanity/types";
import { BlogHome } from "@/ui/pages/blog-home/blog-home";

export const metadata = {
	title: "Journal",
};

async function BlogPageSlot({ locale, channel }: { locale: string; channel: string }) {
	const region = resolveRegionFromChannel(channel);
	const { data: posts } = await sanityFetch<SanityPostSummary[]>({
		query: postsByRegionQuery(region),
		params: region ? { region } : {},
	});
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
