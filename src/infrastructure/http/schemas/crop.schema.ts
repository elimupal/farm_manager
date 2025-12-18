/**
 * Crop Validation Schemas
 * Zod schemas for validating crop-related HTTP inputs
 */

import { z } from 'zod';
import { CropCategory, CROP_CONSTRAINTS } from '@/core/domain/constants';

/**
 * Schema for creating a new crop
 * Aligns with CreateCropDto
 */
export const createCropSchema = z.object({
    name: z.string()
        .min(CROP_CONSTRAINTS.NAME_MIN_LENGTH, `Name must be at least ${CROP_CONSTRAINTS.NAME_MIN_LENGTH} characters`)
        .max(CROP_CONSTRAINTS.NAME_MAX_LENGTH, `Name cannot exceed ${CROP_CONSTRAINTS.NAME_MAX_LENGTH} characters`),
    category: z.nativeEnum(CropCategory),
    variety: z.string().optional(),
    description: z.string().optional(),
    growthCycleDays: z.number()
        .int('Growth cycle must be a whole number')
        .min(CROP_CONSTRAINTS.GROWTH_CYCLE_MIN_DAYS, `Growth cycle must be at least ${CROP_CONSTRAINTS.GROWTH_CYCLE_MIN_DAYS} days`)
        .max(CROP_CONSTRAINTS.GROWTH_CYCLE_MAX_DAYS, `Growth cycle cannot exceed ${CROP_CONSTRAINTS.GROWTH_CYCLE_MAX_DAYS} days`)
        .optional(),
});

/**
 * Schema for updating an existing crop
 * Aligns with UpdateCropDto
 */
export const updateCropSchema = z.object({
    name: z.string()
        .min(CROP_CONSTRAINTS.NAME_MIN_LENGTH)
        .max(CROP_CONSTRAINTS.NAME_MAX_LENGTH)
        .optional(),
    category: z.nativeEnum(CropCategory).optional(),
    variety: z.string().optional(),
    description: z.string().optional(),
    growthCycleDays: z.number()
        .int()
        .min(CROP_CONSTRAINTS.GROWTH_CYCLE_MIN_DAYS)
        .max(CROP_CONSTRAINTS.GROWTH_CYCLE_MAX_DAYS)
        .optional(),
});

// Export inferred types
export type CreateCropFormData = z.infer<typeof createCropSchema>;
export type UpdateCropFormData = z.infer<typeof updateCropSchema>;
