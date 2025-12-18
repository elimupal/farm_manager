/**
 * Crop Domain Mapper
 */

import { Crop as PrismaCrop } from '@prisma/client';
import { Crop } from '@/core/domain/entities';
import { CropCategory } from '@/core/domain/constants';

export class CropMapper {
    static toDomain(prismaCrop: PrismaCrop): Crop {
        return Crop.reconstitute({
            id: prismaCrop.id,
            name: prismaCrop.name,
            scientificName: prismaCrop.scientificName || undefined,
            category: prismaCrop.category as CropCategory,
            variety: prismaCrop.variety || undefined,
            growthCycleDays: prismaCrop.growthCycleDays,
            expectedYield: prismaCrop.expectedYield || undefined,
            createdAt: prismaCrop.createdAt,
            updatedAt: prismaCrop.updatedAt,
        });
    }

    static toPrisma(crop: Crop) {
        return {
            id: crop.id,
            name: crop.name,
            scientificName: crop.scientificName || null,
            category: crop.category,
            variety: crop.variety || null,
            growthCycleDays: crop.growthCycleDays,
            expectedYield: crop.expectedYield || null,
            createdAt: crop.createdAt,
            updatedAt: crop.updatedAt,
        };
    }
}
