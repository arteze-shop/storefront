export default function imageLoader({
	src,
	width,
	quality,
}: {
	src: string;
	width: number;
	quality?: number;
}) {
	// If it's an absolute URL (production), return it as-is
	if (src.startsWith("https://media.arteze.shop/")) {
		return `${src}?w=${width}&q=${quality || 75}`;
	}

	// If it's a relative path from the backend
	if (src.startsWith("/media/")) {
		// In development, use localhost
		if (process.env.NODE_ENV === "development") {
			return `http://localhost:8000${src}`;
		}
		// In production, use API domain
		return `https://api.arteze.shop${src}`;
	}

	// Fallback
	return `${src}?w=${width}&q=${quality || 75}`;
}
