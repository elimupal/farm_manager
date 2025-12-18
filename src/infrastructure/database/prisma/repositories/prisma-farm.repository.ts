/**
 * Prisma Farm Repository Implementation
 */

import { PrismaClient } from '@prisma/client';
import { IFarmRepository, Farm } from '@/core/application/ports/repositories';

export class PrismaFarmRepository implements IFarmRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<Farm | null> {
        const farm = await this.prisma.farm.findUnique({
            where: { id },
        });

        if (!farm) {
            return null;
        }

        return {
            id: farm.id,
            name: farm.name,
            totalArea: farm.totalArea,
        };
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.prisma.farm.count({
            where: { id },
        });

        return count > 0;
    }
}
