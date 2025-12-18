import { Product } from '@/core/domain/entities';

export interface IProductRepository {
    findById(id: string): Promise<Product | null>;
    findAll(): Promise<Product[]>;
    findByCategory(category: string): Promise<Product[]>;
    findLowStock(): Promise<Product[]>;
    save(product: Product): Promise<void>;
    update(product: Product): Promise<void>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
}
