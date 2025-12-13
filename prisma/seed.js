const { PrismaClient } = require("@prisma/client");
const config = require("../lib/config");
const { seedPermissions } = require("./seeders/permissions");
const { seedRolePermissions } = require("./seeders/role-permissions");
const { seedUsers } = require("./seeders/users");
const { seedFarms } = require("./seeders/farms");
const { seedFields } = require("./seeders/fields");
const { seedCrops } = require("./seeders/crops");
const { seedPlantings } = require("./seeders/plantings");
const { seedProducts } = require("./seeders/products");
const { seedActivities } = require("./seeders/activities");

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Starting database seeding...\n");

    try {
        // Seed permissions first (required for role-permissions)
        const permissions = await seedPermissions();
        console.log("");

        const rolePermissionsResult = await seedRolePermissions(permissions);
        console.log("");

        // Seed in order of dependencies
        const users = await seedUsers();
        console.log("");

        const farms = await seedFarms();
        console.log("");

        const fields = await seedFields(farms[0].id);
        console.log("");

        const crops = await seedCrops();
        console.log("");

        const plantings = await seedPlantings(fields, crops, users);
        console.log("");

        const products = await seedProducts();
        console.log("");

        const activities = await seedActivities(fields, plantings, users);

        console.log("\n✅ Database seeding completed successfully!");
        console.log("\n📊 Summary:");
        console.log(`  - Permissions: ${permissions.length}`);
        console.log(`  - Role-Permission Mappings: ${rolePermissionsResult.createdCount + rolePermissionsResult.existingCount}`);
        console.log(`  - Users: ${users.length}`);
        console.log(`  - Farms: ${farms.length}`);
        console.log(`  - Fields: ${fields.length}`);
        console.log(`  - Crops: ${crops.length}`);
        console.log(`  - Plantings: ${plantings.length}`);
        console.log(`  - Products: ${products.length}`);
        console.log(`  - Activities: ${activities.length}`);
        console.log("\n🔑 Login credentials:");
        console.log("  Email: owner@farmmanager.com");
        console.log(`  Password: ${config.seed.defaultPassword}`);
        console.log("\n  (All users have the same password)\n");
    } catch (error) {
        console.error("\n❌ Error seeding database:");
        console.error(error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
