import { Suspense } from "react";
import { brandConfig } from "@/config/brand";
import { resolveLocaleFromSlug } from "@/config/locale";
import { getFeaturedProducts } from "@/lib/catalog/get-featured-products";
import { resolveChannelCurrency } from "@/lib/channels/resolve-channel-currency";
import { buildPolicyLabelValues } from "@/lib/content";
import { formatContentLabel } from "@/lib/content/format-label";
import { getStorefrontContent } from "@/lib/content/server";
import { CategoryTileGrid, type CategoryTile } from "@/ui/sections/category-tile-grid/category-tile-grid";
import { FeaturedCollectionSection } from "@/ui/sections/featured-collection-section/featured-collection-section";
import { StorySection } from "@/ui/sections/story-section/story-section";
import { NewsletterSection } from "@/ui/sections/newsletter-section/newsletter-section";
import { CustomHero } from "@/ui/sections/custom-hero/custom-hero";
import {
	BlogSection,
	BlogSectionSkeleton,
	type BlogSectionPost,
} from "@/ui/sections/blog-section/blog-section";
import { sanityFetch } from "@/sanity/live";
import { featuredPostByRegionQuery, resolveRegionFromChannel } from "@/sanity/queries";
import type { SanityPostSummary } from "@/sanity/types";
import { HandHeart, Leaf, Truck, RotateCcw, LucideIcon } from "lucide-react";

export const metadata = {
	description: brandConfig.description,
};

// const HERO_SLUG_HINT = /shoe|plimsoll|sneaker|trainer|runner|force|boot/i;
type FeaturedProduct = Awaited<ReturnType<typeof getFeaturedProducts>>[number];

// function pickImage(product: FeaturedProduct | undefined) {
// 	if (!product?.thumbnail?.url) return null;
// 	return { url: product.thumbnail.url, alt: product.thumbnail.alt || product.name || "" };
// }

const valueIcons = {
	"Curated quality": HandHeart,
	"Natural materials": Leaf,
	"Fast fulfillment": Truck,
	"Easy returns": RotateCcw,
} as const;

type ValueIconKey = keyof typeof valueIcons;

function getIcon(text: string): LucideIcon | undefined {
	if (text in valueIcons) {
		return valueIcons[text as ValueIconKey];
	}
	return undefined;
}

function buildCategoryTiles(products: readonly FeaturedProduct[], max = 3): CategoryTile[] {
	const seen = new Set<string>();
	const tiles: CategoryTile[] = [];
	for (const product of products) {
		const category = product.category;
		if (!category?.slug || seen.has(category.slug)) continue;
		seen.add(category.slug);
		const categoryName = category.translation?.name || category.name;
		const image = category.backgroundImage?.url ?? product.thumbnail?.url ?? null;
		const imageAlt = category.backgroundImage?.alt || product.thumbnail?.alt || categoryName;
		tiles.push({
			title: categoryName,
			href: `/categories/${category.slug}`,
			image,
			imageAlt,
		});
		if (tiles.length >= max) break;
	}
	return tiles;
}

async function BlogSectionSlot({ channel }: { channel: string }) {
	const region = resolveRegionFromChannel(channel);
	const { data: featuredPostData } = await sanityFetch<SanityPostSummary>({
		query: featuredPostByRegionQuery(region),
		params: region ? { region } : {},
	});
	const featuredPost: BlogSectionPost | null = featuredPostData
		? {
				title: featuredPostData.title,
				slug: featuredPostData.slug,
				excerpt: featuredPostData.excerpt,
				category: featuredPostData.category,
				imageUrl: featuredPostData.imageUrl,
			}
		: null;

	return (
		<BlogSection
			post={featuredPost}
			heading="From the Journal"
			subHeading="Stories of craft, styling tips, and glimpses into the workshops of our artisan partners."
			cta={{ label: "Read Article", href: `/blog/${featuredPost?.slug}`, variant: "underline" }}
		/>
	);
}

export default async function Page({ params }: { params: Promise<{ locale: string; channel: string }> }) {
	const { locale, channel } = await params;
	const content = await getStorefrontContent(channel, locale);
	const { hero, values, featuredCollection, categories, brandStory, newsletter } = content.surfaces.homepage;

	const products = await getFeaturedProducts(
		channel,
		locale,
		featuredCollection.limit,
		featuredCollection.collectionSlug,
	);

	const categoryTiles = buildCategoryTiles(products);

	const currency = await resolveChannelCurrency(channel);
	const policyValues = buildPolicyLabelValues(content.policies, {
		currency,
		locale: resolveLocaleFromSlug(locale).bcp47,
	});
	const valueColumns = values.columns.map((column) => ({
		...column,
		text: formatContentLabel(column.text, policyValues),
		icon: getIcon(column.title),
	}));

	return (
		<>
			<CustomHero
				subheading={hero.subheading}
				image={hero.backgroundImage}
				imageAlt="Handmade home textiles"
				primaryCta={{ label: hero.primaryCtaLabel, href: "/products" }}
				secondaryCta={{ label: hero.secondaryCtaLabel as string, href: "/about" }}
			/>

			<section className="border-y border-border bg-secondary">
				<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
					<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
						{valueColumns.map((v) => (
							<div key={v.title} className="flex items-start gap-3">
								{v.icon ? (
									<div className="flex-shrink-0 rounded-lg bg-primary/15 p-2">
										<v.icon size={18} className="text-primary" />
									</div>
								) : null}
								<div>
									<p className="text-sm font-semibold text-foreground">{v.title}</p>
									<p className="mt-0.5 text-xs leading-snug text-muted-foreground">{v.text}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{categoryTiles.length >= 2 ? (
				<CategoryTileGrid
					eyebrow={categories.eyebrow}
					heading={categories.heading}
					tiles={categoryTiles}
					columns={categoryTiles.length >= 3 ? 3 : 2}
					imageFit="cover"
					className="py-20"
				/>
			) : null}

			<StorySection
				eyebrow={brandStory.eyebrow}
				heading={brandStory.heading}
				paragraphs={brandStory.paragraphs}
				primaryCta={{ label: brandStory.primaryCtaLabel, href: "/about", variant: "underline" }}
				image={brandStory.image}
				imageAlt="Artisan block printing"
			/>

			<FeaturedCollectionSection
				locale={locale}
				channel={channel}
				eyebrow={featuredCollection.eyebrow}
				heading={featuredCollection.heading}
				collectionSlug={featuredCollection.collectionSlug}
				limit={featuredCollection.limit}
				className="bg-background"
			/>

			<Suspense fallback={<BlogSectionSkeleton />}>
				<BlogSectionSlot channel={channel} />
			</Suspense>

			<NewsletterSection
				eyebrow={newsletter.eyebrow}
				heading={newsletter.heading}
				paragraph={newsletter.paragraph}
			/>
		</>
	);
}
