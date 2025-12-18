/**
 * Prisma Crop Repository Implementation
 */

import { PrismaClient } from '@prisma/client';
import { Crop } from '@/core/domain/entities';
import { ICropRepository } from '@/core/application/ports/repositories';
import { CropMapper } from '../mappers/crop.mapper';

export class PrismaCropRepository implements ICropRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<Crop | null> {
        const prismaCrop = await this.prisma.crop.findUnique({
            where: { id },
        });

        if (!prismaCrop) {
            return null;
        }

        return CropMapper.toDomain(prismaCrop);
    }

    async findAll(): Promise<Crop[]> {
        const prismaCrops = await this.prisma.crop.findMany({
            orderBy: { name: 'asc' },
        });

        return prismaCrops.map(CropMapper.toDomain);
    }

    async findByCategory(category: string): Promise<Crop[]> {
        const prismaCrops = await this.prisma.crop.findMany({
            where: { category: category as any },
            orderBy: { name: 'asc' },
        });

        return prismaCrops.map(CropMapper.toDomain);
    }

    async save(crop: Crop): Promise<void> {
        const data = CropMapper.toPrisma(crop);

        await this.prisma.crop.create({
            data,
        });
    }

    async update(crop: Crop): Promise<void> {
        const data = CropMapper.toPrisma(crop);

        await this.prisma.crop.update({
            where: { id: crop.id },
            data,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.crop.delete({
            where: { id },
        });
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.prisma.crop.count({
            where: { id },
        });

        return count > 0;
    }
}
