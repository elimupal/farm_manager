/**
 * Crop Server Actions (Next.js Adapters)
 */

'use server';

import { revalidatePath } from 'next/cache';
import { container } from '@/config/di-container';
import { CreateCropDto, UpdateCropDto } from '@/core/application/dtos';

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Create a new crop
 */
export async function createCropAction(
    dto: CreateCropDto
): Promise<ActionResponse<any>> {
    const useCase = container.createCropUseCase;
    const result = await useCase.execute(dto);

    if (result.isFailure) {
        return {
            success: false,
            error: result.error.message,
        };
    }

    revalidatePath('/dashboard/crops');

    return {
        success: true,
        data: result.value,
    };
}

/**
 * Get all crops
 */
export async function getAllCropsAction(): Promise<ActionResponse<any[]>> {
    const useCase = container.getCropsUseCase;
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
 * Get crops by category
 */
export async function getCropsByCategoryAction(
    category: string
): Promise<ActionResponse<any[]>> {
    const useCase = container.getCropsUseCase;
    const result = await useCase.executeByCategory(category);

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
 * Update a crop
 */
export async function updateCropAction(
    id: string,
    dto: UpdateCropDto
): Promise<ActionResponse<any>> {
    const useCase = container.updateCropUseCase;
    const result = await useCase.execute(id, dto);

    if (result.isFailure) {
        return {
            success: false,
            error: result.error.message,
        };
    }

    revalidatePath('/dashboard/crops');

    return {
        success: true,
        data: result.value,
    };
}

/**
 * Delete a crop
 */
export async function deleteCropAction(
    id: string
): Promise<ActionResponse<void>> {
    const useCase = container.deleteCropUseCase;
    const result = await useCase.execute(id);

    if (result.isFailure) {
        return {
            success: false,
            error: result.error.message,
        };
    }

    revalidatePath('/dashboard/crops');

    return {
        success: true,
    };
}
