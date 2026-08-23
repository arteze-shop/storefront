"use client";

interface ShareButtonsProps {
	title: string;
}

export function PostShareButtons({ title }: ShareButtonsProps) {
	const handleShare = (platform: "facebook" | "twitter") => {
		// Get current page URL safely on the client side
		const currentUrl = window.location.href;
		if (!currentUrl) return;
		const shareUrl = encodeURIComponent(currentUrl);
		const shareText = encodeURIComponent(`Check out this article: ${title}`);

		let targetUrl = "";

		if (platform === "facebook") {
			targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
		} else if (platform === "twitter") {
			targetUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
		}

		// Open share target in a new browser tab
		if (targetUrl) {
			window.open(targetUrl, "_blank");
		}
	};

	return (
		<div className="flex items-center space-x-4">
			<span className="text-sm font-light text-foreground/60">Share:</span>
			<button
				className="text-foreground transition-colors hover:text-primary"
				aria-label="Share on Facebook"
				onClick={() => handleShare("facebook")}
			>
				<svg
					role="img"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					className="h-4 w-4 fill-current"
				>
					<title>Facebook</title>
					<path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
				</svg>
			</button>
			<button
				className="text-foreground transition-colors hover:text-primary"
				aria-label="Share on Twitter"
				onClick={() => handleShare("twitter")}
			>
				<svg
					role="img"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					className="h-3 w-3 fill-current"
				>
					<title>X</title>
					<path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
				</svg>
			</button>
		</div>
	);
}
