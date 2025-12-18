/**
 * Create Crop Use Case
 */

import { Crop } from '@/core/domain/entities';
import { ICropRepository } from '@/core/application/ports/repositories';
import { CreateCropDto, CropResponseDto } from '@/core/application/dtos';
import { Result } from '@/core/shared';

export class CreateCropUseCase {
    constructor(private readonly cropRepository: ICropRepository) { }

    async execute(dto: CreateCropDto): Promise<Result<CropResponseDto, Error>> {
        try {
            // Create entity (business validation happens here)
            const crop = Crop.create({
                id: crypto.randomUUID(),
                ...dto,
            });

            // Persist
            await this.cropRepository.save(crop);

            // Return DTO
            return Result.ok(this.toResponseDto(crop));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    private toResponseDto(crop: Crop): CropResponseDto {
        return {
            id: crop.id,
            name: crop.name,
            scientificName: crop.scientificName,
            category: crop.category,
            variety: crop.variety,
            growthCycleDays: crop.growthCycleDays,
            expectedYield: crop.expectedYield,
            createdAt: crop.createdAt,
            updatedAt: crop.updatedAt,
        };
    }
}
