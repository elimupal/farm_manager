import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hasAnyPermission } from "./permissions";
import { getRoutePermissions } from "./route-permissions";
import { UserRole } from "@/core/domain/constants";

/**
 * Server-side permission check for Server Components and Server Actions
 * Call this at the top of your Server Components to enforce permissions
 * 
 * @param requiredPermissions - Array of permission names required for access
 * @param redirectTo - Optional redirect path if permission check fails (default: /dashboard)
 * @throws Redirects to specified path if user doesn't have required permissions
 */
export async function requirePermissions(
    requiredPermissions: string[],
    redirectTo: string = "/dashboard"
): Promise<void> {
    const headersList = await headers();
    const userRole = headersList.get("x-user-role") as UserRole | null;

    if (!userRole) {
        redirect("/login");
    }

    if (requiredPermissions.length === 0) {
        return; // No specific permissions required
    }

    const hasPermission = await hasAnyPermission(userRole, requiredPermissions);

    if (!hasPermission) {
        redirect(redirectTo);
    }
}

/**
 * Check permissions for current route automatically
 * Call this in Server Components to enforce route-based permissions
 * 
 * @param pathname - The current pathname (from usePathname or similar)
 */
export async function requireRoutePermissions(pathname: string): Promise<void> {
    const requiredPermissions = getRoutePermissions(pathname);

    if (requiredPermissions === null) {
        return; // Public route
    }

    await requirePermissions(requiredPermissions);
}

/**
 * Get the current user's role from headers
 * Use this in Server Components to access the user's role
 * 
 * @returns UserRole | null
 */
export async function getUserRole(): Promise<UserRole | null> {
    const headersList = await headers();
    return headersList.get("x-user-role") as UserRole | null;
}

/**
 * Get the current user's ID from headers
 * Use this in Server Components to access the user's ID
 * 
 * @returns string | null
 */
export async function getUserId(): Promise<string | null> {
    const headersList = await headers();
    return headersList.get("x-user-id");
}

/**
 * Check if current user has a specific permission
 * Use this in Server Components for conditional rendering
 * 
 * @param permissionName - The permission to check
 * @returns Promise<boolean>
 */
export async function userHasPermission(permissionName: string): Promise<boolean> {
    const userRole = await getUserRole();

    if (!userRole) {
        return false;
    }

    const { hasPermission } = await import("./permissions");
    return hasPermission(userRole, permissionName);
}
