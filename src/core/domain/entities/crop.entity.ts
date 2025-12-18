/**
 * Crop Entity
 * Encapsulates crop business logic
 */

import { Entity } from '@/core/shared';
import { CropCategory, CROP_CONSTRAINTS } from '@/core/domain/constants';
import { ValidationError } from '@/core/domain/errors';

interface CropProps {
    id: string;
    name: string;
    scientificName?: string;
    category: CropCategory;
    variety?: string;
    growthCycleDays: number;
    expectedYield?: number;
    createdAt: Date;
    updatedAt: Date;
}

interface CreateCropProps {
    id: string;
    name: string;
    scientificName?: string;
    category: CropCategory;
    variety?: string;
    growthCycleDays: number;
    expectedYield?: number;
}

export class Crop implements Entity {
    private constructor(private readonly props: CropProps) {
        this.validate();
    }

    /**
     * Create a new Crop entity
     */
    static create(input: CreateCropProps): Crop {
        const props: CropProps = {
            id: input.id,
            name: input.name,
            scientificName: input.scientificName,
            category: input.category,
            variety: input.variety,
            growthCycleDays: input.growthCycleDays,
            expectedYield: input.expectedYield,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return new Crop(props);
    }

    /**
     * Reconstitute from persistence
     */
    static reconstitute(props: CropProps): Crop {
        return new Crop(props);
    }

    /**
     * Validate business rules
     */
    private validate(): void {
        if (!this.props.name || this.props.name.trim().length < CROP_CONSTRAINTS.NAME_MIN_LENGTH) {
            throw new ValidationError(
                `Crop name must be at least ${CROP_CONSTRAINTS.NAME_MIN_LENGTH} characters`
            );
        }

        if (this.props.name.length > CROP_CONSTRAINTS.NAME_MAX_LENGTH) {
            throw new ValidationError(
                `Crop name cannot exceed ${CROP_CONSTRAINTS.NAME_MAX_LENGTH} characters`
            );
        }

        if (this.props.growthCycleDays < CROP_CONSTRAINTS.GROWTH_CYCLE_MIN_DAYS) {
            throw new ValidationError(
                `Growth cycle must be at least ${CROP_CONSTRAINTS.GROWTH_CYCLE_MIN_DAYS} day`
            );
        }

        if (this.props.growthCycleDays > CROP_CONSTRAINTS.GROWTH_CYCLE_MAX_DAYS) {
            throw new ValidationError(
                `Growth cycle cannot exceed ${CROP_CONSTRAINTS.GROWTH_CYCLE_MAX_DAYS} days`
            );
        }

        if (this.props.expectedYield !== undefined && this.props.expectedYield < CROP_CONSTRAINTS.EXPECTED_YIELD_MIN) {
            throw new ValidationError('Expected yield cannot be negative');
        }
    }

    // Getters
    get id(): string {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get scientificName(): string | undefined {
        return this.props.scientificName;
    }

    get category(): CropCategory {
        return this.props.category;
    }

    get variety(): string | undefined {
        return this.props.variety;
    }

    get growthCycleDays(): number {
        return this.props.growthCycleDays;
    }

    get expectedYield(): number | undefined {
        return this.props.expectedYield;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    /**
     * Business methods
     */

    /**
     * Update crop name
     */
    updateName(newName: string): Crop {
        if (!newName || newName.trim().length < CROP_CONSTRAINTS.NAME_MIN_LENGTH) {
            throw new ValidationError(
                `Crop name must be at least ${CROP_CONSTRAINTS.NAME_MIN_LENGTH} characters`
            );
        }

        return Crop.reconstitute({
            ...this.props,
            name: newName,
            updatedAt: new Date(),
        });
    }

    /**
     * Update growth cycle
     */
    updateGrowthCycle(days: number): Crop {
        if (days < CROP_CONSTRAINTS.GROWTH_CYCLE_MIN_DAYS || days > CROP_CONSTRAINTS.GROWTH_CYCLE_MAX_DAYS) {
            throw new ValidationError(
                `Growth cycle must be between ${CROP_CONSTRAINTS.GROWTH_CYCLE_MIN_DAYS} and ${CROP_CONSTRAINTS.GROWTH_CYCLE_MAX_DAYS} days`
            );
        }

        return Crop.reconstitute({
            ...this.props,
            growthCycleDays: days,
            updatedAt: new Date(),
        });
    }

    /**
     * Update expected yield
     */
    updateExpectedYield(yield_: number): Crop {
        if (yield_ < CROP_CONSTRAINTS.EXPECTED_YIELD_MIN) {
            throw new ValidationError('Expected yield cannot be negative');
        }

        return Crop.reconstitute({
            ...this.props,
            expectedYield: yield_,
            updatedAt: new Date(),
        });
    }

    /**
     * Get display name with variety
     */
    getDisplayName(): string {
        return this.props.variety ? `${this.props.name} - ${this.props.variety}` : this.props.name;
    }
}
