/**
 * Create Field Use Case
 * Business logic for creating a new field
 */

import { Field } from '@/core/domain/entities';
import { IFieldRepository, IFarmRepository } from '@/core/application/ports/repositories';
import { CreateFieldDto, FieldResponseDto } from '@/core/application/dtos';
import { Result } from '@/core/shared';
import { BusinessRuleViolationError, NotFoundError } from '@/core/domain/errors';

export class CreateFieldUseCase {
    constructor(
        private readonly fieldRepository: IFieldRepository,
        private readonly farmRepository: IFarmRepository
    ) { }

    async execute(dto: CreateFieldDto): Promise<Result<FieldResponseDto, Error>> {
        try {
            // 1. Validate farm exists
            const farmExists = await this.farmRepository.exists(dto.farmId);
            if (!farmExists) {
                return Result.fail(new NotFoundError('Farm', dto.farmId));
            }

            // 2. Check farm capacity
            const farm = await this.farmRepository.findById(dto.farmId);
            if (!farm) {
                return Result.fail(new NotFoundError('Farm', dto.farmId));
            }

            const currentTotalArea = await this.fieldRepository.getTotalAreaByFarmId(dto.farmId);

            if (currentTotalArea + dto.area > farm.totalArea) {
                return Result.fail(
                    new BusinessRuleViolationError(
                        `Adding ${dto.area} hectares would exceed farm capacity of ${farm.totalArea} hectares. ` +
                        `Current total: ${currentTotalArea} hectares`
                    )
                );
            }

            // 3. Create entity (business validation happens here)
            const field = Field.create({
                id: crypto.randomUUID(),
                ...dto,
            });

            // 4. Persist
            await this.fieldRepository.save(field);

            // 5. Return DTO
            return Result.ok(this.toResponseDto(field));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    private toResponseDto(field: Field): FieldResponseDto {
        return {
            id: field.id,
            name: field.name,
            farmId: field.farmId,
            area: field.area.value,
            unit: 'hectares', // From area constraints
            fieldType: field.fieldType,
            status: field.status,
            location: field.location?.toString(), // Serialize Coordinates to string
            coordinates: undefined, // Field entity doesn't have coordinates property
            soilType: field.soilType,
            irrigationSystem: field.irrigationType, // Map irrigationType to irrigationSystem
            createdAt: field.createdAt,
            updatedAt: field.updatedAt,
            _count: {
                plantings: 0, // New field, no plantings yet
            },
        };
    }
}
