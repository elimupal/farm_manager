/**
 * Get Crops Use Case
 */

import { ICropRepository } from '@/core/application/ports/repositories';
import { CropResponseDto } from '@/core/application/dtos';
import { Result } from '@/core/shared';
import { Crop } from '@/core/domain/entities';

export class GetCropsUseCase {
    constructor(private readonly cropRepository: ICropRepository) { }

    async executeAll(): Promise<Result<CropResponseDto[], Error>> {
        try {
            const crops = await this.cropRepository.findAll();
            const dtos = crops.map(this.toResponseDto);
            return Result.ok(dtos);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async executeByCategory(category: string): Promise<Result<CropResponseDto[], Error>> {
        try {
            const crops = await this.cropRepository.findByCategory(category);
            const dtos = crops.map(this.toResponseDto);
            return Result.ok(dtos);
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
