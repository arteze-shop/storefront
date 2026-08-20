import { Suspense } from "react";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/blog/get-blog-data";
import type { SanityPostSummary } from "@/sanity/types";
import { BlogPost } from "@/ui/pages/blog-post/blog-post";

type Props = {
	params: Promise<{ locale: string; channel: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const post = await getBlogPost(slug);

	if (!post) return {};

	return {
		title: post.title,
		description: post.excerpt ?? undefined,
	};
}

export default async function BlogPostPage({ params }: Props) {
	const { locale, channel, slug } = await params;
	return (
		<Suspense fallback={<div />}>
			<BlogPostSlot slug={slug} locale={locale} channel={channel} />
		</Suspense>
	);
}

async function BlogPostSlot({ slug, locale, channel }: { slug: string; locale: string; channel: string }) {
	const post = await getBlogPost(slug);

	if (!post) notFound();

	const allPosts = await getBlogPosts();
	const relatedPosts = allPosts.filter((p: SanityPostSummary) => p.slug !== slug).slice(0, 2);

	return <BlogPost post={post} relatedPosts={relatedPosts} locale={locale} channel={channel} />;
}
