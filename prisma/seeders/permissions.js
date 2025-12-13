const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedPermissions() {
    console.log("🌱 Seeding permissions...");

    // Define all permissions with resource.action naming convention
    const permissions = [
        // Fields permissions
        { name: "fields.create", description: "Create new fields", resource: "fields", action: "create" },
        { name: "fields.read", description: "View fields", resource: "fields", action: "read" },
        { name: "fields.update", description: "Update field information", resource: "fields", action: "update" },
        { name: "fields.delete", description: "Delete fields", resource: "fields", action: "delete" },

        // Crops permissions
        { name: "crops.create", description: "Create new crops", resource: "crops", action: "create" },
        { name: "crops.read", description: "View crops", resource: "crops", action: "read" },
        { name: "crops.update", description: "Update crop information", resource: "crops", action: "update" },
        { name: "crops.delete", description: "Delete crops", resource: "crops", action: "delete" },

        // Plantings permissions
        { name: "plantings.create", description: "Create new plantings", resource: "plantings", action: "create" },
        { name: "plantings.read", description: "View plantings", resource: "plantings", action: "read" },
        { name: "plantings.update", description: "Update planting information", resource: "plantings", action: "update" },
        { name: "plantings.delete", description: "Delete plantings", resource: "plantings", action: "delete" },

        // Inventory permissions
        { name: "inventory.create", description: "Add inventory items", resource: "inventory", action: "create" },
        { name: "inventory.read", description: "View inventory", resource: "inventory", action: "read" },
        { name: "inventory.update", description: "Update inventory", resource: "inventory", action: "update" },
        { name: "inventory.delete", description: "Delete inventory items", resource: "inventory", action: "delete" },
        { name: "inventory.apply", description: "Apply inventory products", resource: "inventory", action: "apply" },

        // Activities permissions
        { name: "activities.create", description: "Log new activities", resource: "activities", action: "create" },
        { name: "activities.read", description: "View activities", resource: "activities", action: "read" },
        { name: "activities.update", description: "Update activity logs", resource: "activities", action: "update" },
        { name: "activities.delete", description: "Delete activity logs", resource: "activities", action: "delete" },

        // Users permissions
        { name: "users.create", description: "Create new users", resource: "users", action: "create" },
        { name: "users.read", description: "View users", resource: "users", action: "read" },
        { name: "users.update", description: "Update user information", resource: "users", action: "update" },
        { name: "users.delete", description: "Delete users", resource: "users", action: "delete" },
        { name: "users.manage_roles", description: "Manage user roles", resource: "users", action: "manage_roles" },

        // Reports permissions
        { name: "reports.view", description: "View reports", resource: "reports", action: "view" },
        { name: "reports.export", description: "Export reports", resource: "reports", action: "export" },
        { name: "reports.analytics", description: "View analytics", resource: "reports", action: "analytics" },

        // Settings permissions
        { name: "settings.view", description: "View settings", resource: "settings", action: "view" },
        { name: "settings.update", description: "Update settings", resource: "settings", action: "update" },
    ];

    const createdPermissions = [];
    for (const permission of permissions) {
        const existing = await prisma.permission.findUnique({
            where: { name: permission.name },
        });

        if (!existing) {
            const created = await prisma.permission.create({ data: permission });
            createdPermissions.push(created);
            console.log(`  ✓ Created permission: ${permission.name}`);
        } else {
            createdPermissions.push(existing);
            console.log(`  ⊙ Permission already exists: ${permission.name}`);
        }
    }

    return createdPermissions;
}

module.exports = { seedPermissions };
