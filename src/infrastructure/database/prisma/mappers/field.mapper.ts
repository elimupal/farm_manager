/**
 * Field Domain Mapper
 * Maps between Prisma models and Domain entities
 */

import { Field as PrismaField } from '@prisma/client';
import { Field } from '@/core/domain/entities';
import { Area, Coordinates } from '@/core/domain/value-objects';
import { FieldType, FieldStatus } from '@/core/domain/constants';

export class FieldMapper {
    /**
     * Map Prisma model to Domain entity
     */
    static toDomain(prismaField: PrismaField): Field {
        const area = Area.create(prismaField.area);
        const location = prismaField.location
            ? Coordinates.fromString(prismaField.location)
            : undefined;

        return Field.reconstitute({
            id: prismaField.id,
            farmId: prismaField.farmId,
            name: prismaField.name,
            fieldType: prismaField.fieldType as FieldType,
            area,
            status: prismaField.status as FieldStatus,
            location,
            soilType: prismaField.soilType || undefined,
            irrigationType: prismaField.irrigationType || undefined,
            createdAt: prismaField.createdAt,
            updatedAt: prismaField.updatedAt,
        });
    }

    /**
     * Map Domain entity to Prisma model data
     */
    static toPrisma(field: Field) {
        return {
            id: field.id,
            farmId: field.farmId,
            name: field.name,
            fieldType: field.fieldType,
            area: field.area.value,
            status: field.status,
            location: field.location?.toString() || null,
            soilType: field.soilType || null,
            irrigationType: field.irrigationType || null,
            createdAt: field.createdAt,
            updatedAt: field.updatedAt,
        };
    }
}
