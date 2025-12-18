'use server';

import { revalidatePath } from 'next/cache';
import { container } from '@/config/di-container';
import { CreateUserDto, UpdateUserDto } from '@/core/application/dtos';

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function createUserAction(dto: CreateUserDto): Promise<ActionResponse<any>> {
    const useCase = container.createUserUseCase;
    const result = await useCase.execute(dto);
    if (result.isFailure) return { success: false, error: result.error.message };
    revalidatePath('/dashboard/users');
    return { success: true, data: result.value };
}

export async function getAllUsersAction(): Promise<ActionResponse<any[]>> {
    const useCase = container.getUsersUseCase;
    const result = await useCase.executeAll();
    if (result.isFailure) return { success: false, error: result.error.message };
    return { success: true, data: result.value };
}

export async function getUserByIdAction(id: string): Promise<ActionResponse<any>> {
    const useCase = container.getUsersUseCase;
    const result = await useCase.executeById(id);
    if (result.isFailure) return { success: false, error: result.error.message };
    return { success: true, data: result.value };
}

export async function updateUserAction(id: string, dto: UpdateUserDto): Promise<ActionResponse<any>> {
    const useCase = container.updateUserUseCase;
    const result = await useCase.execute(id, dto);
    if (result.isFailure) return { success: false, error: result.error.message };
    revalidatePath('/dashboard/users');
    return { success: true, data: result.value };
}

export async function deactivateUserAction(id: string): Promise<ActionResponse<any>> {
    const useCase = container.deactivateUserUseCase;
    const result = await useCase.execute(id);
    if (result.isFailure) return { success: false, error: result.error.message };
    revalidatePath('/dashboard/users');
    return { success: true, data: result.value };
}

export async function deleteUserAction(id: string): Promise<ActionResponse<void>> {
    const useCase = container.deleteUserUseCase;
    const result = await useCase.execute(id);
    if (result.isFailure) return { success: false, error: result.error.message };
    revalidatePath('/dashboard/users');
    return { success: true };
}
