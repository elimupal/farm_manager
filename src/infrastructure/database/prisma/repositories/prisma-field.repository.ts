/**
 * Prisma Field Repository Implementation
 * Implements IFieldRepository using Prisma
 */

import { PrismaClient } from '@prisma/client';
import { Field } from '@/core/domain/entities';
import { IFieldRepository } from '@/core/application/ports/repositories';
import { FieldMapper } from '../mappers/field.mapper';

export class PrismaFieldRepository implements IFieldRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<Field | null> {
        const prismaField = await this.prisma.field.findUnique({
            where: { id },
        });

        if (!prismaField) {
            return null;
        }

        return FieldMapper.toDomain(prismaField);
    }

    async findByFarmId(farmId: string): Promise<Field[]> {
        const prismaFields = await this.prisma.field.findMany({
            where: { farmId },
            orderBy: { createdAt: 'desc' },
        });

        return prismaFields.map(FieldMapper.toDomain);
    }

    async findAll(): Promise<Field[]> {
        const prismaFields = await this.prisma.field.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return prismaFields.map(FieldMapper.toDomain);
    }

    async save(field: Field): Promise<void> {
        const data = FieldMapper.toPrisma(field);

        await this.prisma.field.create({
            data,
        });
    }

    async update(field: Field): Promise<void> {
        const data = FieldMapper.toPrisma(field);

        await this.prisma.field.update({
            where: { id: field.id },
            data,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.field.delete({
            where: { id },
        });
    }

    async getTotalAreaByFarmId(farmId: string): Promise<number> {
        const result = await this.prisma.field.aggregate({
            where: { farmId },
            _sum: { area: true },
        });

        return result._sum.area || 0;
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.prisma.field.count({
            where: { id },
        });

        return count > 0;
    }

    async getPlantingsCount(fieldId: string): Promise<number> {
        const count = await this.prisma.planting.count({
            where: { fieldId },
        });

        return count;
    }
}
