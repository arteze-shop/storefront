import { type NavMenuItem } from "@/lib/menus/serialize-menu-for-nav";
import { LucideIcon } from "lucide-react";

/** Normalized storefront marketing copy — provider-agnostic contract (v1). */
export const STOREFRONT_CONTENT_VERSION = 1 as const;

/**
 * Channel-wide commerce policies — the single source of truth for facts that copy
 * only *describes* (free-shipping threshold, returns window). These are structured
 * values (not strings): channel-scoped, locale-independent, and consumed by logic
 * (cart progress math) as well as interpolated into copy via `{placeholder}` tokens.
 */
export type ShippingPolicy = {
	/**
	 * Order subtotal in the channel currency required to unlock free shipping.
	 * `null` means the channel runs no free-shipping program (hide the progress bar,
	 * the "free delivery over" trust signal, and the announcement threshold).
	 */
	freeShippingThreshold: number | null;
};

export type ReturnsPolicy = {
	/** Number of days a customer has to return an order. */
	windowDays: number;
};

export type StorefrontPolicies = {
	shipping: ShippingPolicy;
	returns: ReturnsPolicy;
};

export type AnnouncementBarContent = {
	/**
	 * Optional campaign slug for dismissal persistence. When empty (default), dismissals
	 * are keyed by a hash of `message` + `href` + `linkLabel` — copy edits re-show the
	 * bar. Set `announcement-id` in Saleor (or here in code) to pin dismissal across
	 * message tweaks. See `resolveAnnouncementDismissKey` in `announcement-dismiss-key.ts`.
	 */
	id: string;
	message: string;
	href: string | null;
	linkLabel: string | null;
	dismissible: boolean;
	backendValues: boolean;
};

export type HomepageHeroContent = {
	/** Short overline above the hero heading. Optional — rendered only when set. */
	eyebrow?: string;
	heading: string;
	subheading: string;
	primaryCtaLabel: string;
	secondaryCtaLabel?: string;
	/** Set only when Saleor storefront-homepage model provides hero-image (FILE). */
	backgroundImage?: string | null;
};

export type HomepageFeaturedCollectionContent = {
	eyebrow?: string;
	heading: string;
	/** Saleor collection slug for the product grid (Dashboard: Featured collection reference). */
	collectionSlug: string;
	limit: number;
};

export type HomepageStoryContent = {
	eyebrow?: string;
	primaryCtaLabel: string;
	image?: string;
};

export type HomepageBrandStoryContent = {
	eyebrow?: string;
	heading: string;
	paragraphs: readonly string[];
	primaryCtaLabel: string;
	image?: string;
};

export type HomepageColumnContent = {
	title: string;
	text: string;
	icon?: LucideIcon;
};

export type HomepageValuesContent = {
	heading?: string;
	columns: readonly HomepageColumnContent[];
	columnsDesktop?: 2 | 3 | 4;
};

export type HomepageEditorialContent = {
	heading: string;
	paragraphs: readonly string[];
	imagePosition: "left" | "right";
	ctaLabel: string;
	/** Editorial image URL; falls back to the brand placeholder when unset. */
	image?: string | null;
	imageAlt?: string;
};

export type HomepageNewsletterContent = {
	eyebrow?: string;
	heading: string;
	paragraph: string;
};

/**
 * Copy for the shop-by-category tiles. The tiles themselves are derived from the
 * catalog (categories) in the page; only the section heading/eyebrow are editable.
 */
export type HomepageCategoriesContent = {
	heading: string;
	eyebrow?: string;
};

export type HomepagePhotoCredit = {
	name: string;
	href: string;
};

export type HomepageContent = {
	hero: HomepageHeroContent;
	featuredCollection: HomepageFeaturedCollectionContent;
	categories: HomepageCategoriesContent;
	/** Photographer attribution for hero + category lifestyle images. */
	photoCredits: readonly HomepagePhotoCredit[];
	brandStory: HomepageBrandStoryContent;
	values: HomepageValuesContent;
	editorial?: HomepageEditorialContent;
	newsletter: HomepageNewsletterContent;
};

export type AboutPageHeroContent = {
	image?: string;
	imageAlt?: string;
	heading: string;
	subheading?: string;
};

export type AboutPageVisionContent = {
	eyebrow?: string;
	heading: string;
	content: string[];
	image: string;
	imageAlt?: string;
};

export type AboutPageValuesContent = {
	id: string;
	heading: string;
	description: string;
};

export type AboutPageExploreContent = {
	logo?: string;
	heading: string;
	content: string;
	ctaLabel?: string;
};

export type AboutPageContent = {
	hero: AboutPageHeroContent;
	vision: AboutPageVisionContent;
	values: AboutPageValuesContent[];
	explore: AboutPageExploreContent;
};

export type CartEmptyContent = {
	title: string;
	body: string;
	ctaLabel: string;
};

export type CartTrustContent = {
	/** Prefix before a formatted money amount (e.g. "Free delivery over"). */
	freeShippingPrefix: string;
	returnsLabel: string;
};

/**
 * Editorial cart-drawer copy only. Functional drawer chrome (totals, buttons, a11y
 * labels, item count) lives in the code-owned i18n catalog (`messages/*.json`,
 * namespace `cart.drawer`) — see ADR 0002.
 */
export type CartDrawerContent = {
	title: string;
	/** e.g. `Add {amount} more for free shipping` — `{amount}` is pre-formatted money */
	addForFreeShipping: string;
	freeShippingQualified: string;
};

export type CartContent = {
	empty: CartEmptyContent;
	trust: CartTrustContent;
	drawer: CartDrawerContent;
};

export type CheckoutEmptyCartContent = {
	title: string;
	body: string;
	startShoppingLabel: string;
	goBackLabel: string;
};

export type CheckoutEmptySessionContent = {
	title: string;
	message: string;
};

export type CheckoutTrustContent = {
	secureCheckout: string;
	stripeProcessor: string;
};

export type CheckoutContent = {
	emptyCart: CheckoutEmptyCartContent;
	emptySession: CheckoutEmptySessionContent;
	marketingOptInLabel: string;
	trust: CheckoutTrustContent;
};

export type ContactContent = {
	phone: string;
	address: string;
};

/**
 * Channel-keyed contact details with a required `default` fallback.
 * Resolution: `contact[channel] ?? contact.default` (see `resolveContactContent`).
 */
export type ContactContentByChannel = {
	default: ContactContent;
} & Record<string, ContactContent>;

export type StorefrontChromeContent = {
	announcementBar: AnnouncementBarContent;
	nav: NavChromeContent;
};

export type NavChromeContent = {
	/** Top-level “All products” link in the mega menu. */
	allProductsLabel: string;
	/** Footer link in mega menu panels — e.g. `View all {label}`. */
	viewAllLabel: string;
	/** Custom menu navigation links - eg. blog, contact, etc  */
	items?: NavMenuItem[];
};

/**
 * Editorial listing copy. Breadcrumb labels (Home / Products) are functional chrome and
 * live in the code-owned i18n catalog (`messages/*.json`, namespace `productsListing`).
 */
export type ProductsListingContent = {
	title: string;
	description: string;
	image?: string;
};

export type StorefrontSurfacesContent = {
	homepage: HomepageContent;
	aboutpage: AboutPageContent;
	products: ProductsListingContent;
	cart: CartContent;
	checkout: CheckoutContent;
	contact: ContactContentByChannel;
};

export type StorefrontContent = {
	version: typeof STOREFRONT_CONTENT_VERSION;
	policies: StorefrontPolicies;
	chrome: StorefrontChromeContent;
	surfaces: StorefrontSurfacesContent;
};

export type ContentProviderId = "code" | "saleor" | "url";

export type StorefrontContentRequest = {
	channel: string;
	/** URL locale slug (`en`, `pl`) — passed to Saleor `languageCode` when provider is `saleor`. */
	locale?: string;
};
