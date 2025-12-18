/**
 * Field Validation Schemas
 * Zod schemas for validating field-related HTTP inputs
 */

import { z } from 'zod';
import { FieldType, FieldStatus, FIELD_CONSTRAINTS } from '@/core/domain/constants';

/**
 * Schema for creating a new field
 * Aligns with CreateFieldDto
 */
export const createFieldSchema = z.object({
    farmId: z.string().uuid('Invalid farm ID'),
    name: z.string()
        .min(FIELD_CONSTRAINTS.NAME_MIN_LENGTH, `Name must be at least ${FIELD_CONSTRAINTS.NAME_MIN_LENGTH} characters`)
        .max(FIELD_CONSTRAINTS.NAME_MAX_LENGTH, `Name cannot exceed ${FIELD_CONSTRAINTS.NAME_MAX_LENGTH} characters`),
    fieldType: z.nativeEnum(FieldType),
    area: z.number()
        .min(FIELD_CONSTRAINTS.AREA_MIN, `Area must be at least ${FIELD_CONSTRAINTS.AREA_MIN} hectares`)
        .max(FIELD_CONSTRAINTS.AREA_MAX, `Area cannot exceed ${FIELD_CONSTRAINTS.AREA_MAX} hectares`),
    status: z.nativeEnum(FieldStatus).optional(),
    location: z.string().optional(),
    soilType: z.string().optional(),
    irrigationType: z.string().optional(),
});

/**
 * Schema for updating an existing field
 * Aligns with UpdateFieldDto
 */
export const updateFieldSchema = z.object({
    name: z.string()
        .min(FIELD_CONSTRAINTS.NAME_MIN_LENGTH)
        .max(FIELD_CONSTRAINTS.NAME_MAX_LENGTH)
        .optional(),
    fieldType: z.nativeEnum(FieldType).optional(),
    area: z.number()
        .min(FIELD_CONSTRAINTS.AREA_MIN)
        .max(FIELD_CONSTRAINTS.AREA_MAX)
        .optional(),
    status: z.nativeEnum(FieldStatus).optional(),
    location: z.string().optional(),
    soilType: z.string().optional(),
    irrigationType: z.string().optional(),
});

// Export inferred types for use in forms
export type CreateFieldFormData = z.infer<typeof createFieldSchema>;
export type UpdateFieldFormData = z.infer<typeof updateFieldSchema>;
