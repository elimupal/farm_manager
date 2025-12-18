/**
 * DTOs for Crop operations
 */

import { CropCategory } from '@/core/domain/constants';

export interface CreateCropDto {
    name: string;
    scientificName?: string;
    category: CropCategory;
    variety?: string;
    growthCycleDays: number;
    expectedYield?: number;
}

export interface UpdateCropDto {
    name?: string;
    scientificName?: string;
    category?: CropCategory;
    variety?: string;
    growthCycleDays?: number;
    expectedYield?: number;
}

export interface CropResponseDto {
    id: string;
    name: string;
    scientificName?: string;
    category: CropCategory;
    variety?: string;
    growthCycleDays: number;
    expectedYield?: number;
    createdAt: Date;
    updatedAt: Date;
}
