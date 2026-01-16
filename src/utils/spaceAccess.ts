/**
 * Space Access Utility
 * Priority-based access control for spaces and resources
 * 
 * Priority levels (higher = more permissive):
 * 4: Public + Listed    (unlisted: false, password: empty)
 * 3: Public + Unlisted  (unlisted: true,  password: empty)
 * 2: Restricted + Listed   (unlisted: false, password: set)
 * 1: Restricted + Unlisted (unlisted: true,  password: set)
 * 
 * When a resource belongs to multiple spaces, it adopts the 
 * settings of the space with the highest priority.
 */

export interface SpaceAccess {
    unlisted: boolean;
    restricted_password?: string;
}

export interface SpaceAccessResult {
    priority: number;
    isPublic: boolean;
    isListed: boolean;
    isRestricted: boolean;
}

/**
 * Get the priority level for a space based on its access settings
 * @param space - Space object with unlisted and restricted_password fields
 * @returns Priority number 1-4 (higher = more permissive)
 */
export function getSpacePriority(space: SpaceAccess): number {
    const hasPassword = !!space.restricted_password && space.restricted_password.trim().length > 0;
    const isUnlisted = !!space.unlisted;

    if (!hasPassword && !isUnlisted) return 4; // Public + Listed
    if (!hasPassword && isUnlisted) return 3;  // Public + Unlisted
    if (hasPassword && !isUnlisted) return 2;  // Restricted + Listed
    return 1;                                   // Restricted + Unlisted
}

/**
 * Analyze a space's access level and return detailed access info
 * @param space - Space object with access settings
 * @returns Access result with priority and boolean flags
 */
export function getSpaceAccessInfo(space: SpaceAccess): SpaceAccessResult {
    const priority = getSpacePriority(space);
    const hasPassword = !!space.restricted_password && space.restricted_password.trim().length > 0;

    return {
        priority,
        isPublic: !hasPassword,
        isListed: !space.unlisted,
        isRestricted: hasPassword,
    };
}

/**
 * Determine effective access for a resource that belongs to multiple spaces
 * Returns the most permissive (highest priority) access level
 * @param spaces - Array of spaces the resource belongs to
 * @returns Effective access result based on highest priority space
 */
export function getEffectiveAccess(spaces: SpaceAccess[]): SpaceAccessResult {
    if (spaces.length === 0) {
        // No spaces = default to public listed (should not happen in practice)
        return {
            priority: 4,
            isPublic: true,
            isListed: true,
            isRestricted: false,
        };
    }

    // Find the space with the highest priority
    let highestPriority = 0;
    let highestPrioritySpace = spaces[0];

    for (const space of spaces) {
        const priority = getSpacePriority(space);
        if (priority > highestPriority) {
            highestPriority = priority;
            highestPrioritySpace = space;
        }
    }

    return getSpaceAccessInfo(highestPrioritySpace);
}

/**
 * Check if a space is restricted (has a password set)
 * @param space - Space object
 * @returns true if the space requires password authentication
 */
export function isSpaceRestricted(space: SpaceAccess): boolean {
    return !!space.restricted_password && space.restricted_password.trim().length > 0;
}

/**
 * Get all restricted spaces from an array of spaces
 * Useful for password prompts that accept any valid password
 * @param spaces - Array of spaces
 * @returns Array of spaces that have passwords set
 */
export function getRestrictedSpaces<T extends SpaceAccess>(spaces: T[]): T[] {
    return spaces.filter(space => isSpaceRestricted(space));
}
