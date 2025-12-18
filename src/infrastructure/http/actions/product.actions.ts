'use server';

import { revalidatePath } from 'next/cache';
import { container } from '@/config/di-container';
import { CreateProductDto, UpdateProductDto, StockAdjustmentDto } from '@/core/application/dtos';

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function createProductAction(dto: CreateProductDto): Promise<ActionResponse<any>> {
    const useCase = container.createProductUseCase;
    const result = await useCase.execute(dto);
    if (result.isFailure) return { success: false, error: result.error.message };
    revalidatePath('/dashboard/inventory');
    return { success: true, data: result.value };
}

export async function getAllProductsAction(): Promise<ActionResponse<any[]>> {
    const useCase = container.getProductsUseCase;
    const result = await useCase.executeAll();
    if (result.isFailure) return { success: false, error: result.error.message };
    return { success: true, data: result.value };
}

export async function getLowStockProductsAction(): Promise<ActionResponse<any[]>> {
    const useCase = container.getProductsUseCase;
    const result = await useCase.executeLowStock();
    if (result.isFailure) return { success: false, error: result.error.message };
    return { success: true, data: result.value };
}

export async function updateProductAction(id: string, dto: UpdateProductDto): Promise<ActionResponse<any>> {
    const useCase = container.updateProductUseCase;
    const result = await useCase.execute(id, dto);
    if (result.isFailure) return { success: false, error: result.error.message };
    revalidatePath('/dashboard/inventory');
    return { success: true, data: result.value };
}

export async function addStockAction(id: string, dto: StockAdjustmentDto): Promise<ActionResponse<any>> {
    const useCase = container.adjustStockUseCase;
    const result = await useCase.addStock(id, dto);
    if (result.isFailure) return { success: false, error: result.error.message };
    revalidatePath('/dashboard/inventory');
    return { success: true, data: result.value };
}

export async function removeStockAction(id: string, dto: StockAdjustmentDto): Promise<ActionResponse<any>> {
    const useCase = container.adjustStockUseCase;
    const result = await useCase.removeStock(id, dto);
    if (result.isFailure) return { success: false, error: result.error.message };
    revalidatePath('/dashboard/inventory');
    return { success: true, data: result.value };
}

export async function deleteProductAction(id: string): Promise<ActionResponse<void>> {
    const useCase = container.deleteProductUseCase;
    const result = await useCase.execute(id);
    if (result.isFailure) return { success: false, error: result.error.message };
    revalidatePath('/dashboard/inventory');
    return { success: true };
}
