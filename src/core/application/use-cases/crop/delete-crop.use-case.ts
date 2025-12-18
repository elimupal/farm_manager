/**
 * Delete Crop Use Case
 */

import { ICropRepository } from '@/core/application/ports/repositories';
import { Result } from '@/core/shared';
import { NotFoundError } from '@/core/domain/errors';

export class DeleteCropUseCase {
    constructor(private readonly cropRepository: ICropRepository) { }

    async execute(id: string): Promise<Result<void, Error>> {
        try {
            // Check if crop exists
            const exists = await this.cropRepository.exists(id);
            if (!exists) {
                return Result.fail(new NotFoundError('Crop', id));
            }

            // Delete
            await this.cropRepository.delete(id);

            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
