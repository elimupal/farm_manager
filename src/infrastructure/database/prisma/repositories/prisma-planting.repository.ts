/**
 * Prisma Planting Repository Implementation
 */

import { PrismaClient } from '@prisma/client';
import { Planting } from '@/core/domain/entities';
import { IPlantingRepository } from '@/core/application/ports/repositories';
import { PlantingMapper } from '../mappers/planting.mapper';

export class PrismaPlantingRepository implements IPlantingRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<Planting | null> {
        const prismaPlanting = await this.prisma.planting.findUnique({
            where: { id },
        });

        if (!prismaPlanting) {
            return null;
        }

        return PlantingMapper.toDomain(prismaPlanting);
    }

    async findAll(): Promise<Planting[]> {
        const prismaPlantings = await this.prisma.planting.findMany({
            orderBy: { plantingDate: 'desc' },
        });

        return prismaPlantings.map(PlantingMapper.toDomain);
    }

    async findByFieldId(fieldId: string): Promise<Planting[]> {
        const prismaPlantings = await this.prisma.planting.findMany({
            where: { fieldId },
            orderBy: { plantingDate: 'desc' },
        });

        return prismaPlantings.map(PlantingMapper.toDomain);
    }

    async findByCropId(cropId: string): Promise<Planting[]> {
        const prismaPlantings = await this.prisma.planting.findMany({
            where: { cropId },
            orderBy: { plantingDate: 'desc' },
        });

        return prismaPlantings.map(PlantingMapper.toDomain);
    }

    async findByStatus(status: string): Promise<Planting[]> {
        const prismaPlantings = await this.prisma.planting.findMany({
            where: { status: status as any },
            orderBy: { plantingDate: 'desc' },
        });

        return prismaPlantings.map(PlantingMapper.toDomain);
    }

    async save(planting: Planting): Promise<void> {
        const data = PlantingMapper.toPrisma(planting);

        await this.prisma.planting.create({
            data,
        });
    }

    async update(planting: Planting): Promise<void> {
        const data = PlantingMapper.toPrisma(planting);

        await this.prisma.planting.update({
            where: { id: planting.id },
            data,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.planting.delete({
            where: { id },
        });
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.prisma.planting.count({
            where: { id },
        });

        return count > 0;
    }
}
