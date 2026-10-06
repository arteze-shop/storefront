import Link from "next/link";
import type { MenuItem } from "@/lib/menus/get-menu-data";
import { isExternalMenuHref } from "@/lib/menus/menu-item-utils";
import { isSafeNavHref } from "@/lib/url/safe-href";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { cn } from "@/lib/utils";

const defaultFooterLinks = {
	support: [
		{ label: "Contact Us", href: "/contact" },
		{ label: "FAQs", href: "/faq" },
		{ label: "Shipping", href: "/shipping" },
		{ label: "Returns", href: "/returns" },
	],
	company: [
		{ label: "About", href: "/about" },
		{ label: "Sustainability", href: "/sustainability" },
		{ label: "Careers", href: "/careers" },
		{ label: "Press", href: "/press" },
	],
};

interface FooterMenuLinksProps {
	locale?: string;
	channel?: string;
}

function ChannelLink({
	href,
	locale,
	channel,
	className,
	children,
}: FooterMenuLinksProps & { href: string; className?: string; children: React.ReactNode }) {
	if (!isSafeNavHref(href)) {
		return <span className={cn(className)}>{children}</span>;
	}
	if (isExternalMenuHref(href)) {
		return (
			<a href={href} rel="noopener noreferrer" className={className}>
				{children}
			</a>
		);
	}
	const fullHref = locale && channel ? buildStorefrontPath(locale, channel, href) : href;
	return (
		<Link href={fullHref} prefetch={false} className={className}>
			{children}
		</Link>
	);
}

function FooterMenuChildLink({ child, locale, channel }: FooterMenuLinksProps & { child: MenuItem }) {
	const linkClassName = "text-sm text-secondary/80 font-light transition-colors hover:text-secondary";
	if (child.category) {
		return (
			<ChannelLink
				href={`/categories/${child.category.slug}`}
				locale={locale}
				channel={channel}
				className={linkClassName}
			>
				{child.category.name}
			</ChannelLink>
		);
	}
	if (child.collection) {
		return (
			<ChannelLink
				href={`/collections/${child.collection.slug}`}
				locale={locale}
				channel={channel}
				className={linkClassName}
			>
				{child.collection.name}
			</ChannelLink>
		);
	}
	if (child.page) {
		return (
			<ChannelLink
				href={`/pages/${child.page.slug}`}
				locale={locale}
				channel={channel}
				className={linkClassName}
			>
				{child.page.title}
			</ChannelLink>
		);
	}
	if (child.url) {
		return (
			<ChannelLink href={child.url} locale={locale} channel={channel} className={linkClassName}>
				{child.name}
			</ChannelLink>
		);
	}
	return null;
}

export function FooterMenuColumns({ items, locale, channel }: FooterMenuLinksProps & { items: MenuItem[] }) {
	if (items.length === 0) {
		return (
			<>
				<div>
					<h4 className="mb-4 text-sm font-medium text-inverse">Support</h4>
					<ul className="space-y-3">
						{defaultFooterLinks.support.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									prefetch={false}
									className="text-sm text-inverse-subtle transition-colors hover:text-inverse"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h4 className="mb-4 text-sm font-medium text-inverse">Company</h4>
					<ul className="space-y-3">
						{defaultFooterLinks.company.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									prefetch={false}
									className="text-sm text-inverse-subtle transition-colors hover:text-inverse"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</>
		);
	}

	return (
		<>
			{items.map((item) => (
				<div key={item.id}>
					<h4 className="mb-4 font-fraunces text-xl font-medium text-secondary">{item.name}</h4>
					<ul className="space-y-2">
						{item.children?.map((child) => (
							<li key={child.id}>
								<FooterMenuChildLink child={child} locale={locale} channel={channel} />
							</li>
						))}
					</ul>
				</div>
			))}
		</>
	);
}
