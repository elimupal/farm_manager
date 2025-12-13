/**
 * Route-to-Permission Mappings
 * Maps route patterns to required permissions
 */

export const routePermissions: Record<string, string[]> = {
    // Fields routes
    "/dashboard/fields": ["fields.read"],
    "/dashboard/fields/new": ["fields.create"],
    "/dashboard/fields/[id]": ["fields.read"],
    "/dashboard/fields/[id]/edit": ["fields.update"],

    // Crops routes
    "/dashboard/crops": ["crops.read"],
    "/dashboard/crops/new": ["crops.create"],
    "/dashboard/crops/[id]": ["crops.read"],
    "/dashboard/crops/[id]/edit": ["crops.update"],

    // Plantings routes
    "/dashboard/plantings": ["plantings.read"],
    "/dashboard/plantings/new": ["plantings.create"],
    "/dashboard/plantings/[id]": ["plantings.read"],
    "/dashboard/plantings/[id]/edit": ["plantings.update"],

    // Inventory routes
    "/dashboard/inventory": ["inventory.read"],
    "/dashboard/inventory/new": ["inventory.create"],
    "/dashboard/inventory/[id]": ["inventory.read"],
    "/dashboard/inventory/[id]/edit": ["inventory.update"],
    "/dashboard/inventory/apply": ["inventory.apply"],

    // Activities routes
    "/dashboard/activities": ["activities.read"],
    "/dashboard/activities/new": ["activities.create"],
    "/dashboard/activities/[id]": ["activities.read"],

    // Users routes
    "/dashboard/users": ["users.read"],
    "/dashboard/users/new": ["users.create"],
    "/dashboard/users/[id]": ["users.read"],
    "/dashboard/users/[id]/edit": ["users.update"],

    // Reports routes
    "/dashboard/reports": ["reports.view"],
    "/dashboard/reports/analytics": ["reports.analytics"],
    "/dashboard/reports/export": ["reports.export"],

    // Settings routes
    "/dashboard/settings": ["settings.view"],
};

/**
 * Get required permissions for a route
 * @param pathname - The route pathname
 * @returns Array of required permission names, or null if route is public
 */
export function getRoutePermissions(pathname: string): string[] | null {
    // Exact match
    if (routePermissions[pathname]) {
        return routePermissions[pathname];
    }

    // Pattern match (e.g., /dashboard/fields/123 matches /dashboard/fields/[id])
    for (const [pattern, permissions] of Object.entries(routePermissions)) {
        if (matchesPattern(pathname, pattern)) {
            return permissions;
        }
    }

    // Dashboard home and other routes default to basic read access
    if (pathname.startsWith("/dashboard")) {
        return []; // Authenticated users can access dashboard home
    }

    return null; // Public route
}

/**
 * Check if a pathname matches a route pattern
 * @param pathname - The actual pathname
 * @param pattern - The route pattern (e.g., /dashboard/fields/[id])
 * @returns boolean
 */
function matchesPattern(pathname: string, pattern: string): boolean {
    const patternParts = pattern.split("/");
    const pathParts = pathname.split("/");

    if (patternParts.length !== pathParts.length) {
        return false;
    }

    return patternParts.every((part, index) => {
        if (part.startsWith("[") && part.endsWith("]")) {
            return true; // Dynamic segment matches anything
        }
        return part === pathParts[index];
    });
}
