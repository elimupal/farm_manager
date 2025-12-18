/**
 * Planting Repository Interface (Port)
 */

import { Planting } from '@/core/domain/entities';

export interface IPlantingRepository {
    findById(id: string): Promise<Planting | null>;
    findAll(): Promise<Planting[]>;
    findByFieldId(fieldId: string): Promise<Planting[]>;
    findByCropId(cropId: string): Promise<Planting[]>;
    findByStatus(status: string): Promise<Planting[]>;
    save(planting: Planting): Promise<void>;
    update(planting: Planting): Promise<void>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
}
