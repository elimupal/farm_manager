const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const config = require("../../lib/config");

const prisma = new PrismaClient();

async function seedUsers() {
    console.log("🌱 Seeding users...");

    const defaultPassword = await bcrypt.hash(config.seed.defaultPassword, 10);

    const users = [
        {
            email: "owner@farmmanager.com",
            password: defaultPassword,
            firstName: "John",
            lastName: "Farmer",
            phone: "+1234567890",
            role: "OWNER",
        },
        {
            email: "manager@farmmanager.com",
            password: defaultPassword,
            firstName: "Sarah",
            lastName: "Johnson",
            phone: "+1234567891",
            role: "MANAGER",
        },
        {
            email: "supervisor@farmmanager.com",
            password: defaultPassword,
            firstName: "Mike",
            lastName: "Williams",
            phone: "+1234567892",
            role: "SUPERVISOR",
        },
        {
            email: "worker@farmmanager.com",
            password: defaultPassword,
            firstName: "David",
            lastName: "Martinez",
            phone: "+1234567893",
            role: "WORKER",
        },
        {
            email: "agronomist@farmmanager.com",
            password: defaultPassword,
            firstName: "Emily",
            lastName: "Chen",
            phone: "+1234567894",
            role: "AGRONOMIST",
        },
    ];

    const createdUsers = [];
    for (const user of users) {
        const existing = await prisma.user.findUnique({
            where: { email: user.email },
        });

        if (!existing) {
            const created = await prisma.user.create({ data: user });
            createdUsers.push(created);
            console.log(`  ✓ Created user: ${user.email} (${user.role})`);
        } else {
            createdUsers.push(existing);
            console.log(`  ⊙ User already exists: ${user.email}`);
        }
    }

    return createdUsers;
}

module.exports = { seedUsers };
