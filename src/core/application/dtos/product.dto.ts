// Product/Inventory DTOs
import { ProductCategory } from '@/core/domain/constants';

export interface CreateProductDto {
    name: string;
    category: ProductCategory;
    manufacturer?: string;
    unit: string;
    quantity?: number;
    reorderLevel?: number;
}

export interface UpdateProductDto {
    name?: string;
    manufacturer?: string;
    unit?: string;
    reorderLevel?: number;
}

export interface StockAdjustmentDto {
    amount: number;
}

export interface ProductResponseDto {
    id: string;
    name: string;
    category: ProductCategory;
    manufacturer?: string;
    unit: string;
    quantity: number;
    reorderLevel: number;
    isLowStock: boolean;
    createdAt: Date;
    updatedAt: Date;
}
