/**
 * Product/Inventory Entity
 */

import { Entity } from '@/core/shared';
import { ProductCategory, INVENTORY_CONSTRAINTS } from '@/core/domain/constants';
import { ValidationError } from '@/core/domain/errors';

interface ProductProps {
    id: string;
    name: string;
    category: ProductCategory;
    manufacturer?: string;
    unit: string;
    quantity: number;
    reorderLevel: number;
    createdAt: Date;
    updatedAt: Date;
}

interface CreateProductProps {
    id: string;
    name: string;
    category: ProductCategory;
    manufacturer?: string;
    unit: string;
    quantity?: number;
    reorderLevel?: number;
}

export class Product implements Entity {
    private constructor(private readonly props: ProductProps) {
        this.validate();
    }

    static create(input: CreateProductProps): Product {
        const props: ProductProps = {
            id: input.id,
            name: input.name,
            category: input.category,
            manufacturer: input.manufacturer,
            unit: input.unit,
            quantity: input.quantity ?? 0,
            reorderLevel: input.reorderLevel ?? 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return new Product(props);
    }

    static reconstitute(props: ProductProps): Product {
        return new Product(props);
    }

    private validate(): void {
        if (!this.props.name || this.props.name.trim().length < INVENTORY_CONSTRAINTS.NAME_MIN_LENGTH) {
            throw new ValidationError(
                `Product name must be at least ${INVENTORY_CONSTRAINTS.NAME_MIN_LENGTH} characters`
            );
        }

        if (this.props.name.length > INVENTORY_CONSTRAINTS.NAME_MAX_LENGTH) {
            throw new ValidationError(
                `Product name cannot exceed ${INVENTORY_CONSTRAINTS.NAME_MAX_LENGTH} characters`
            );
        }

        if (this.props.quantity < INVENTORY_CONSTRAINTS.QUANTITY_MIN) {
            throw new ValidationError('Quantity cannot be negative');
        }

        if (this.props.reorderLevel < INVENTORY_CONSTRAINTS.REORDER_LEVEL_MIN) {
            throw new ValidationError('Reorder level cannot be negative');
        }
    }

    // Getters
    get id(): string {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get category(): ProductCategory {
        return this.props.category;
    }

    get manufacturer(): string | undefined {
        return this.props.manufacturer;
    }

    get unit(): string {
        return this.props.unit;
    }

    get quantity(): number {
        return this.props.quantity;
    }

    get reorderLevel(): number {
        return this.props.reorderLevel;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    // Business methods
    addStock(amount: number): Product {
        if (amount <= 0) {
            throw new ValidationError('Amount must be positive');
        }

        return Product.reconstitute({
            ...this.props,
            quantity: this.props.quantity + amount,
            updatedAt: new Date(),
        });
    }

    removeStock(amount: number): Product {
        if (amount <= 0) {
            throw new ValidationError('Amount must be positive');
        }

        if (this.props.quantity < amount) {
            throw new ValidationError('Insufficient stock');
        }

        return Product.reconstitute({
            ...this.props,
            quantity: this.props.quantity - amount,
            updatedAt: new Date(),
        });
    }

    isLowStock(): boolean {
        return this.props.quantity <= this.props.reorderLevel;
    }

    updateReorderLevel(newLevel: number): Product {
        if (newLevel < INVENTORY_CONSTRAINTS.REORDER_LEVEL_MIN) {
            throw new ValidationError('Reorder level cannot be negative');
        }

        return Product.reconstitute({
            ...this.props,
            reorderLevel: newLevel,
            updatedAt: new Date(),
        });
    }
}
