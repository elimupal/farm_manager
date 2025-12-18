/**
 * Planting Validation Schemas
 * Zod schemas for validating planting-related HTTP inputs
 */

import { z } from 'zod';
import { PlantingStatus, PLANTING_CONSTRAINTS } from '@/core/domain/constants';

/**
 * Schema for creating a new planting
 * Aligns with CreatePlantingDto
 */
export const createPlantingSchema = z.object({
    fieldId: z.string().uuid('Invalid field ID'),
    cropId: z.string().uuid('Invalid crop ID'),
    plantingDate: z.coerce.date(),
    expectedHarvestDate: z.coerce.date().optional(),
    plantCount: z.number()
        .int('Plant count must be a whole number')
        .min(PLANTING_CONSTRAINTS.PLANTS_COUNT_MIN, `Plant count must be at least ${PLANTING_CONSTRAINTS.PLANTS_COUNT_MIN}`)
        .optional(),
    notes: z.string().optional(),
});

/**
 * Schema for updating an existing planting
 * Aligns with UpdatePlantingDto
 */
export const updatePlantingSchema = z.object({
    status: z.nativeEnum(PlantingStatus).optional(),
    plantCount: z.number()
        .int()
        .min(PLANTING_CONSTRAINTS.PLANTS_COUNT_MIN)
        .optional(),
    notes: z.string().optional(),
});

/**
 * Schema for harvesting a planting
 * Aligns with HarvestPlantingDto
 */
export const harvestPlantingSchema = z.object({
    harvestDate: z.coerce.date(),
    actualYield: z.number()
        .min(PLANTING_CONSTRAINTS.EXPECTED_YIELD_MIN, `Yield must be at least ${PLANTING_CONSTRAINTS.EXPECTED_YIELD_MIN}`)
        .optional(),
    notes: z.string().optional(),
});

// Export inferred types
export type CreatePlantingFormData = z.infer<typeof createPlantingSchema>;
export type UpdatePlantingFormData = z.infer<typeof updatePlantingSchema>;
export type HarvestPlantingFormData = z.infer<typeof harvestPlantingSchema>;
