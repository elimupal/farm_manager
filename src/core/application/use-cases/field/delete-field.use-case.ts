/**
 * Delete Field Use Case
 */

import { IFieldRepository } from '@/core/application/ports/repositories';
import { Result } from '@/core/shared';
import { NotFoundError, BusinessRuleViolationError } from '@/core/domain/errors';

export class DeleteFieldUseCase {
    constructor(private readonly fieldRepository: IFieldRepository) { }

    async execute(id: string): Promise<Result<void, Error>> {
        try {
            // 1. Find field
            const field = await this.fieldRepository.findById(id);
            if (!field) {
                return Result.fail(new NotFoundError('Field', id));
            }

            // 2. Check business rules
            if (!field.canBeDeleted()) {
                return Result.fail(
                    new BusinessRuleViolationError(
                        'Active fields cannot be deleted. Please set the field to fallow first.'
                    )
                );
            }

            // 3. Delete
            await this.fieldRepository.delete(id);

            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
