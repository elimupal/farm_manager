/**
 * Update Field Use Case
 */

import { Field } from '@/core/domain/entities';
import { IFieldRepository, IFarmRepository } from '@/core/application/ports/repositories';
import { UpdateFieldDto, FieldResponseDto } from '@/core/application/dtos';
import { Result } from '@/core/shared';
import { NotFoundError, BusinessRuleViolationError } from '@/core/domain/errors';

export class UpdateFieldUseCase {
    constructor(
        private readonly fieldRepository: IFieldRepository,
        private readonly farmRepository: IFarmRepository
    ) { }

    async execute(id: string, dto: UpdateFieldDto): Promise<Result<FieldResponseDto, Error>> {
        try {
            // 1. Find existing field
            const field = await this.fieldRepository.findById(id);
            if (!field) {
                return Result.fail(new NotFoundError('Field', id));
            }

            // 2. If area is being updated, check farm capacity
            if (dto.area !== undefined && dto.area !== field.area.value) {
                const farm = await this.farmRepository.findById(field.farmId);
                if (!farm) {
                    return Result.fail(new NotFoundError('Farm', field.farmId));
                }

                const currentTotalArea = await this.fieldRepository.getTotalAreaByFarmId(field.farmId);
                const areaDifference = dto.area - field.area.value;

                if (areaDifference > 0) {
                    const newTotalArea = currentTotalArea + areaDifference;
                    if (newTotalArea > farm.totalArea) {
                        return Result.fail(
                            new BusinessRuleViolationError(
                                `Increasing area by ${areaDifference} hectares would exceed farm capacity`
                            )
                        );
                    }
                }
            }

            // 3. Apply updates
            let updatedField = field;

            if (dto.name) {
                updatedField = updatedField.updateName(dto.name);
            }

            if (dto.area !== undefined) {
                updatedField = updatedField.updateArea(dto.area);
            }

            if (dto.status) {
                updatedField = updatedField.changeStatus(dto.status);
            }

            // 4. Persist
            await this.fieldRepository.update(updatedField);

            // 5. Return DTO
            return Result.ok(this.toResponseDto(updatedField));
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
            unit: 'hectares',
            fieldType: field.fieldType,
            status: field.status,
            location: field.location?.toString(), // Serialize Coordinates to string
            coordinates: undefined,
            soilType: field.soilType,
            irrigationSystem: field.irrigationType,
            createdAt: field.createdAt,
            updatedAt: field.updatedAt,
            _count: {
                plantings: 0,
            },
        };
    }
}
