import { prisma } from "@/lib/prisma";

// Define UserRole type from the enum values
type UserRole = "OWNER" | "MANAGER" | "SUPERVISOR" | "WORKER" | "AGRONOMIST";

/**
 * Check if a user role has a specific permission
 * @param role - The user's role
 * @param permissionName - The permission name (e.g., "fields.create")
 * @returns Promise<boolean>
 */
export async function hasPermission(
    role: UserRole,
    permissionName: string
): Promise<boolean> {
    const rolePermission = await prisma.rolePermission.findFirst({
        where: {
            role,
            permission: {
                name: permissionName,
            },
        },
    });

    return !!rolePermission;
}

/**
 * Get all permissions for a user role
 * @param role - The user's role
 * @returns Promise<string[]> - Array of permission names
 */
export async function getRolePermissions(
    role: UserRole
): Promise<string[]> {
    const rolePermissions = await prisma.rolePermission.findMany({
        where: { role },
        include: {
            permission: true,
        },
    });

    return rolePermissions.map((rp: { permission: { name: string } }) => rp.permission.name);
}

/**
 * Check if a user role has any of the specified permissions
 * @param role - The user's role
 * @param permissionNames - Array of permission names
 * @returns Promise<boolean>
 */
export async function hasAnyPermission(
    role: UserRole,
    permissionNames: string[]
): Promise<boolean> {
    const rolePermission = await prisma.rolePermission.findFirst({
        where: {
            role,
            permission: {
                name: {
                    in: permissionNames,
                },
            },
        },
    });

    return !!rolePermission;
}

/**
 * Check if a user role has all of the specified permissions
 * @param role - The user's role
 * @param permissionNames - Array of permission names
 * @returns Promise<boolean>
 */
export async function hasAllPermissions(
    role: UserRole,
    permissionNames: string[]
): Promise<boolean> {
    const rolePermissions = await prisma.rolePermission.findMany({
        where: {
            role,
            permission: {
                name: {
                    in: permissionNames,
                },
            },
        },
        include: {
            permission: true,
        },
    });

    const foundPermissions = rolePermissions.map((rp: { permission: { name: string } }) => rp.permission.name);
    return permissionNames.every((perm) => foundPermissions.includes(perm));
}

/**
 * Check if a user can perform an action on a resource
 * @param role - The user's role
 * @param resource - The resource (e.g., "fields", "users", "crops")
 * @param action - The action (e.g., "create", "read", "update", "delete")
 * @returns Promise<boolean>
 */
export async function canPerformAction(
    role: UserRole,
    resource: string,
    action: string
): Promise<boolean> {
    const permissionName = `${resource}.${action}`;
    return hasPermission(role, permissionName);
}

/**
 * Get all permissions grouped by resource
 * @param role - The user's role
 * @returns Promise<Record<string, string[]>> - Permissions grouped by resource
 */
export async function getPermissionsByResource(
    role: UserRole
): Promise<Record<string, string[]>> {
    const permissions = await getRolePermissions(role);

    const grouped: Record<string, string[]> = {};

    for (const permission of permissions) {
        const [resource, action] = permission.split(".");
        if (!grouped[resource]) {
            grouped[resource] = [];
        }
        grouped[resource].push(action);
    }

    return grouped;
}
