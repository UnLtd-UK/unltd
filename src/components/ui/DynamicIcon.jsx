import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';
// Import the centralized icon registry (registers icons with library)
import '@lib/icons';

/**
 * Parses a FontAwesome class string and returns the icon definition
 * Supports formats like: "fa-solid fa-check", "fa-regular fa-calendar", "fa-brands fa-linkedin"
 */
function parseIconClass(iconClass) {
    if (!iconClass) return null;

    const classes = iconClass.split(' ').filter(c => c.startsWith('fa-'));

    let prefix = 'fas'; // default to solid
    let iconName = '';

    for (const cls of classes) {
        if (cls === 'fa-solid' || cls === 'fas') prefix = 'fas';
        else if (cls === 'fa-regular' || cls === 'far') prefix = 'far';
        else if (cls === 'fa-brands' || cls === 'fab') prefix = 'fab';
        else if (cls === 'fa-light' || cls === 'fal') prefix = 'fal';
        else if (cls.startsWith('fa-')) {
            // This is the icon name (e.g., fa-check -> check)
            iconName = cls.replace('fa-', '');
        }
    }

    if (!iconName) return null;

    return findIconDefinition({ prefix, iconName });
}

/**
 * Extracts non-FontAwesome classes for styling
 */
function extractStyleClasses(iconClass) {
    if (!iconClass) return '';
    return iconClass
        .split(' ')
        .filter(c => !c.startsWith('fa-') && !['fas', 'far', 'fab', 'fal'].includes(c))
        .join(' ');
}

/**
 * DynamicIcon component that renders FontAwesome icons from class strings
 * 
 * Usage:
 * <DynamicIcon icon="fa-solid fa-check" className="h-5 w-5 text-green-500" />
 * <DynamicIcon icon="fa-solid fa-check h-5 w-5 text-green-500" /> // classes embedded in icon string
 */
export default function DynamicIcon({ icon, className = '', ...props }) {
    const iconDef = parseIconClass(icon);
    const embeddedClasses = extractStyleClasses(icon);
    const combinedClasses = `${embeddedClasses} ${className}`.trim();

    if (!iconDef) {
        console.warn(`Icon not found: ${icon}`);
        return null;
    }

    return (
        <FontAwesomeIcon
            icon={iconDef}
            className={combinedClasses || undefined}
            {...props}
        />
    );
}
