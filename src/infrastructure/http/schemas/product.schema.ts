/**
 * Product/Inventory Validation Schemas
 * Zod schemas for validating product-related HTTP inputs
 */

import { z } from 'zod';
import { ProductCategory } from '@/core/domain/constants';

// Product constraints - define here since not exported from domain
const PRODUCT_CONSTRAINTS = {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    QUANTITY_MIN: 0,
    REORDER_LEVEL_MIN: 0,
} as const;

/**
 * Schema for creating a new product
 * Aligns with CreateProductDto
 */
export const createProductSchema = z.object({
    name: z.string()
        .min(PRODUCT_CONSTRAINTS.NAME_MIN_LENGTH, `Name must be at least ${PRODUCT_CONSTRAINTS.NAME_MIN_LENGTH} characters`)
        .max(PRODUCT_CONSTRAINTS.NAME_MAX_LENGTH, `Name cannot exceed ${PRODUCT_CONSTRAINTS.NAME_MAX_LENGTH} characters`),
    category: z.nativeEnum(ProductCategory),
    manufacturer: z.string().optional(),
    unit: z.string().min(1, 'Unit is required'),
    quantity: z.number()
        .min(PRODUCT_CONSTRAINTS.QUANTITY_MIN, `Quantity must be at least ${PRODUCT_CONSTRAINTS.QUANTITY_MIN}`)
        .optional(),
    reorderLevel: z.number()
        .min(PRODUCT_CONSTRAINTS.REORDER_LEVEL_MIN, `Reorder level must be at least ${PRODUCT_CONSTRAINTS.REORDER_LEVEL_MIN}`)
        .optional(),
});

/**
 * Schema for updating an existing product
 * Aligns with UpdateProductDto
 */
export const updateProductSchema = z.object({
    name: z.string()
        .min(PRODUCT_CONSTRAINTS.NAME_MIN_LENGTH)
        .max(PRODUCT_CONSTRAINTS.NAME_MAX_LENGTH)
        .optional(),
    category: z.nativeEnum(ProductCategory).optional(),
    manufacturer: z.string().optional(),
    unit: z.string().optional(),
    reorderLevel: z.number()
        .min(PRODUCT_CONSTRAINTS.REORDER_LEVEL_MIN)
        .optional(),
});

/**
 * Schema for stock adjustment
 * Aligns with StockAdjustmentDto
 */
export const stockAdjustmentSchema = z.object({
    quantity: z.number()
        .min(0.01, 'Quantity must be greater than 0'),
    reason: z.string().optional(),
});

// Export inferred types
export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type StockAdjustmentFormData = z.infer<typeof stockAdjustmentSchema>;
