import { afterEach, describe, expect, it, vi } from "vitest";
import {
	findZiinaGateway,
	getZiinaPaymentGuardError,
	getZiinaRedirectUrl,
	isZiinaGateway,
	isZiinaPaymentEnabled,
	parseZiinaTransactionData,
	ZIINA_GATEWAY_ID,
} from "./ziina";

describe("isZiinaGateway", () => {
	it("matches the Saleor Ziina app id", () => {
		expect(isZiinaGateway(ZIINA_GATEWAY_ID)).toBe(true);
	});

	it("does not match other gateway ids", () => {
		expect(isZiinaGateway("custom.ziina.gateway")).toBe(false);
		expect(isZiinaGateway("ziina")).toBe(false);
	});
});

describe("findZiinaGateway", () => {
	it("returns the ziina gateway from checkout gateways", () => {
		const ziina = { id: ZIINA_GATEWAY_ID, name: "Ziina" };
		expect(findZiinaGateway([{ id: "saleor.app.payment.stripe", name: "Stripe" }, ziina])).toEqual(ziina);
	});
});

describe("isZiinaPaymentEnabled", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("allows ziina in development", () => {
		vi.stubEnv("NODE_ENV", "development");
		expect(isZiinaPaymentEnabled()).toBe(true);
	});

	it("blocks ziina in production by default", () => {
		vi.stubEnv("NODE_ENV", "production");
		expect(isZiinaPaymentEnabled()).toBe(false);
	});

	it("allows ziina in production when NEXT_PUBLIC_ENABLE_ZIINA_PAYMENTS is set", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("NEXT_PUBLIC_ENABLE_ZIINA_PAYMENTS", "true");
		expect(isZiinaPaymentEnabled()).toBe(true);
	});

	it("allows ziina in production when ENABLE_ZIINA_PAYMENTS is set", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("ENABLE_ZIINA_PAYMENTS", "true");
		expect(isZiinaPaymentEnabled()).toBe(true);
	});
});

describe("getZiinaPaymentGuardError", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("returns null for non-ziina gateways", () => {
		vi.stubEnv("NODE_ENV", "production");
		expect(getZiinaPaymentGuardError("saleor.app.payment.stripe")).toBeNull();
	});

	it("blocks ziina gateway in production without flag", () => {
		vi.stubEnv("NODE_ENV", "production");
		expect(getZiinaPaymentGuardError(ZIINA_GATEWAY_ID)).toMatch(/not enabled/i);
	});

	it("allows ziina gateway when enabled", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("NEXT_PUBLIC_ENABLE_ZIINA_PAYMENTS", "true");
		expect(getZiinaPaymentGuardError(ZIINA_GATEWAY_ID)).toBeNull();
	});

	it("allows ziina gateway in development", () => {
		vi.stubEnv("NODE_ENV", "development");
		expect(getZiinaPaymentGuardError(ZIINA_GATEWAY_ID)).toBeNull();
	});
});

describe("parseZiinaTransactionData", () => {
	it("extracts redirect url from transaction initialize data", () => {
		expect(
			parseZiinaTransactionData({
				paymentIntent: { redirectUrl: "https://pay.ziina.com/checkout/abc" },
			}),
		).toEqual({
			paymentIntent: { redirectUrl: "https://pay.ziina.com/checkout/abc" },
		});
	});

	it("returns null when payment intent is missing", () => {
		expect(parseZiinaTransactionData({})).toBeNull();
		expect(parseZiinaTransactionData(null)).toBeNull();
	});
});

describe("getZiinaRedirectUrl", () => {
	it("returns trimmed redirect url", () => {
		expect(
			getZiinaRedirectUrl({
				paymentIntent: { redirectUrl: "  https://pay.ziina.com/checkout/abc  " },
			}),
		).toBe("https://pay.ziina.com/checkout/abc");
	});

	it("returns null when redirect url is missing or empty", () => {
		expect(getZiinaRedirectUrl({})).toBeNull();
		expect(getZiinaRedirectUrl({ paymentIntent: {} })).toBeNull();
		expect(getZiinaRedirectUrl({ paymentIntent: { redirectUrl: "   " } })).toBeNull();
	});
});
