const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedProducts() {
    console.log("🌱 Seeding inventory products...");

    const products = [
        {
            name: "Organic Fertilizer NPK 10-10-10",
            category: "FERTILIZER",
            unit: "kg",
            currentStock: 500,
            reorderLevel: 100,
            costPerUnit: 25.5,
        },
        {
            name: "Neem Oil Insecticide",
            category: "AGROCHEMICAL",
            unit: "liters",
            currentStock: 50,
            reorderLevel: 10,
            costPerUnit: 45.0,
        },
        {
            name: "Copper Fungicide",
            category: "AGROCHEMICAL",
            unit: "kg",
            currentStock: 30,
            reorderLevel: 5,
            costPerUnit: 60.0,
        },
        {
            name: "Tomato Seeds - Cherry",
            category: "SEED",
            unit: "packets",
            currentStock: 100,
            reorderLevel: 20,
            costPerUnit: 5.5,
        },
        {
            name: "Lettuce Seeds - Romaine",
            category: "SEED",
            unit: "packets",
            currentStock: 80,
            reorderLevel: 15,
            costPerUnit: 4.0,
        },
        {
            name: "Drip Irrigation Tape",
            category: "EQUIPMENT",
            unit: "meters",
            currentStock: 1000,
            reorderLevel: 200,
            costPerUnit: 0.5,
        },
        {
            name: "Garden Hose 50ft",
            category: "EQUIPMENT",
            unit: "pieces",
            currentStock: 10,
            reorderLevel: 2,
            costPerUnit: 35.0,
        },
        {
            name: "Compost",
            category: "FERTILIZER",
            unit: "cubic meters",
            currentStock: 15,
            reorderLevel: 3,
            costPerUnit: 40.0,
        },
    ];

    const createdProducts = [];
    for (const product of products) {
        const existing = await prisma.product.findFirst({
            where: { name: product.name },
        });

        if (!existing) {
            const created = await prisma.product.create({ data: product });
            createdProducts.push(created);
            console.log(`  ✓ Created product: ${product.name} (${product.category})`);
        } else {
            createdProducts.push(existing);
            console.log(`  ⊙ Product already exists: ${product.name}`);
        }
    }

    return createdProducts;
}

module.exports = { seedProducts };
