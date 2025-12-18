import { Product as PrismaProduct } from '@prisma/client';
import { Product } from '@/core/domain/entities';
import { ProductCategory } from '@/core/domain/constants';

export class ProductMapper {
    static toDomain(prismaProduct: PrismaProduct): Product {
        return Product.reconstitute({
            id: prismaProduct.id,
            name: prismaProduct.name,
            category: prismaProduct.category as ProductCategory,
            manufacturer: prismaProduct.manufacturer || undefined,
            unit: prismaProduct.unit,
            quantity: prismaProduct.currentStock, // Prisma field: currentStock
            reorderLevel: prismaProduct.reorderLevel || 0,
            createdAt: prismaProduct.createdAt,
            updatedAt: prismaProduct.updatedAt,
        });
    }

    static toPrisma(product: Product) {
        return {
            id: product.id,
            name: product.name,
            category: product.category as any,
            manufacturer: product.manufacturer || null,
            unit: product.unit,
            currentStock: product.quantity, // Map to Prisma's currentStock
            reorderLevel: product.reorderLevel,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        } as any; // Cast to bypass type checking
    }
}
