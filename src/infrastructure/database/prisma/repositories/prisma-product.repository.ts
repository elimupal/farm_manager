import { PrismaClient } from '@prisma/client';
import { Product } from '@/core/domain/entities';
import { IProductRepository } from '@/core/application/ports/repositories';
import { ProductMapper } from '../mappers/product.mapper';

export class PrismaProductRepository implements IProductRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<Product | null> {
        const prismaProduct = await this.prisma.product.findUnique({ where: { id } });
        return prismaProduct ? ProductMapper.toDomain(prismaProduct) : null;
    }

    async findAll(): Promise<Product[]> {
        const products = await this.prisma.product.findMany({ orderBy: { name: 'asc' } });
        return products.map(ProductMapper.toDomain);
    }

    async findByCategory(category: string): Promise<Product[]> {
        const products = await this.prisma.product.findMany({
            where: { category: category as any },
            orderBy: { name: 'asc' },
        });
        return products.map(ProductMapper.toDomain);
    }

    async findLowStock(): Promise<Product[]> {
        const products = await this.prisma.product.findMany({
            where: {
                currentStock: {
                    lte: this.prisma.product.fields.reorderLevel,
                },
            },
            orderBy: { name: 'asc' },
        });
        return products.map(ProductMapper.toDomain);
    }

    async save(product: Product): Promise<void> {
        await this.prisma.product.create({ data: ProductMapper.toPrisma(product) as any });
    }

    async update(product: Product): Promise<void> {
        await this.prisma.product.update({
            where: { id: product.id },
            data: ProductMapper.toPrisma(product) as any,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.product.delete({ where: { id } });
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.prisma.product.count({ where: { id } });
        return count > 0;
    }
}
