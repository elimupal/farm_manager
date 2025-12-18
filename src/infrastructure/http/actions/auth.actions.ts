'use server';

import { revalidatePath } from 'next/cache';
import { container } from '@/config/di-container';
import type { AuthenticateUserDto, RegisterUserDto } from '@/core/application/use-cases/auth';

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Login action - Authenticate user with email and password
 */
export async function loginAction(credentials: AuthenticateUserDto): Promise<ActionResponse<any>> {
    const useCase = container.authenticateUserUseCase;
    const result = await useCase.execute(credentials);

    if (result.isFailure) {
        return { success: false, error: result.error.message };
    }

    return { success: true, data: result.value };
}

/**
 * Register action - Create new user account
 */
export async function registerAction(data: RegisterUserDto): Promise<ActionResponse<any>> {
    const useCase = container.registerUserUseCase;
    const result = await useCase.execute(data);

    if (result.isFailure) {
        return { success: false, error: result.error.message };
    }

    revalidatePath('/dashboard/users');
    return { success: true, data: result.value };
}

/**
 * Logout action - Simple success response for client-side logout
 */
export async function logoutAction(): Promise<ActionResponse<void>> {
    return { success: true };
}
