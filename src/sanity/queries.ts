import { groq } from "next-sanity";

export type PostRegion = "BH" | "AE" | null;

/**
 * Map a storefront channel slug to a Sanity post region code.
 * The default channel has no region, so it resolves to null (all regions).
 */
export function resolveRegionFromChannel(channel: string | undefined): PostRegion {
	const region = channel?.toUpperCase();
	return region === "AE" || region === "BH" ? region : null;
}

const POST_FIELDS = groq`{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "category": categories[0]->title,
  publishedAt,
  author,
  "imageUrl": image.asset->url
}`;

/** Posts are region-scoped unless a post's region is null (All), which shows everywhere. */
function regionFilter(region: PostRegion): string {
	return region ? ` && (region == null || region == $region)` : "";
}

export function postsByRegionQuery(region: PostRegion) {
	return groq`*[_type == "post" && defined(slug.current)${regionFilter(region)}] | order(featured desc, publishedAt desc) ${POST_FIELDS}`;
}

/** Newest featured post in the region first, otherwise the latest region post. */
export function featuredPostByRegionQuery(region: PostRegion) {
	return groq`*[_type == "post" && defined(slug.current)${regionFilter(region)}] | order(featured desc, publishedAt desc) [0] ${POST_FIELDS}`;
}

export const POSTS_QUERY = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) ${POST_FIELDS}`;

export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "category": categories[0]->title,
  publishedAt,
  author,
  "imageUrl": image.asset->url,
  body
}`;

export const POST_SLUGS_QUERY = groq`*[_type == "post" && defined(slug.current)] { "slug": slug.current }`;
