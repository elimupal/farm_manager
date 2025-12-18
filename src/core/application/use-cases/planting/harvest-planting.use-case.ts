/**
 * Harvest Planting Use Case
 */

import { IPlantingRepository } from '@/core/application/ports/repositories';
import { HarvestPlantingDto, PlantingResponseDto } from '@/core/application/dtos';
import { Result } from '@/core/shared';
import { NotFoundError } from '@/core/domain/errors';
import { Planting } from '@/core/domain/entities';

export class HarvestPlantingUseCase {
    constructor(private readonly plantingRepository: IPlantingRepository) { }

    async execute(id: string, dto: HarvestPlantingDto): Promise<Result<PlantingResponseDto, Error>> {
        try {
            // Find planting
            const planting = await this.plantingRepository.findById(id);
            if (!planting) {
                return Result.fail(new NotFoundError('Planting', id));
            }

            // Harvest (business logic in entity)
            const harvestedPlanting = planting.harvest(dto.actualYield, dto.harvestDate);

            // Persist
            await this.plantingRepository.update(harvestedPlanting);

            // Return DTO
            return Result.ok(this.toResponseDto(harvestedPlanting));
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
