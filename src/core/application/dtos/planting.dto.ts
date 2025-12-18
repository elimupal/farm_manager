/**
 * DTOs for Planting operations
 */

import { PlantingStatus } from '@/core/domain/constants';

export interface CreatePlantingDto {
    fieldId: string;
    cropId: string;
    plantedDate: Date;
    expectedHarvestDate: Date;
    status?: PlantingStatus;
    plantsCount?: number;
    expectedYield?: number;
    notes?: string;
}

export interface UpdatePlantingDto {
    expectedHarvestDate?: Date;
    plantsCount?: number;
    expectedYield?: number;
    notes?: string;
}

export interface HarvestPlantingDto {
    actualYield: number;
    harvestDate?: Date;
}

export interface PlantingResponseDto {
    id: string;
    fieldId: string;
    cropId: string;
    plantedDate: Date;
    expectedHarvestDate: Date;
    actualHarvestDate?: Date;
    status: PlantingStatus;
    plantsCount?: number;
    expectedYield?: number;
    actualYield?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
