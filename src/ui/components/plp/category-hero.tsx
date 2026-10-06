import Image from "next/image";
import { PLP_HERO_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Breadcrumbs, type BreadcrumbItem } from "@/ui/components/breadcrumbs";
// import { WavePattern } from "./wave-pattern";

export type { BreadcrumbItem };

interface CategoryHeroProps {
	title: string;
	description?: string | null;
	backgroundImage?: string | null;
	breadcrumbs: BreadcrumbItem[];
	breadcrumbAriaLabel: string;
}

export function CategoryHero({
	title,
	description,
	backgroundImage,
	breadcrumbs,
	breadcrumbAriaLabel,
}: CategoryHeroProps) {
	const hasImage = !!backgroundImage;

	return (
		<section className="relative h-[340px] overflow-hidden border-b border-secondary-foreground/30 bg-secondary-foreground">
			{/* Background */}
			<div className="absolute inset-0">
				{hasImage ? (
					<>
						<Image
							src={backgroundImage}
							alt=""
							fill
							className="object-cover"
							sizes={PLP_HERO_IMAGE_SIZES}
							quality={PRODUCT_IMAGE_QUALITY}
							priority
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
					</>
				) : (
					<>
						<div className="pattern-overlay-light absolute inset-0 opacity-10" />
						<div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
						{/* <WavePattern className="h-full w-full" /> */}
					</>
				)}
			</div>

			{/* Content */}
			<div className="container-content relative flex h-full flex-col justify-end pb-10">
				<Breadcrumbs
					items={breadcrumbs}
					ariaLabel={breadcrumbAriaLabel}
					// surface={hasImage ? "pill" : "default"}
					surface={"default"}
					className="mb-4"
				/>

				<h1
					// className={cn("text-balance text-h1", hasImage ? "text-background" : "text-secondary-foreground")}
					className="text-balance text-h1 !font-light text-background"
				>
					{title}
				</h1>
				{description && (
					<p
						className={cn(
							"mt-5 max-w-lg text-pretty text-lead",
							// hasImage ? "text-background" : "text-secondary-foreground/80",
							"text-background",
						)}
					>
						{description}
					</p>
				)}
			</div>
		</section>
	);
}
