import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/live";
import { POST_QUERY, POSTS_QUERY, POST_SLUGS_QUERY } from "@/sanity/queries";
import type { SanityPostSummary, SanityPostDetail, SanitySlug } from "@/sanity/types";
import { BlogPost } from "@/ui/pages/blog-post/blog-post";

type Props = {
	params: Promise<{ locale: string; channel: string; slug: string }>;
};

export async function generateStaticParams() {
	const { data: slugs } = await sanityFetch<SanitySlug[]>({
		query: POST_SLUGS_QUERY,
		perspective: "published",
		stega: false,
	});
	return slugs.map((s: SanitySlug) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const { data: post } = await sanityFetch<SanityPostDetail>({
		query: POST_QUERY,
		params: { slug },
		stega: false,
	});

	if (!post) return {};

	return {
		title: post.title,
		description: post.excerpt ?? undefined,
	};
}

export default async function BlogPostPage({ params }: Props) {
	const { locale, channel, slug } = await params;
	const { data: post } = await sanityFetch<SanityPostDetail>({ query: POST_QUERY, params: { slug } });

	if (!post) notFound();

	const { data: allPosts } = await sanityFetch<SanityPostSummary[]>({ query: POSTS_QUERY });
	const relatedPosts = allPosts.filter((p: SanityPostSummary) => p.slug !== slug).slice(0, 2);

	return <BlogPost post={post} relatedPosts={relatedPosts} locale={locale} channel={channel} />;
}
