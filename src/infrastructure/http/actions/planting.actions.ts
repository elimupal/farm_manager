/**
 * Planting Server Actions
 */

'use server';

import { revalidatePath } from 'next/cache';
import { container } from '@/config/di-container';
import { CreatePlantingDto, UpdatePlantingDto, HarvestPlantingDto } from '@/core/application/dtos';

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function createPlantingAction(dto: CreatePlantingDto): Promise<ActionResponse<any>> {
    const useCase = container.createPlantingUseCase;
    const result = await useCase.execute(dto);

    if (result.isFailure) {
        return { success: false, error: result.error.message };
    }

    revalidatePath('/dashboard/plantings');
    return { success: true, data: result.value };
}

export async function getAllPlantingsAction(): Promise<ActionResponse<any[]>> {
    const useCase = container.getPlantingsUseCase;
    const result = await useCase.executeAll();

    if (result.isFailure) {
        return { success: false, error: result.error.message };
    }

    return { success: true, data: result.value };
}

export async function getPlantingsByFieldAction(fieldId: string): Promise<ActionResponse<any[]>> {
    const useCase = container.getPlantingsUseCase;
    const result = await useCase.executeByFieldId(fieldId);

    if (result.isFailure) {
        return { success: false, error: result.error.message };
    }

    return { success: true, data: result.value };
}

export async function updatePlantingAction(id: string, dto: UpdatePlantingDto): Promise<ActionResponse<any>> {
    const useCase = container.updatePlantingUseCase;
    const result = await useCase.execute(id, dto);

    if (result.isFailure) {
        return { success: false, error: result.error.message };
    }

    revalidatePath('/dashboard/plantings');
    return { success: true, data: result.value };
}

export async function harvestPlantingAction(id: string, dto: HarvestPlantingDto): Promise<ActionResponse<any>> {
    const useCase = container.harvestPlantingUseCase;
    const result = await useCase.execute(id, dto);

    if (result.isFailure) {
        return { success: false, error: result.error.message };
    }

    revalidatePath('/dashboard/plantings');
    return { success: true, data: result.value };
}

export async function deletePlantingAction(id: string): Promise<ActionResponse<void>> {
    const useCase = container.deletePlantingUseCase;
    const result = await useCase.execute(id);

    if (result.isFailure) {
        return { success: false, error: result.error.message };
    }

    revalidatePath('/dashboard/plantings');
    return { success: true };
}
