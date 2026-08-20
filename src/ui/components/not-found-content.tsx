import Link from "next/link";
import { Home } from "lucide-react";
import { buttonClassName } from "@/ui/components/ui/button";

/** Shared 404 UI for per-root-group `not-found.tsx` boundaries. */
export function NotFoundContent() {
	return (
		<div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-16">
			<div className="pattern-overlay-dark pointer-events-none absolute inset-0 opacity-5"></div>
			<div className="mx-auto max-w-md text-center">
				<h1 className="mb-4 font-fraunces text-8xl text-primary">404</h1>
				<h2 className="mb-4 font-fraunces text-3xl text-secondary-foreground">Page Not Found</h2>
				<p className="mb-8 font-light leading-relaxed text-secondary-foreground/70">
					It seems the page you&apos;re looking for has wandered off. Perhaps it&apos;s out sourcing new
					artisan goods.
				</p>

				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Link
						href="/"
						className={buttonClassName({
							asLink: true,
							className: "h-auto items-center rounded-full px-7 py-3.5 text-sm font-semibold",
						})}
					>
						<Home className="h-5 w-4" />
						Go Home
					</Link>

					{/* <Link href={"/products"} className={buttonClassName({ asLink: true, variant: "outline-solid" })}>
						<Search className="h-4 w-4" />
						Browse Products
					</Link> */}
				</div>
			</div>
		</div>
	);
}
