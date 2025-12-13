const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedFarms() {
    console.log("🌱 Seeding farms...");

    const farms = [
        {
            name: "Green Valley Farm",
            location: "California, USA",
            totalArea: 150.5,
        },
    ];

    const createdFarms = [];
    for (const farm of farms) {
        const existing = await prisma.farm.findFirst({
            where: { name: farm.name },
        });

        if (!existing) {
            const created = await prisma.farm.create({ data: farm });
            createdFarms.push(created);
            console.log(`  ✓ Created farm: ${farm.name}`);
        } else {
            createdFarms.push(existing);
            console.log(`  ⊙ Farm already exists: ${farm.name}`);
        }
    }

    return createdFarms;
}

module.exports = { seedFarms };
