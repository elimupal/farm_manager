const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedPlantings(fields, crops, users) {
    console.log("🌱 Seeding plantings...");

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const plantings = [
        {
            fieldId: fields[0]?.id,
            cropId: crops.find((c) => c.name.includes("Cherry"))?.id,
            plantingDate: sixtyDaysAgo,
            expectedHarvestDate: new Date(sixtyDaysAgo.getTime() + 65 * 24 * 60 * 60 * 1000),
            plantingMethod: "TRANSPLANTING",
            quantityPlanted: 500,
            plantedBy: users.find((u) => u.role === "WORKER")?.id,
            status: "GROWING",
        },
        {
            fieldId: fields[1]?.id,
            cropId: crops.find((c) => c.name.includes("Bell Pepper"))?.id,
            plantingDate: ninetyDaysAgo,
            expectedHarvestDate: new Date(ninetyDaysAgo.getTime() + 75 * 24 * 60 * 60 * 1000),
            plantingMethod: "TRANSPLANTING",
            quantityPlanted: 300,
            plantedBy: users.find((u) => u.role === "WORKER")?.id,
            status: "GROWING",
        },
        {
            fieldId: fields[2]?.id,
            cropId: crops.find((c) => c.name.includes("Cucumber"))?.id,
            plantingDate: thirtyDaysAgo,
            expectedHarvestDate: new Date(thirtyDaysAgo.getTime() + 60 * 24 * 60 * 60 * 1000),
            plantingMethod: "DIRECT_SEEDING",
            quantityPlanted: 1000,
            plantedBy: users.find((u) => u.role === "WORKER")?.id,
            status: "GROWING",
        },
        {
            fieldId: fields[4]?.id,
            cropId: crops.find((c) => c.name.includes("Lettuce"))?.id,
            plantingDate: thirtyDaysAgo,
            expectedHarvestDate: new Date(thirtyDaysAgo.getTime() + 55 * 24 * 60 * 60 * 1000),
            plantingMethod: "TRANSPLANTING",
            quantityPlanted: 800,
            plantedBy: users.find((u) => u.role === "WORKER")?.id,
            status: "GROWING",
        },
    ];

    const createdPlantings = [];
    for (const planting of plantings) {
        if (!planting.fieldId || !planting.cropId || !planting.plantedBy) continue;

        const existing = await prisma.planting.findFirst({
            where: {
                fieldId: planting.fieldId,
                cropId: planting.cropId,
                plantingDate: planting.plantingDate,
            },
        });

        if (!existing) {
            const created = await prisma.planting.create({ data: planting });
            createdPlantings.push(created);
            console.log(`  ✓ Created planting in field ${planting.fieldId}`);
        } else {
            createdPlantings.push(existing);
            console.log(`  ⊙ Planting already exists`);
        }
    }

    return createdPlantings;
}

module.exports = { seedPlantings };
