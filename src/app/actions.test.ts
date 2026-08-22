import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
	cookies: vi.fn(),
}));

vi.mock("next/cache", () => ({
	revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth/bff-server", () => ({
	signOutSession: vi.fn(),
}));

vi.mock("@/lib/graphql", () => ({
	executeAuthenticatedGraphQL: vi.fn(),
}));

vi.mock("@/lib/checkout", () => ({}));

import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import { getChromeFingerprint } from "./actions";

function mockCookies(cookieList: Array<{ name: string; value: string }>) {
	vi.mocked(cookies).mockResolvedValue({
		get: (name: string) => cookieList.find((cookie) => cookie.name === name),
		getAll: () => cookieList,
	} as Awaited<ReturnType<typeof cookies>>);
}

describe("getChromeFingerprint", () => {
	it("returns the anonymous constant when no chrome cookies exist", async () => {
		mockCookies([{ name: "theme", value: "dark" }]);
		await expect(getChromeFingerprint()).resolves.toBe("anonymous");
	});

	it("hashes auth and checkout cookies into 12 hex chars", async () => {
		mockCookies([
			{ name: "checkoutId-default-channel", value: "ck-1" },
			{ name: "saleor_auth_access_token", value: "tok-1" },
			{ name: "unrelated", value: "nope" },
		]);
		const fingerprint = await getChromeFingerprint();
		expect(fingerprint).toMatch(/^[0-9a-f]{12}$/);
		expect(fingerprint).toBe(
			createHash("sha256")
				.update("checkoutId-default-channel=ck-1;saleor_auth_access_token=tok-1")
				.digest("hex")
				.slice(0, 12),
		);
	});

	it("is order-independent", async () => {
		mockCookies([
			{ name: "saleor_auth_access_token", value: "tok-1" },
			{ name: "checkoutId-default-channel", value: "ck-1" },
		]);
		const first = await getChromeFingerprint();
		mockCookies([
			{ name: "checkoutId-default-channel", value: "ck-1" },
			{ name: "saleor_auth_access_token", value: "tok-1" },
		]);
		await expect(getChromeFingerprint()).resolves.toBe(first);
	});

	it("changes when a cookie value changes", async () => {
		mockCookies([{ name: "saleor_auth_access_token", value: "tok-1" }]);
		const first = await getChromeFingerprint();
		mockCookies([{ name: "saleor_auth_access_token", value: "tok-2" }]);
		await expect(getChromeFingerprint()).resolves.not.toBe(first);
	});
});
