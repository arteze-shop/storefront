"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, useRef, type ReactNode } from "react";

import { getChromeFingerprint, revalidateStorefrontChromeAction } from "@/app/actions";
import { consumeAuthSurfaceHardNav } from "@/lib/auth/auth-surface-nav";

/**
 * Keeps header auth chrome in sync with HttpOnly session cookies.
 *
 * - First paint: if session/checkout cookies exist, revalidate channel layout + refresh once —
 *   busts a PPR/layout shell that rendered the anonymous header before the cookie was read.
 *   Anonymous visitors skip this entirely (the static shell already shows the guest header).
 * - Tab becomes visible: compare a cheap cookie fingerprint against the last known one and
 *   revalidate + refresh only when it changed (login/logout in another tab). A 5s cooldown
 *   and an in-flight guard keep iOS Safari's frequent visibility flips from refreshing the page.
 *
 * Deliberately does NOT refresh on in-store navigation. The header lives in the shared
 * layout (preserved across sibling navigations), and every session/cart mutation already
 * busts chrome via `revalidateStorefrontChrome` (add-to-cart, cart line edits, login/logout,
 * checkout). Refreshing on every pathname change forced a server round-trip per soft nav,
 * which defeated instant navigations to prerendered shells — most visibly returning to the
 * homepage, which has no loading skeleton to mask the wait.
 */

const VISIBILITY_COOLDOWN_MS = 5000;

const ANONYMOUS_FINGERPRINT = "anonymous";

// Module scope so state survives dev's Suspense-induced unmount/remount of this layout child.
let chromeFingerprint: string | null = null;
let lastVisibilityCheckAt = 0;
let isChromeCheckInFlight = false;

async function syncChromeIfChanged(channel: string, router: ReturnType<typeof useRouter>) {
	if (isChromeCheckInFlight) {
		return;
	}
	isChromeCheckInFlight = true;
	try {
		const fingerprint = await getChromeFingerprint();
		const changed = chromeFingerprint !== fingerprint;
		chromeFingerprint = fingerprint;
		if (!changed) {
			return;
		}
		await revalidateStorefrontChromeAction(channel);
		startTransition(() => {
			router.refresh();
		});
	} finally {
		isChromeCheckInFlight = false;
	}
}

export function HeaderAuthRefresh({ channel, children }: { channel: string; children: ReactNode }) {
	const router = useRouter();
	const hasSyncedInitialChrome = useRef(false);

	useEffect(() => {
		if (hasSyncedInitialChrome.current) return;
		hasSyncedInitialChrome.current = true;

		// Login/logout use hard navigation — the document already has fresh auth chrome;
		// router.refresh() here can restore a stale Router Cache shell (guest after login,
		// or broken menu after logout).
		if (consumeAuthSurfaceHardNav()) {
			void getChromeFingerprint().then((fingerprint) => {
				chromeFingerprint = fingerprint;
			});
			return;
		}

		void getChromeFingerprint().then((fingerprint) => {
			const previous = chromeFingerprint;
			chromeFingerprint = fingerprint;
			if (previous === null || previous === ANONYMOUS_FINGERPRINT) {
				// Only set the timestamp, don't refresh
				lastVisibilityCheckAt = Date.now();
				return;
			}

			// Only refresh if the fingerprint actually changed
			if (previous !== fingerprint) {
				lastVisibilityCheckAt = Date.now();
				void revalidateStorefrontChromeAction(channel).then(() => {
					startTransition(() => {
						router.refresh();
					});
				});
			}
		});
	}, [channel, router]);

	useEffect(() => {
		const syncAuthAfterTabFocus = () => {
			if (document.visibilityState !== "visible") {
				return;
			}

			const now = Date.now();
			if (now - lastVisibilityCheckAt < VISIBILITY_COOLDOWN_MS) {
				return;
			}
			lastVisibilityCheckAt = now;

			void syncChromeIfChanged(channel, router);
		};

		document.addEventListener("visibilitychange", syncAuthAfterTabFocus);
		return () => document.removeEventListener("visibilitychange", syncAuthAfterTabFocus);
	}, [channel, router]);

	return children;
}
