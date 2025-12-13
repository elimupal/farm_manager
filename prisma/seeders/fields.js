const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedFields(farmId) {
    console.log("🌱 Seeding fields...");

    const fields = [
        {
            farmId,
            name: "North Greenhouse A",
            fieldType: "GREENHOUSE",
            area: 2.5,
            location: "40.7128° N, 74.0060° W",
            soilType: "Controlled substrate",
            irrigationType: "Drip irrigation",
            status: "ACTIVE",
        },
        {
            farmId,
            name: "South Screenhouse",
            fieldType: "SCREENHOUSE",
            area: 3.0,
            location: "40.7130° N, 74.0062° W",
            soilType: "Sandy loam",
            irrigationType: "Overhead sprinklers",
            status: "ACTIVE",
        },
        {
            farmId,
            name: "East Open Field",
            fieldType: "OPEN_FIELD",
            area: 25.0,
            location: "40.7125° N, 74.0055° W",
            soilType: "Clay loam",
            irrigationType: "Center pivot",
            status: "ACTIVE",
        },
        {
            farmId,
            name: "West Nursery",
            fieldType: "NURSERY",
            area: 1.5,
            location: "40.7132° N, 74.0058° W",
            soilType: "Potting mix",
            irrigationType: "Misting system",
            status: "ACTIVE",
        },
        {
            farmId,
            name: "Central Hydroponics Unit",
            fieldType: "HYDROPONICS",
            area: 0.8,
            location: "40.7129° N, 74.0059° W",
            soilType: "Hydroponic solution",
            irrigationType: "NFT system",
            status: "ACTIVE",
        },
        {
            farmId,
            name: "Fallow Field 1",
            fieldType: "OPEN_FIELD",
            area: 15.0,
            location: "40.7127° N, 74.0057° W",
            soilType: "Loamy",
            irrigationType: "None",
            status: "FALLOW",
        },
    ];

    const createdFields = [];
    for (const field of fields) {
        const existing = await prisma.field.findFirst({
            where: { name: field.name, farmId },
        });

        if (!existing) {
            const created = await prisma.field.create({ data: field });
            createdFields.push(created);
            console.log(`  ✓ Created field: ${field.name} (${field.fieldType})`);
        } else {
            createdFields.push(existing);
            console.log(`  ⊙ Field already exists: ${field.name}`);
        }
    }

    return createdFields;
}

module.exports = { seedFields };
