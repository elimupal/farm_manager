/**
 * DTOs for Field operations
 */

import { FieldType, FieldStatus } from '@/core/domain/constants';

export interface CreateFieldDto {
    farmId: string;
    name: string;
    fieldType: FieldType;
    area: number;
    status?: FieldStatus;
    location?: string;
    soilType?: string;
    irrigationType?: string;
}

export interface UpdateFieldDto {
    name?: string;
    fieldType?: FieldType;
    area?: number;
    status?: FieldStatus;
    location?: string;
    soilType?: string;
    irrigationType?: string;
}

export interface FieldResponseDto {
    id: string;
    name: string;
    farmId: string;
    area: number;
    unit: string;
    fieldType: FieldType;
    status: FieldStatus;
    location?: string;
    coordinates?: string;
    soilType?: string;
    irrigationSystem?: string;
    createdAt: Date;
    updatedAt: Date;
    _count: {
        plantings: number;
    };
}
