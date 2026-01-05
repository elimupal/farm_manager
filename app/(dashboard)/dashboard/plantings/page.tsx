import type { Metadata } from 'next';
import { prisma } from "@/lib/prisma";
import { PlantingsList } from "@/components/plantings/plantings-list";

export const metadata: Metadata = {
    title: 'Crops & Plantings',
    description: 'Manage your crops and planting records',
};

async function getPlantingsData() {
    const [plantings, crops, fields] = await Promise.all([
        prisma.planting.findMany({
            include: {
                crop: true,
                field: true,
                plantedByUser: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                plantingDate: 'desc',
            },
        }),
        prisma.crop.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.field.findMany({
            where: {
                status: 'ACTIVE',
            },
            orderBy: {
                name: 'asc',
            },
        }),
    ]);

    return { plantings, crops, fields };
}

export default async function PlantingsPage() {
    const data = await getPlantingsData();

    return (
        <div className="space-y-6">
            <PlantingsList initialData={data} />
        </div>
    );
}
