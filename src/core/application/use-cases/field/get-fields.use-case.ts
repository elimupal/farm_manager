/**
 * Get Fields Use Case
 * Retrieve fields by farm ID
 */

import { IFieldRepository } from '@/core/application/ports/repositories';
import { FieldResponseDto } from '@/core/application/dtos';
import { Result } from '@/core/shared';

export class GetFieldsUseCase {
    constructor(private readonly fieldRepository: IFieldRepository) { }

    async executeByFarmId(farmId: string): Promise<Result<FieldResponseDto[], Error>> {
        try {
            const fields = await this.fieldRepository.findByFarmId(farmId);

            // Get plantings count for each field
            const fieldsWithCount = await Promise.all(
                fields.map(async (field) => {
                    const count = await this.fieldRepository.getPlantingsCount(field.id);
                    return this.toResponseDto(field, count);
                })
            );

            return Result.ok(fieldsWithCount);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async executeAll(): Promise<Result<FieldResponseDto[], Error>> {
        try {
            const fields = await this.fieldRepository.findAll();

            // Get plantings count for each field
            const fieldsWithCount = await Promise.all(
                fields.map(async (field) => {
                    const count = await this.fieldRepository.getPlantingsCount(field.id);
                    return this.toResponseDto(field, count);
                })
            );

            return Result.ok(fieldsWithCount);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    private toResponseDto(field: any, plantingsCount: number): FieldResponseDto {
        return {
            id: field.id,
            name: field.name,
            farmId: field.farmId,
            area: field.area.value,
            unit: field.area.unit,
            fieldType: field.fieldType,
            status: field.status,
            location: field.location?.toString(), // Serialize to string
            coordinates: field.coordinates?.toString(),
            soilType: field.soilType,
            irrigationSystem: field.irrigationSystem,
            createdAt: field.createdAt,
            updatedAt: field.updatedAt,
            _count: {
                plantings: plantingsCount,
            },
        };
    }
}
