import Link from "next/link";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { ChevronLeft, Facebook, Twitter, Linkedin } from "lucide-react";
import { buildStorefrontPath } from "@/lib/storefront-path";

export interface BlogPostDetail {
	_id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	category: string | null;
	publishedAt: string;
	author: string | null;
	imageUrl: string | null;
	body: PortableTextBlock[] | null;
}

export interface BlogPostRelated {
	_id: string;
	title: string;
	slug: string;
	imageUrl: string | null;
}

export interface BlogPostProps {
	post: BlogPostDetail;
	relatedPosts: BlogPostRelated[];
	locale: string;
	channel: string;
}

function formatDate(iso: string): string {
	const date = new Date(iso);
	return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function BlogPost({ post, relatedPosts, locale, channel }: BlogPostProps) {
	return (
		<article className="w-full pb-20">
			<div className="relative h-[60vh] min-h-[400px] w-full">
				{post.imageUrl && <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />}
				<div className="absolute inset-0 bg-black/20" />
			</div>

			<div className="relative z-10 mx-auto -mt-32 max-w-3xl px-4 sm:px-6">
				<div className="border border-primary/5 bg-background p-8 shadow-xl md:p-12">
					<div className="mb-10 text-center">
						<div className="mb-6 flex items-center justify-center space-x-4 text-sm">
							{post.category && (
								<span className="font-medium uppercase tracking-widest text-primary">{post.category}</span>
							)}
							{post.category && <span className="text-foreground/40">•</span>}
							<span className="font-light text-foreground/60">{formatDate(post.publishedAt)}</span>
						</div>
						<h1 className="mb-6 font-fraunces text-3xl leading-tight text-foreground md:text-5xl">
							{post.title}
						</h1>
						{post.author && <p className="font-light italic text-foreground/60">Words by {post.author}</p>}
					</div>

					{post.body && (
						<div className="prose prose-lg max-w-none font-light leading-relaxed text-foreground/80">
							<PortableText value={post.body} />
						</div>
					)}

					<div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-primary/20 pt-8 sm:flex-row">
						<Link
							href={buildStorefrontPath(locale, channel, "/blog")}
							className="inline-flex items-center text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:text-primary"
						>
							<ChevronLeft className="mr-2 h-4 w-4" /> Back to Journal
						</Link>

						<div className="flex items-center space-x-4">
							<span className="text-sm font-light text-foreground/60">Share:</span>
							<button
								className="text-foreground transition-colors hover:text-primary"
								aria-label="Share on Facebook"
							>
								<Facebook className="h-4 w-4" />
							</button>
							<button
								className="text-foreground transition-colors hover:text-primary"
								aria-label="Share on Twitter"
							>
								<Twitter className="h-4 w-4" />
							</button>
							<button
								className="text-foreground transition-colors hover:text-primary"
								aria-label="Share on LinkedIn"
							>
								<Linkedin className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{relatedPosts.length > 0 && (
				<div className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
					<h3 className="mb-8 text-center font-fraunces text-2xl text-foreground">More from the Journal</h3>
					<div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
						{relatedPosts.map((related) => (
							<Link
								key={related._id}
								href={buildStorefrontPath(locale, channel, `/blog/${related.slug}`)}
								className="group block"
							>
								<div className="mb-4 aspect-[16/9] overflow-hidden bg-muted">
									<img
										src={related.imageUrl ?? ""}
										alt={related.title}
										className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
									/>
								</div>
								<h4 className="font-fraunces text-xl text-foreground transition-colors group-hover:text-primary">
									{related.title}
								</h4>
							</Link>
						))}
					</div>
				</div>
			)}
		</article>
	);
}
