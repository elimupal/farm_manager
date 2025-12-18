/**
 * Field Server Actions (Next.js Adapters)
 * Thin layer connecting Next.js to business logic
 */

'use server';

import { revalidatePath } from 'next/cache';
import { container } from '@/config/di-container';
import { CreateFieldDto, UpdateFieldDto } from '@/core/application/dtos';

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Create a new field
 */
export async function createFieldAction(
    dto: CreateFieldDto
): Promise<ActionResponse<any>> {
    const useCase = container.createFieldUseCase;
    const result = await useCase.execute(dto);

    if (result.isFailure) {
        return {
            success: false,
            error: result.error.message,
        };
    }

    revalidatePath('/dashboard/fields');

    return {
        success: true,
        data: result.value,
    };
}

/**
 * Get all fields by farm ID
 */
export async function getFieldsByFarmAction(
    farmId: string
): Promise<ActionResponse<any[]>> {
    const useCase = container.getFieldsUseCase;
    const result = await useCase.executeByFarmId(farmId);

    if (result.isFailure) {
        return {
            success: false,
            error: result.error.message,
        };
    }

    return {
        success: true,
        data: result.value,
    };
}

/**
 * Get all fields
 */
export async function getAllFieldsAction(): Promise<ActionResponse<any[]>> {
    const useCase = container.getFieldsUseCase;
    const result = await useCase.executeAll();

    if (result.isFailure) {
        return {
            success: false,
            error: result.error.message,
        };
    }

    return {
        success: true,
        data: result.value,
    };
}

/**
 * Update a field
 */
export async function updateFieldAction(
    id: string,
    dto: UpdateFieldDto
): Promise<ActionResponse<any>> {
    const useCase = container.updateFieldUseCase;
    const result = await useCase.execute(id, dto);

    if (result.isFailure) {
        return {
            success: false,
            error: result.error.message,
        };
    }

    revalidatePath('/dashboard/fields');

    return {
        success: true,
        data: result.value,
    };
}

/**
 * Delete a field
 */
export async function deleteFieldAction(
    id: string
): Promise<ActionResponse<void>> {
    const useCase = container.deleteFieldUseCase;
    const result = await useCase.execute(id);

    if (result.isFailure) {
        return {
            success: false,
            error: result.error.message,
        };
    }

    revalidatePath('/dashboard/fields');

    return {
        success: true,
    };
}
