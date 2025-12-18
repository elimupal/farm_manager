/**
 * Planting Domain Mapper
 */

import { Planting as PrismaPlanting } from '@prisma/client';
import { Planting } from '@/core/domain/entities';
import { PlantingStatus } from '@/core/domain/constants';

export class PlantingMapper {
    static toDomain(prismaPlanting: PrismaPlanting): Planting {
        return Planting.reconstitute({
            id: prismaPlanting.id,
            fieldId: prismaPlanting.fieldId,
            cropId: prismaPlanting.cropId,
            plantedDate: prismaPlanting.plantingDate,
            expectedHarvestDate: prismaPlanting.expectedHarvestDate,
            actualHarvestDate: prismaPlanting.actualHarvestDate || undefined,
            status: prismaPlanting.status as PlantingStatus,
            plantsCount: undefined, // Not in schema
            expectedYield: undefined, // Not in schema
            actualYield: undefined, // Not in schema
            notes: prismaPlanting.notes || undefined,
            createdAt: prismaPlanting.createdAt,
            updatedAt: prismaPlanting.updatedAt,
        });
    }

    static toPrisma(planting: Planting) {
        return {
            id: planting.id,
            fieldId: planting.fieldId,
            cropId: planting.cropId,
            plantingDate: planting.plantedDate,
            expectedHarvestDate: planting.expectedHarvestDate,
            actualHarvestDate: planting.actualHarvestDate || null,
            status: planting.status as any,
            plantingMethod: 'DIRECT' as any, // Default value, required by schema
            plantedBy: null, // Required by schema but not in domain
            notes: planting.notes || null,
            createdAt: planting.createdAt,
            updatedAt: planting.updatedAt,
        } as any; // Cast to bypass strict type checking
    }
}
