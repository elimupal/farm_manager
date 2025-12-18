// Consolidated Product Use Cases
import { Product } from '@/core/domain/entities';
import { IProductRepository } from '@/core/application/ports/repositories';
import { CreateProductDto, UpdateProductDto, StockAdjustmentDto, ProductResponseDto } from '@/core/application/dtos';
import { Result } from '@/core/shared';
import { NotFoundError } from '@/core/domain/errors';

// Create Product
export class CreateProductUseCase {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute(dto: CreateProductDto): Promise<Result<ProductResponseDto, Error>> {
        try {
            const product = Product.create({ id: crypto.randomUUID(), ...dto });
            await this.productRepository.save(product);
            return Result.ok(this.toDto(product));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    private toDto(product: Product): ProductResponseDto {
        return {
            id: product.id,
            name: product.name,
            category: product.category,
            manufacturer: product.manufacturer,
            unit: product.unit,
            quantity: product.quantity,
            reorderLevel: product.reorderLevel,
            isLowStock: product.isLowStock(),
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
}

// Get Products
export class GetProductsUseCase {
    constructor(private readonly productRepository: IProductRepository) { }

    async executeAll(): Promise<Result<ProductResponseDto[], Error>> {
        try {
            const products = await this.productRepository.findAll();
            return Result.ok(products.map(this.toDto));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async executeLowStock(): Promise<Result<ProductResponseDto[], Error>> {
        try {
            const products = await this.productRepository.findLowStock();
            return Result.ok(products.map(this.toDto));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    private toDto(product: Product): ProductResponseDto {
        return {
            id: product.id,
            name: product.name,
            category: product.category,
            manufacturer: product.manufacturer,
            unit: product.unit,
            quantity: product.quantity,
            reorderLevel: product.reorderLevel,
            isLowStock: product.isLowStock(),
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
}

// Update Product
export class UpdateProductUseCase {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute(id: string, dto: UpdateProductDto): Promise<Result<ProductResponseDto, Error>> {
        try {
            const product = await this.productRepository.findById(id);
            if (!product) return Result.fail(new NotFoundError('Product', id));

            let updated = product;
            if (dto.reorderLevel !== undefined) {
                updated = updated.updateReorderLevel(dto.reorderLevel);
            }

            await this.productRepository.update(updated);
            return Result.ok(this.toDto(updated));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    private toDto(product: Product): ProductResponseDto {
        return {
            id: product.id,
            name: product.name,
            category: product.category,
            manufacturer: product.manufacturer,
            unit: product.unit,
            quantity: product.quantity,
            reorderLevel: product.reorderLevel,
            isLowStock: product.isLowStock(),
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
}

// Adjust Stock
export class AdjustStockUseCase {
    constructor(private readonly productRepository: IProductRepository) { }

    async addStock(id: string, dto: StockAdjustmentDto): Promise<Result<ProductResponseDto, Error>> {
        try {
            const product = await this.productRepository.findById(id);
            if (!product) return Result.fail(new NotFoundError('Product', id));

            const updated = product.addStock(dto.amount);
            await this.productRepository.update(updated);
            return Result.ok(this.toDto(updated));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async removeStock(id: string, dto: StockAdjustmentDto): Promise<Result<ProductResponseDto, Error>> {
        try {
            const product = await this.productRepository.findById(id);
            if (!product) return Result.fail(new NotFoundError('Product', id));

            const updated = product.removeStock(dto.amount);
            await this.productRepository.update(updated);
            return Result.ok(this.toDto(updated));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    private toDto(product: Product): ProductResponseDto {
        return {
            id: product.id,
            name: product.name,
            category: product.category,
            manufacturer: product.manufacturer,
            unit: product.unit,
            quantity: product.quantity,
            reorderLevel: product.reorderLevel,
            isLowStock: product.isLowStock(),
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
}

// Delete Product
export class DeleteProductUseCase {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute(id: string): Promise<Result<void, Error>> {
        try {
            const exists = await this.productRepository.exists(id);
            if (!exists) return Result.fail(new NotFoundError('Product', id));

            await this.productRepository.delete(id);
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
