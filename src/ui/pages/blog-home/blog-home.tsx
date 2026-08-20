import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildStorefrontPath } from "@/lib/storefront-path";

export interface BlogHomePost {
	_id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	category: string | null;
	publishedAt: string;
	imageUrl: string | null;
}

export interface BlogHomeProps {
	featuredPost: BlogHomePost | null;
	posts: BlogHomePost[];
	locale: string;
	channel: string;
}

function formatDate(iso: string): string {
	const date = new Date(iso);
	return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function BlogHome({ featuredPost, posts, locale, channel }: BlogHomeProps) {
	return (
		<div className="w-full">
			<div className="relative overflow-hidden bg-secondary-foreground px-4 py-20 text-background">
				<div className="pattern-overlay-dark absolute inset-0 opacity-20" />
				<div className="relative z-10 mx-auto max-w-3xl text-center">
					<h1 className="mb-4 font-fraunces text-4xl md:text-5xl">The Journal</h1>
					<p className="text-lg font-light text-background/80">
						Stories of craft, styling inspiration, and dispatches from the workshops of our artisan partners.
					</p>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				{featuredPost && (
					<div className="mb-20">
						<Link
							href={buildStorefrontPath(locale, channel, `/blog/${featuredPost.slug}`)}
							className="group grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16"
						>
							<div className="aspect-[4/3] overflow-hidden bg-muted lg:aspect-auto lg:h-[500px]">
								<img
									src={featuredPost.imageUrl ?? ""}
									alt={featuredPost.title}
									className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
								/>
							</div>
							<div className="flex flex-col justify-center">
								<div className="mb-4 flex items-center space-x-4 text-sm">
									{featuredPost.category && (
										<span className="font-medium uppercase tracking-widest text-primary">
											{featuredPost.category}
										</span>
									)}
									{featuredPost.category && <span className="text-foreground/40">•</span>}
									<span className="font-light text-foreground/60">
										{formatDate(featuredPost.publishedAt)}
									</span>
								</div>
								<h2 className="mb-4 font-fraunces text-3xl text-foreground transition-colors group-hover:text-primary md:text-4xl">
									{featuredPost.title}
								</h2>
								{featuredPost.excerpt && (
									<p className="mb-8 text-lg font-light leading-relaxed text-foreground/80">
										{featuredPost.excerpt}
									</p>
								)}
								<div className="inline-flex items-center font-medium text-foreground transition-colors group-hover:text-primary">
									<span className="mr-2 text-sm uppercase tracking-widest">Read Article</span>
									<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
								</div>
							</div>
						</Link>
					</div>
				)}

				<div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
					{posts.map((post) => (
						<div key={post._id}>
							<Link href={buildStorefrontPath(locale, channel, `/blog/${post.slug}`)} className="group block">
								<div className="mb-6 aspect-[4/3] overflow-hidden bg-muted">
									<img
										src={post.imageUrl ?? ""}
										alt={post.title}
										className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
									/>
								</div>
								<div className="mb-3 flex items-center space-x-4 text-xs">
									{post.category && (
										<span className="font-medium uppercase tracking-widest text-primary">
											{post.category}
										</span>
									)}
									{post.category && <span className="text-foreground/40">•</span>}
									<span className="font-light text-foreground/60">{formatDate(post.publishedAt)}</span>
								</div>
								<h3 className="mb-3 font-fraunces text-2xl text-foreground transition-colors group-hover:text-primary">
									{post.title}
								</h3>
								{post.excerpt && (
									<p className="mb-4 line-clamp-2 font-light text-foreground/70">{post.excerpt}</p>
								)}
								<div className="inline-flex items-center text-sm font-medium text-foreground transition-colors group-hover:text-primary">
									<span className="mr-2 border-b border-foreground pb-0.5 transition-colors group-hover:border-primary">
										Read More
									</span>
									<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
