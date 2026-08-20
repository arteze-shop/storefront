import type { PartialStorefrontContent } from "@/lib/content/saleor/types";
import type {
	AboutPageValuesContent,
	ContactContentByChannel,
	HomepageEditorialContent,
	StorefrontContent,
} from "@/lib/content/types";

/** Keep base array when override is missing or empty (unset Saleor list fields). */
function coalesceArray<T>(override: readonly T[] | undefined, base: readonly T[]): readonly T[] {
	if (override === undefined || override.length === 0) {
		return base;
	}
	return override;
}

/** Deep-merge partial storefront content over defaults (Saleor / URL providers). */
export function mergeStorefrontContent(
	base: StorefrontContent,
	override: PartialStorefrontContent | null | undefined,
): StorefrontContent {
	if (!override) return base;

	return {
		version: base.version,
		policies: {
			shipping: {
				...base.policies.shipping,
				...override.policies?.shipping,
			},
			returns: {
				...base.policies.returns,
				...override.policies?.returns,
			},
		},
		chrome: {
			...base.chrome,
			...override.chrome,
			announcementBar: {
				...base.chrome.announcementBar,
				...override.chrome?.announcementBar,
			},
			nav: {
				...base.chrome.nav,
				...override.chrome?.nav,
			},
		},
		surfaces: {
			homepage: {
				...base.surfaces.homepage,
				...override.surfaces?.homepage,
				hero: { ...base.surfaces.homepage.hero, ...override.surfaces?.homepage?.hero },
				featuredCollection: {
					...base.surfaces.homepage.featuredCollection,
					...override.surfaces?.homepage?.featuredCollection,
				},
				categories: {
					...base.surfaces.homepage.categories,
					...override.surfaces?.homepage?.categories,
				},
				photoCredits: coalesceArray(
					override.surfaces?.homepage?.photoCredits,
					base.surfaces.homepage.photoCredits,
				),
				brandStory: {
					...base.surfaces.homepage.brandStory,
					...override.surfaces?.homepage?.brandStory,
					paragraphs: coalesceArray(
						override.surfaces?.homepage?.brandStory?.paragraphs,
						base.surfaces.homepage.brandStory.paragraphs,
					),
				},
				values: {
					...base.surfaces.homepage.values,
					...override.surfaces?.homepage?.values,
					columns: coalesceArray(
						override.surfaces?.homepage?.values?.columns,
						base.surfaces.homepage.values.columns,
					),
				},
				newsletter: {
					...base.surfaces.homepage.newsletter,
					...override.surfaces?.homepage?.newsletter,
				},
				// `editorial` is optional in HomepageContent — only emit it when base or
				// override provides one. The base entry (when present) supplies the required
				// fields; the override is a DeepPartial, so we assert the merged shape.
				...(base.surfaces.homepage.editorial || override.surfaces?.homepage?.editorial
					? {
							editorial: {
								...base.surfaces.homepage.editorial,
								...override.surfaces?.homepage?.editorial,
								paragraphs: coalesceArray(
									override.surfaces?.homepage?.editorial?.paragraphs,
									base.surfaces.homepage.editorial?.paragraphs ?? [],
								),
							} as HomepageEditorialContent,
						}
					: {}),
			},
			aboutpage: {
				...base.surfaces.aboutpage,
				...override.surfaces?.aboutpage,
				hero: { ...base.surfaces.aboutpage.hero, ...override.surfaces?.aboutpage?.hero },
				vision: {
					...base.surfaces.aboutpage.vision,
					...override.surfaces?.aboutpage?.vision,
					content:
						(override.surfaces?.aboutpage?.vision?.content as string[] | undefined) ??
						base.surfaces.aboutpage.vision.content,
				},
				values:
					(override.surfaces?.aboutpage?.values as AboutPageValuesContent[] | undefined) ??
					base.surfaces.aboutpage.values,
				explore: { ...base.surfaces.aboutpage.explore, ...override.surfaces?.aboutpage?.explore },
			},
			products: {
				...base.surfaces.products,
				...override.surfaces?.products,
			},
			cart: {
				...base.surfaces.cart,
				...override.surfaces?.cart,
				empty: { ...base.surfaces.cart.empty, ...override.surfaces?.cart?.empty },
				trust: { ...base.surfaces.cart.trust, ...override.surfaces?.cart?.trust },
				drawer: { ...base.surfaces.cart.drawer, ...override.surfaces?.cart?.drawer },
			},
			checkout: {
				...base.surfaces.checkout,
				...override.surfaces?.checkout,
				emptyCart: {
					...base.surfaces.checkout.emptyCart,
					...override.surfaces?.checkout?.emptyCart,
				},
				emptySession: {
					...base.surfaces.checkout.emptySession,
					...override.surfaces?.checkout?.emptySession,
				},
				trust: {
					...base.surfaces.checkout.trust,
					...override.surfaces?.checkout?.trust,
				},
			},
			// Channel-keyed contact entries are complete objects in code defaults; the
			// Saleor override (DeepPartial) is spread on top of the full base map.
			contact: {
				...base.surfaces.contact,
				...(override.surfaces?.contact as ContactContentByChannel | undefined),
			},
		},
	};
}
