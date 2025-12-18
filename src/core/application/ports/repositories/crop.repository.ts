/**
 * Crop Repository Interface (Port)
 */

import { Crop } from '@/core/domain/entities';

export interface ICropRepository {
    findById(id: string): Promise<Crop | null>;
    findAll(): Promise<Crop[]>;
    findByCategory(category: string): Promise<Crop[]>;
    save(crop: Crop): Promise<void>;
    update(crop: Crop): Promise<void>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
}
