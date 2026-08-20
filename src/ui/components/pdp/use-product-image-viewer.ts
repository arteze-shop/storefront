"use client";

import * as React from "react";

/** Local open/close state for the fullscreen product image viewer. */
export function useProductImageViewer(imagesKey: string) {
	const [viewerIndex, setViewerIndex] = React.useState<number | null>(null);
	const [lastImagesKey, setLastImagesKey] = React.useState(imagesKey);

	// Reset the viewer when the images change (e.g. variant switch). Adjusting
	// state during render is the React-blessed way to reset on prop change.
	if (lastImagesKey !== imagesKey) {
		setLastImagesKey(imagesKey);
		setViewerIndex(null);
	}

	return {
		viewerIndex,
		isViewerOpen: viewerIndex !== null,
		openViewer: setViewerIndex,
		onViewerOpenChange: (open: boolean) => {
			if (!open) setViewerIndex(null);
		},
	};
}
