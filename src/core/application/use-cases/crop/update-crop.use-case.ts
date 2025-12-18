/**
 * Update Crop Use Case
 */

import { Crop } from '@/core/domain/entities';
import { ICropRepository } from '@/core/application/ports/repositories';
import { UpdateCropDto, CropResponseDto } from '@/core/application/dtos';
import { Result } from '@/core/shared';
import { NotFoundError } from '@/core/domain/errors';

export class UpdateCropUseCase {
    constructor(private readonly cropRepository: ICropRepository) { }

    async execute(id: string, dto: UpdateCropDto): Promise<Result<CropResponseDto, Error>> {
        try {
            // Find existing crop
            const crop = await this.cropRepository.findById(id);
            if (!crop) {
                return Result.fail(new NotFoundError('Crop', id));
            }

            // Apply updates
            let updatedCrop = crop;

            if (dto.name) {
                updatedCrop = updatedCrop.updateName(dto.name);
            }

            if (dto.growthCycleDays !== undefined) {
                updatedCrop = updatedCrop.updateGrowthCycle(dto.growthCycleDays);
            }

            if (dto.expectedYield !== undefined) {
                updatedCrop = updatedCrop.updateExpectedYield(dto.expectedYield);
            }

            // Persist
            await this.cropRepository.update(updatedCrop);

            // Return DTO
            return Result.ok(this.toResponseDto(updatedCrop));
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
