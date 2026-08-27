export async function validateTurnstile(
	token: string | null,
	remoteip?: string | null,
): Promise<{ success: boolean; "error-codes": string[]; [key: string]: unknown }> {
	const secret = process.env.TURNSTILE_SECRET_KEY;
	if (!secret) {
		return { success: false, "error-codes": ["missing-secret"] } as const;
	}

	try {
		const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				secret,
				response: token,
				remoteip: remoteip || undefined,
			}),
		});

		const result = (await response.json()) as {
			success: boolean;
			"error-codes": string[];
			[key: string]: unknown;
		};
		return result;
	} catch (error) {
		console.error("Turnstile validation error:", error);
		return { success: false, "error-codes": ["internal-error"] } as const;
	}
}
