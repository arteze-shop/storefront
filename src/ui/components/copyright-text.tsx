import { getCopyrightText } from "@/config/brand";

const COPYRIGHT_TEXT = getCopyrightText();

export function CopyrightText() {
	return <>{COPYRIGHT_TEXT}</>;
}
