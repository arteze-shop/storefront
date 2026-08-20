export interface FaqItem {
	question: string;
	answer: string;
}

export interface FaqGroup {
	category: string;
	items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
	{
		category: "Our Products",
		items: [
			{
				question: "Does Arteze make its own products?",
				answer:
					"No. Arteze is a curator, not a manufacturer. We partner directly with independent artisans, family-run workshops, and craft cooperatives — mainly across India — and bring their work to your home. Every product page names the region the piece was sourced from.",
			},
			{
				question: "Why does my item look slightly different from the photo?",
				answer:
					"Because it was made by hand. Hand-loomed rugs, block-printed throws, and hand-painted ceramics carry small variations in colour, dye depth, weave, and dimensions. These are not flaws — they are the signature of the maker, and no two pieces are identical.",
			},
			{
				question: "What materials do you work with?",
				answer:
					"We prioritise natural materials: organic cotton, jute, wool, linen, seagrass, and clay, finished with vegetable and azo-free dyes wherever possible. Full material details are listed on every product page.",
			},
			{
				question: "How should I care for my piece?",
				answer:
					"Care varies by material. As a rule, spot clean textiles with cold water and a mild detergent, keep naturally dyed pieces out of prolonged direct sunlight, rotate rugs periodically for even wear, and hand-wash ceramics. Specific care notes are included on each product page and on the tag.",
			},
		],
	},
	{
		category: "Orders & Payment",
		items: [
			{
				question: "Can I change or cancel my order?",
				answer:
					"Get in touch within 12 hours of placing your order and we will do our best to amend or cancel it. Once an order has been packed or dispatched from an artisan workshop we can no longer change it, but you can still return it under our 30-day policy.",
			},
			{
				question: "What payment methods do you accept?",
				answer:
					"All major credit and debit cards. Payments are handled by our secure payment provider — Arteze never sees or stores your full card number.",
			},
			{
				question: "Do you offer gift wrapping?",
				answer:
					"Yes. Every order is wrapped in unbleached tissue and recycled kraft paper as standard. You can add a handwritten note at checkout at no extra cost.",
			},
		],
	},
	{
		category: "Shipping & Returns",
		items: [
			{
				question: "How long will my order take?",
				answer:
					"Orders are packed within the same day. Standard delivery takes 1–2 business days. Made-to-order rugs can take 3–4 weeks, which is noted on the product page.",
			},
			// {
			// 	question: "Do you ship internationally?",
			// 	answer:
			// 		"Yes, we ship worldwide. Duties and import taxes are calculated at checkout for most destinations; where they are not, they remain the responsibility of the recipient.",
			// },
			{
				question: "What is your returns policy?",
				answer:
					"Return any unused item in its original condition within 30 days of delivery for a full refund, excluding shipping charges. Made-to-order and custom-sized pieces are final sale. See our Shipping & Returns page for the full process.",
			},
		],
	},
	{
		category: "Artisans & Sourcing",
		items: [
			{
				question: "How do you choose your artisan partners?",
				answer:
					"We visit workshops in person, work directly with makers rather than through middlemen, and look for craft traditions worth sustaining — block printing in Jaipur, pit-loom weaving in Rajasthan, indigo dyeing in Gujarat, crewel embroidery in Kashmir, and more.",
			},
			{
				question: "Are your artisans paid fairly?",
				answer:
					"Yes. Direct trade is the core of how we operate. By removing middlemen, a far greater share of what you pay reaches the person who made the piece, and we commit to repeat orders so workshops have predictable income.",
			},
			{
				question: "Do you work with interior designers or stockists?",
				answer:
					"Yes, we are interior designers ourselves and work with a small number of select boutiques. Email info@arteze.shop with your inquiry and we will send our trade terms and lookbook.",
			},
		],
	},
];
