/**
 * Planting Entity
 * Encapsulates planting business logic
 */

import { Entity } from '@/core/shared';
import { PlantingStatus, PLANTING_CONSTRAINTS } from '@/core/domain/constants';
import { ValidationError, BusinessRuleViolationError } from '@/core/domain/errors';

interface PlantingProps {
    id: string;
    fieldId: string;
    cropId: string;
    plantedDate: Date;
    expectedHarvestDate: Date;
    actualHarvestDate?: Date;
    status: PlantingStatus;
    plantsCount?: number;
    expectedYield?: number;
    actualYield?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface CreatePlantingProps {
    id: string;
    fieldId: string;
    cropId: string;
    plantedDate: Date;
    expectedHarvestDate: Date;
    status?: PlantingStatus;
    plantsCount?: number;
    expectedYield?: number;
    notes?: string;
}

export class Planting implements Entity {
    private constructor(private readonly props: PlantingProps) {
        this.validate();
    }

    /**
     * Create a new Planting entity
     */
    static create(input: CreatePlantingProps): Planting {
        const props: PlantingProps = {
            id: input.id,
            fieldId: input.fieldId,
            cropId: input.cropId,
            plantedDate: input.plantedDate,
            expectedHarvestDate: input.expectedHarvestDate,
            status: input.status || PlantingStatus.PLANNED,
            plantsCount: input.plantsCount,
            expectedYield: input.expectedYield,
            notes: input.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return new Planting(props);
    }

    /**
     * Reconstitute from persistence
     */
    static reconstitute(props: PlantingProps): Planting {
        return new Planting(props);
    }

    /**
     * Validate business rules
     */
    private validate(): void {
        if (!this.props.fieldId) {
            throw new ValidationError('Field ID is required');
        }

        if (!this.props.cropId) {
            throw new ValidationError('Crop ID is required');
        }

        if (this.props.plantedDate > this.props.expectedHarvestDate) {
            throw new ValidationError('Planted date cannot be after expected harvest date');
        }

        if (this.props.plantsCount !== undefined && this.props.plantsCount < PLANTING_CONSTRAINTS.PLANTS_COUNT_MIN) {
            throw new ValidationError(`Plants count must be at least ${PLANTING_CONSTRAINTS.PLANTS_COUNT_MIN}`);
        }

        if (this.props.expectedYield !== undefined && this.props.expectedYield < PLANTING_CONSTRAINTS.EXPECTED_YIELD_MIN) {
            throw new ValidationError('Expected yield cannot be negative');
        }

        if (this.props.actualYield !== undefined && this.props.actualYield < 0) {
            throw new ValidationError('Actual yield cannot be negative');
        }
    }

    // Getters
    get id(): string {
        return this.props.id;
    }

    get fieldId(): string {
        return this.props.fieldId;
    }

    get cropId(): string {
        return this.props.cropId;
    }

    get plantedDate(): Date {
        return this.props.plantedDate;
    }

    get expectedHarvestDate(): Date {
        return this.props.expectedHarvestDate;
    }

    get actualHarvestDate(): Date | undefined {
        return this.props.actualHarvestDate;
    }

    get status(): PlantingStatus {
        return this.props.status;
    }

    get plantsCount(): number | undefined {
        return this.props.plantsCount;
    }

    get expectedYield(): number | undefined {
        return this.props.expectedYield;
    }

    get actualYield(): number | undefined {
        return this.props.actualYield;
    }

    get notes(): string | undefined {
        return this.props.notes;
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
     * Mark as planted
     */
    markAsPlanted(): Planting {
        if (this.props.status !== PlantingStatus.PLANNED) {
            throw new BusinessRuleViolationError('Only planned plantings can be marked as planted');
        }

        return Planting.reconstitute({
            ...this.props,
            status: PlantingStatus.PLANTED,
            updatedAt: new Date(),
        });
    }

    /**
     * Mark as growing
     */
    markAsGrowing(): Planting {
        if (this.props.status !== PlantingStatus.PLANTED) {
            throw new BusinessRuleViolationError('Only planted plantings can be marked as growing');
        }

        return Planting.reconstitute({
            ...this.props,
            status: PlantingStatus.GROWING,
            updatedAt: new Date(),
        });
    }

    /**
     * Harvest planting
     */
    harvest(actualYield: number, harvestDate: Date = new Date()): Planting {
        if (this.props.status === PlantingStatus.HARVESTED) {
            throw new BusinessRuleViolationError('Planting has already been harvested');
        }

        if (this.props.status === PlantingStatus.FAILED) {
            throw new BusinessRuleViolationError('Failed plantings cannot be harvested');
        }

        if (actualYield < 0) {
            throw new ValidationError('Actual yield cannot be negative');
        }

        return Planting.reconstitute({
            ...this.props,
            status: PlantingStatus.HARVESTED,
            actualYield,
            actualHarvestDate: harvestDate,
            updatedAt: new Date(),
        });
    }

    /**
     * Mark as failed
     */
    markAsFailed(reason?: string): Planting {
        if (this.props.status === PlantingStatus.HARVESTED) {
            throw new BusinessRuleViolationError('Harvested plantings cannot be marked as failed');
        }

        return Planting.reconstitute({
            ...this.props,
            status: PlantingStatus.FAILED,
            notes: reason ? `${this.props.notes || ''}\nFailed: ${reason}`.trim() : this.props.notes,
            updatedAt: new Date(),
        });
    }

    /**
     * Update expected harvest date
     */
    updateExpectedHarvestDate(newDate: Date): Planting {
        if (newDate < this.props.plantedDate) {
            throw new ValidationError('Expected harvest date cannot be before planted date');
        }

        return Planting.reconstitute({
            ...this.props,
            expectedHarvestDate: newDate,
            updatedAt: new Date(),
        });
    }

    /**
     * Check if overdue for harvest
     */
    isOverdue(): boolean {
        return this.props.status === PlantingStatus.GROWING &&
            new Date() > this.props.expectedHarvestDate;
    }

    /**
     * Check if ready to harvest
     */
    isReadyToHarvest(): boolean {
        return this.props.status === PlantingStatus.GROWING;
    }
}
