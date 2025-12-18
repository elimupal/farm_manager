/**
 * Field Repository Interface (Port)
 * Defines contract for field persistence without implementation details
 */

import { Field } from '@/core/domain/entities';

export interface IFieldRepository {
    /**
     * Find field by ID
     */
    findById(id: string): Promise<Field | null>;

    /**
     * Find all fields by farm ID
     */
    findByFarmId(farmId: string): Promise<Field[]>;

    /**
     * Find all fields
     */
    findAll(): Promise<Field[]>;

    /**
     * Save new field
     */
    save(field: Field): Promise<void>;

    /**
     * Update existing field
     */
    update(field: Field): Promise<void>;

    /**
     * Delete field
     */
    delete(id: string): Promise<void>;

    /**
     * Get total area of fields for a farm
     */
    getTotalAreaByFarmId(farmId: string): Promise<number>;

    /**
     * Get the count of plantings for a specific field
     */
    getPlantingsCount(fieldId: string): Promise<number>;

    /**
     * Check if field exists
     */
    exists(id: string): Promise<boolean>;
}
