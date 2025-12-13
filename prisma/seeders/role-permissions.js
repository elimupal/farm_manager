const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedRolePermissions(permissions) {
    console.log("🌱 Seeding role-permission mappings...");

    // Define role-permission mappings
    const rolePermissionMappings = {
        OWNER: [
            // Full access to everything
            "fields.create", "fields.read", "fields.update", "fields.delete",
            "crops.create", "crops.read", "crops.update", "crops.delete",
            "plantings.create", "plantings.read", "plantings.update", "plantings.delete",
            "inventory.create", "inventory.read", "inventory.update", "inventory.delete", "inventory.apply",
            "activities.create", "activities.read", "activities.update", "activities.delete",
            "users.create", "users.read", "users.update", "users.delete", "users.manage_roles",
            "reports.view", "reports.export", "reports.analytics",
            "settings.view", "settings.update",
        ],
        MANAGER: [
            // Most permissions except user management and settings
            "fields.create", "fields.read", "fields.update", "fields.delete",
            "crops.create", "crops.read", "crops.update", "crops.delete",
            "plantings.create", "plantings.read", "plantings.update", "plantings.delete",
            "inventory.create", "inventory.read", "inventory.update", "inventory.delete", "inventory.apply",
            "activities.create", "activities.read", "activities.update", "activities.delete",
            "users.read",
            "reports.view", "reports.export", "reports.analytics",
            "settings.view",
        ],
        SUPERVISOR: [
            // Can manage fields, plantings, and activities
            "fields.read", "fields.update",
            "crops.read",
            "plantings.create", "plantings.read", "plantings.update",
            "inventory.read", "inventory.apply",
            "activities.create", "activities.read", "activities.update",
            "users.read",
            "reports.view",
        ],
        WORKER: [
            // Basic read access and can log activities
            "fields.read",
            "crops.read",
            "plantings.read",
            "inventory.read",
            "activities.create", "activities.read",
            "reports.view",
        ],
        AGRONOMIST: [
            // Specialized access for crop and planting management
            "fields.read",
            "crops.create", "crops.read", "crops.update",
            "plantings.create", "plantings.read", "plantings.update",
            "inventory.read", "inventory.apply",
            "activities.create", "activities.read", "activities.update",
            "reports.view", "reports.analytics",
        ],
    };

    let createdCount = 0;
    let existingCount = 0;

    for (const [role, permissionNames] of Object.entries(rolePermissionMappings)) {
        for (const permissionName of permissionNames) {
            const permission = permissions.find((p) => p.name === permissionName);
            if (!permission) {
                console.log(`  ⚠ Permission not found: ${permissionName}`);
                continue;
            }

            const existing = await prisma.rolePermission.findUnique({
                where: {
                    role_permissionId: {
                        role,
                        permissionId: permission.id,
                    },
                },
            });

            if (!existing) {
                await prisma.rolePermission.create({
                    data: {
                        role,
                        permissionId: permission.id,
                    },
                });
                createdCount++;
            } else {
                existingCount++;
            }
        }
    }

    console.log(`  ✓ Created ${createdCount} role-permission mappings`);
    console.log(`  ⊙ ${existingCount} mappings already existed`);

    return { createdCount, existingCount };
}

module.exports = { seedRolePermissions };
