export * from './create-planting.use-case';
export * from './harvest-planting.use-case';

// Quick implementations for common operations
import { IPlantingRepository } from '@/core/application/ports/repositories';
import { PlantingResponseDto, UpdatePlantingDto } from '@/core/application/dtos';
import { Result } from '@/core/shared';
import { NotFoundError } from '@/core/domain/errors';
import { Planting } from '@/core/domain/entities';

export class GetPlantingsUseCase {
    constructor(private readonly plantingRepository: IPlantingRepository) { }

    async executeAll(): Promise<Result<PlantingResponseDto[], Error>> {
        try {
            const plantings = await this.plantingRepository.findAll();
            return Result.ok(plantings.map(this.toResponseDto));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async executeByFieldId(fieldId: string): Promise<Result<PlantingResponseDto[], Error>> {
        try {
            const plantings = await this.plantingRepository.findByFieldId(fieldId);
            return Result.ok(plantings.map(this.toResponseDto));
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

export class UpdatePlantingUseCase {
    constructor(private readonly plantingRepository: IPlantingRepository) { }

    async execute(id: string, dto: UpdatePlantingDto): Promise<Result<PlantingResponseDto, Error>> {
        try {
            const planting = await this.plantingRepository.findById(id);
            if (!planting) {
                return Result.fail(new NotFoundError('Planting', id));
            }

            let updatedPlanting = planting;

            if (dto.expectedHarvestDate) {
                updatedPlanting = updatedPlanting.updateExpectedHarvestDate(dto.expectedHarvestDate);
            }

            await this.plantingRepository.update(updatedPlanting);
            return Result.ok(this.toResponseDto(updatedPlanting));
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

export class DeletePlantingUseCase {
    constructor(private readonly plantingRepository: IPlantingRepository) { }

    async execute(id: string): Promise<Result<void, Error>> {
        try {
            const exists = await this.plantingRepository.exists(id);
            if (!exists) {
                return Result.fail(new NotFoundError('Planting', id));
            }

            await this.plantingRepository.delete(id);
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
