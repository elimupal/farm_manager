const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedActivities(fields, plantings, users) {
    console.log("🌱 Seeding activities...");

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const activities = [
        {
            fieldId: fields[0]?.id,
            plantingId: plantings[0]?.id,
            performedBy: users.find((u) => u.role === "WORKER")?.id,
            type: "IRRIGATION",
            description: "Drip irrigation system activated for 2 hours",
            activityDate: oneDayAgo,
            duration: 120,
            notes: "Water pressure normal, all emitters functioning",
        },
        {
            fieldId: fields[1]?.id,
            plantingId: plantings[1]?.id,
            performedBy: users.find((u) => u.role === "AGRONOMIST")?.id,
            type: "FERTILIZATION",
            description: "Applied organic fertilizer NPK 10-10-10",
            activityDate: threeDaysAgo,
            duration: 60,
            notes: "Applied 50kg total, evenly distributed",
        },
        {
            fieldId: fields[2]?.id,
            plantingId: plantings[2]?.id,
            performedBy: users.find((u) => u.role === "WORKER")?.id,
            type: "WEEDING",
            description: "Manual weeding of cucumber rows",
            activityDate: fiveDaysAgo,
            duration: 180,
            notes: "Removed broadleaf weeds, minimal grass",
        },
        {
            fieldId: fields[0]?.id,
            plantingId: plantings[0]?.id,
            performedBy: users.find((u) => u.role === "SUPERVISOR")?.id,
            type: "PEST_CONTROL",
            description: "Applied neem oil spray for aphid control",
            activityDate: sevenDaysAgo,
            duration: 45,
            notes: "Light aphid pressure observed, preventive treatment",
        },
        {
            fieldId: fields[1]?.id,
            plantingId: plantings[1]?.id,
            performedBy: users.find((u) => u.role === "WORKER")?.id,
            type: "PRUNING",
            description: "Pruned lower leaves and suckers from pepper plants",
            activityDate: fiveDaysAgo,
            duration: 90,
            notes: "Improved air circulation, removed diseased leaves",
        },
    ];

    const createdActivities = [];
    for (const activity of activities) {
        if (!activity.fieldId || !activity.performedBy) continue;

        const existing = await prisma.activity.findFirst({
            where: {
                fieldId: activity.fieldId,
                type: activity.type,
                activityDate: activity.date,
            },
        });

        if (!existing) {
            const created = await prisma.activity.create({ data: activity });
            createdActivities.push(created);
            console.log(`  ✓ Created activity: ${activity.type}`);
        } else {
            createdActivities.push(existing);
            console.log(`  ⊙ Activity already exists`);
        }
    }

    return createdActivities;
}

module.exports = { seedActivities };
