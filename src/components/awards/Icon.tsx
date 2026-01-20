/**
 * Icon Component (React)
 * React wrapper for FontAwesome icons, matching Icon.astro API
 *
 * Usage:
 * <Icon name="check" style="solid" className="h-5 w-5 text-green-500" />
 * <Icon name="calendar" style="regular" className="text-violet-400" />
 */

import { icon as faIcon } from "@fortawesome/fontawesome-svg-core";
// Import the centralized icon registry (registers icons with library)
import "@lib/icons";

interface IconProps {
    name: string;
    style?: "solid" | "regular" | "brands" | "light" | "thin";
    className?: string;
    title?: string;
}

// Map style to prefix
const prefixMap: Record<string, string> = {
    solid: "fas",
    regular: "far",
    brands: "fab",
    light: "fal",
    thin: "fat",
};

export default function Icon({ name, style = "solid", className = "", title }: IconProps) {
    const prefix = prefixMap[style] || "fas";

    // Find and render the icon
    const iconLookup = faIcon({ prefix: prefix as any, iconName: name as any });
    const svgHtml = iconLookup?.html?.[0];

    if (!svgHtml) {
        console.warn(`[Icon] Missing icon: ${prefix} ${name}`);
        return null;
    }

    // Remove FontAwesome's sizing classes and replace with our own
    // Add aria-hidden and role for accessibility
    const processedSvg = svgHtml
        .replace(/class="[^"]*"/, `class="${className}"`)
        .replace(
            "<svg ",
            `<svg aria-hidden="true" focusable="false" ${title ? `role="img" aria-label="${title}"` : ""} `
        );

    return (
        <span
            className="inline-flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: processedSvg }}
        />
    );
}
