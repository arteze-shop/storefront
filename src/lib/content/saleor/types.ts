import type { StorefrontContent } from "@/lib/content/types";

type DeepPartial<T> = {
	[P in keyof T]?: NonNullable<T[P]> extends readonly unknown[]
		? NonNullable<T[P]>
		: NonNullable<T[P]> extends object
			? DeepPartial<NonNullable<T[P]>>
			: T[P];
};

/** Partial overrides merged onto code defaults — Saleor provider returns this shape only. */
export type PartialStorefrontContent = {
	policies?: DeepPartial<StorefrontContent["policies"]>;
	chrome?: DeepPartial<StorefrontContent["chrome"]>;
	surfaces?: DeepPartial<StorefrontContent["surfaces"]>;
};
