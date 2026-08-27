"use client";

import { useRef, useEffect, memo } from "react";

interface TurnstileWidgetProps {
	onToken?: (token: string) => void;
	action?: string;
}

function TurnstileWidgetInner({ onToken, action }: TurnstileWidgetProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let intervalId: ReturnType<typeof setInterval> | null = null;
		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		const tryRender = () => {
			const w = window as any;
			if (w.turnstile && containerRef.current) {
				try {
					w.turnstile.render(containerRef.current, {
						sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
						callback: (token: string) => {
							if (onToken) onToken(token);
						},
						action,
					});
					if (intervalId) {
						clearInterval(intervalId);
						intervalId = null;
					}
				} catch {
					// Turnstile not fully ready; retry on next interval.
				}
			}
		};

		intervalId = setInterval(tryRender, 300);
		tryRender();

		timeoutId = setTimeout(() => {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			}
		}, 5000);

		return () => {
			if (intervalId) clearInterval(intervalId);
			if (timeoutId) clearTimeout(timeoutId);
			try {
				(window as any).turnstile.remove();
			} catch {
				// Ignore if turnstile hasn't loaded yet.
			}
		};
	}, []);

	return <div ref={containerRef} />;
}

export const TurnstileWidget = memo(TurnstileWidgetInner);
