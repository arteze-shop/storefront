// import { brandConfig } from "@/config/brand";
import { STOREFRONT_CONTENT_VERSION, type StorefrontContent } from "@/lib/content/types";

/**
 * Code fallback for all storefront marketing copy.
 * Saleor PageType overrides merge on top when CONTENT_PROVIDER=saleor.
 *
 * English SoT for editorial copy — export to Configurator seed: pnpm content:export-seed
 */
export const defaultStorefrontContent = {
	version: STOREFRONT_CONTENT_VERSION,
	// Single source of truth for channel-wide facts. Copy references these via
	// `{freeShippingThreshold}` / `{returnsWindowDays}` tokens instead of baking the
	// numbers into strings, so the cart math, announcement, and trust labels never drift.
	policies: {
		shipping: {
			freeShippingThreshold: 75,
		},
		returns: {
			windowDays: 30,
		},
	},
	chrome: {
		announcementBar: {
			id: "",
			message: "Free shipping on orders over {freeShippingThreshold}",
			href: null,
			linkLabel: null,
			dismissible: true,
			backendValues: true,
		},
		nav: {
			allProductsLabel: "Shop",
			viewAllLabel: "View all {label}",
			items: [
				{
					id: "about",
					label: "Our Story",
					href: "/about",
				},
				{
					id: "blog",
					label: "Journal",
					href: "/blog",
				},
				{
					id: "contact",
					label: "Contact",
					href: "/contact",
				},
			],
		},
	},
	surfaces: {
		homepage: {
			hero: {
				heading: "Home goods made by hand, with heart.",
				// subheading: brandConfig.tagline,
				subheading:
					"Every rug, throw, and cushion cover at arteze is crafted by skilled artisans using traditional techniques and natural materials. Built to last. Made to love.",
				primaryCtaLabel: "Shop the Collection",
				secondaryCtaLabel: "Our Story",
				backgroundImage: "/hero-image.webp",
			},
			featuredCollection: {
				eyebrow: "Featured",
				heading: "New Arrivals",
				collectionSlug: "featured-products",
				limit: 8,
			},
			categories: {
				eyebrow: "collections",
				heading: "Shop by category",
			},
			photoCredits: [],
			brandStory: {
				eyebrow: "Our Philosophy",
				heading: "Preserving Heritage Through Slow Craft",
				paragraphs: [
					"We don't manufacture; we curate. Arteze partners directly with artisan communities across India and beyond, bringing their centuries-old techniques to the modern home.",
					"From hand-carved block prints in Jaipur to pit-loom weaving in Rajasthan, every piece in ourcollection is a testament to human skill and natural materials.",
				],
				primaryCtaLabel: "Read Our Story",
				image:
					"https://images.unsplash.com/photo-1694286234126-a56c38152ee1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			},
			values: {
				columns: [
					{
						title: "Curated quality",
						text: "Every product is selected for craftsmanship and longevity — not trend-chasing.",
					},
					{
						title: "Natural materials",
						text: "We use wool, cotton, linen and plant-based dyes sourced responsibly.",
					},
					{
						title: "Fast fulfillment",
						text: "Orders ship from regional warehouses with tracking from checkout to delivery.",
					},
					{
						title: "Easy returns",
						text: "Hassle-free returns within {returnsWindowDays} days. We stand behind what we sell.",
					},
				],
			},
			newsletter: {
				eyebrow: "Newsletter",
				heading: "Slow letters, beautiful things.",
				paragraph:
					"Join our community for seasonal collections, craft stories, and exclusive offers. We only send what's worth reading.",
			},
		},
		aboutpage: {
			hero: {
				image:
					"https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=2000",
				heading: "Our Story",
				subheading: "Connecting modern homes with ancient craft traditions.",
			},
			vision: {
				eyebrow: "The Vision",
				heading: "Curators, Not Manufacturers",
				content: [
					"Arteze was born from a simple realization: the most beautiful objects in our homes are the ones with a story. In a world dominated by mass production, we felt a deep need to return to the human hand.",
					"We do not own factories. Instead, we travel the globe—focusing heavily on the rich textile and ceramic traditions of India—to partner directly with independent artisans, family-run workshops, and craft cooperatives.",
				],
				image: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=800",
				imageAlt: "Hands working",
			},
			values: [
				{
					id: "direct-trade",
					heading: "Direct Trade",
					description:
						"By cutting out middlemen, we ensure our artisan partners receive fair compensation for their extraordinary skill, while keeping prices accessible for you.",
				},
				{
					id: "slow-craft",
					heading: "Slow Craft",
					description:
						"Our pieces take time. From hand-carving wooden blocks to pit-loom weaving, we celebrate the slow, deliberate pace of traditional craftsmanship.",
				},
				{
					id: "natural-materials",
					heading: "Natural Materials",
					description:
						"We prioritize organic cotton, jute, linen, and vegetable dyes. Better for the earth, better for the makers, and better for your home.",
				},
			],
			explore: {
				logo: "",
				heading: "Bring the World Home",
				content:
					"Every rug, throw, and ceramic piece in our collection is an invitation to slow down and appreciate the beauty of imperfection. We invite you to explore our curations and find the next heirloom for your space.",
				ctaLabel: "Explore the Shop",
			},
		},
		products: {
			title: "The Shop",
			description: "Discover our full collection of premium products.",
			image: "/brand-pattern-01.svg",
		},
		cart: {
			empty: {
				title: "Your bag is empty",
				body: "Looks like you haven't added anything to your bag yet.",
				ctaLabel: "Start Shopping",
			},
			trust: {
				freeShippingPrefix: "Free delivery over",
				returnsLabel: "{returnsWindowDays}-day returns",
			},
			drawer: {
				title: "Your Bag",
				addForFreeShipping: "Add {amount} more for free shipping",
				freeShippingQualified: "You qualify for free shipping!",
			},
		},
		checkout: {
			emptyCart: {
				title: "Your cart is empty",
				body: "Looks like you haven't added anything to your cart yet.",
				startShoppingLabel: "Start Shopping",
				goBackLabel: "Go back",
			},
			emptySession: {
				title: "Your cart is empty",
				message: "Add items from the store, then return here to complete your purchase.",
			},
			marketingOptInLabel: "Email me with news and offers",
			trust: {
				secureCheckout: "Secure checkout",
				stripeProcessor: "Payments processed by Stripe",
			},
		},
		contact: {
			default: {
				phone: "+973 3451 4543",
				address: "Block 711 Tubli, Bahrain",
			},
			bh: {
				phone: "+973 3451 4543",
				address: "Block 711 Tubli,\nBahrain",
			},
			ae: {
				phone: "+971 56 345 6768",
				address: "Al Danah,\nAbu Dhabi, UAE",
			},
		},
	},
} satisfies StorefrontContent;
