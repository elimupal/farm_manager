const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedCrops() {
    console.log("🌱 Seeding crops...");

    const crops = [
        {
            name: "Tomato - Cherry",
            scientificName: "Solanum lycopersicum var. cerasiforme",
            category: "VEGETABLES",
            variety: "Sweet 100",
            growthCycleDays: 65,
        },
        {
            name: "Tomato - Beefsteak",
            scientificName: "Solanum lycopersicum",
            category: "VEGETABLES",
            variety: "Big Beef",
            growthCycleDays: 80,
        },
        {
            name: "Lettuce - Romaine",
            scientificName: "Lactuca sativa",
            category: "VEGETABLES",
            variety: "Parris Island Cos",
            growthCycleDays: 55,
        },
        {
            name: "Bell Pepper",
            scientificName: "Capsicum annuum",
            category: "VEGETABLES",
            variety: "California Wonder",
            growthCycleDays: 75,
        },
        {
            name: "Cucumber",
            scientificName: "Cucumis sativus",
            category: "VEGETABLES",
            variety: "Marketmore 76",
            growthCycleDays: 60,
        },
        {
            name: "Strawberry",
            scientificName: "Fragaria × ananassa",
            category: "FRUITS",
            variety: "Albion",
            growthCycleDays: 90,
        },
        {
            name: "Basil",
            scientificName: "Ocimum basilicum",
            category: "HERBS",
            variety: "Genovese",
            growthCycleDays: 45,
        },
        {
            name: "Marigold",
            scientificName: "Tagetes erecta",
            category: "FLOWERS",
            variety: "African Tall",
            growthCycleDays: 50,
        },
    ];

    const createdCrops = [];
    for (const crop of crops) {
        const existing = await prisma.crop.findFirst({
            where: { name: crop.name },
        });

        if (!existing) {
            const created = await prisma.crop.create({ data: crop });
            createdCrops.push(created);
            console.log(`  ✓ Created crop: ${crop.name} (${crop.category})`);
        } else {
            createdCrops.push(existing);
            console.log(`  ⊙ Crop already exists: ${crop.name}`);
        }
    }

    return createdCrops;
}

module.exports = { seedCrops };
