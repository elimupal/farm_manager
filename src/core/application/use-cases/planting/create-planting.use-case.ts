/**
 * Create Planting Use Case
 */

import { Planting } from '@/core/domain/entities';
import { IPlantingRepository, IFieldRepository, ICropRepository } from '@/core/application/ports/repositories';
import { CreatePlantingDto, PlantingResponseDto } from '@/core/application/dtos';
import { Result } from '@/core/shared';
import { NotFoundError } from '@/core/domain/errors';

export class CreatePlantingUseCase {
    constructor(
        private readonly plantingRepository: IPlantingRepository,
        private readonly fieldRepository: IFieldRepository,
        private readonly cropRepository: ICropRepository
    ) { }

    async execute(dto: CreatePlantingDto): Promise<Result<PlantingResponseDto, Error>> {
        try {
            // Validate field exists
            const fieldExists = await this.fieldRepository.exists(dto.fieldId);
            if (!fieldExists) {
                return Result.fail(new NotFoundError('Field', dto.fieldId));
            }

            // Validate crop exists
            const cropExists = await this.cropRepository.exists(dto.cropId);
            if (!cropExists) {
                return Result.fail(new NotFoundError('Crop', dto.cropId));
            }

            // Create entity
            const planting = Planting.create({
                id: crypto.randomUUID(),
                ...dto,
            });

            // Persist
            await this.plantingRepository.save(planting);

            // Return DTO
            return Result.ok(this.toResponseDto(planting));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    private toResponseDto(planting: Planting): PlantingResponseDto {
        return {
            id: planting.id,
            fieldId: planting.fieldId,
            cropId: planting.cropId,
            plantedDate: planting.plantedDate,
            expectedHarvestDate: planting.expectedHarvestDate,
            actualHarvestDate: planting.actualHarvestDate,
            status: planting.status,
            plantsCount: planting.plantsCount,
            expectedYield: planting.expectedYield,
            actualYield: planting.actualYield,
            notes: planting.notes,
            createdAt: planting.createdAt,
            updatedAt: planting.updatedAt,
        };
    }
}
