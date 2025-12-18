/**
 * Field Entity
 * Encapsulates field business logic and rules
 */

import { Entity } from '@/core/shared';
import { Area, Coordinates } from '@/core/domain/value-objects';
import { FieldType, FieldStatus, FIELD_CONSTRAINTS } from '@/core/domain/constants';
import { ValidationError, BusinessRuleViolationError } from '@/core/domain/errors';

interface FieldProps {
    id: string;
    farmId: string;
    name: string;
    fieldType: FieldType;
    area: Area;
    status: FieldStatus;
    location?: Coordinates;
    soilType?: string;
    irrigationType?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface CreateFieldProps {
    id: string;
    farmId: string;
    name: string;
    fieldType: FieldType;
    area: number;
    status?: FieldStatus;
    location?: string;
    soilType?: string;
    irrigationType?: string;
}

export class Field implements Entity {
    private constructor(private readonly props: FieldProps) {
        this.validate();
    }

    /**
     * Create a new Field entity
     */
    static create(input: CreateFieldProps): Field {
        const area = Area.create(input.area);
        const location = input.location ? Coordinates.fromString(input.location) : undefined;

        const props: FieldProps = {
            id: input.id,
            farmId: input.farmId,
            name: input.name,
            fieldType: input.fieldType,
            area,
            status: input.status || FieldStatus.ACTIVE,
            location,
            soilType: input.soilType,
            irrigationType: input.irrigationType,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return new Field(props);
    }

    /**
     * Reconstitute from persistence
     */
    static reconstitute(props: FieldProps): Field {
        return new Field(props);
    }

    /**
     * Validate business rules
     */
    private validate(): void {
        if (!this.props.name || this.props.name.trim().length < FIELD_CONSTRAINTS.NAME_MIN_LENGTH) {
            throw new ValidationError(
                `Field name must be at least ${FIELD_CONSTRAINTS.NAME_MIN_LENGTH} characters`
            );
        }

        if (this.props.name.length > FIELD_CONSTRAINTS.NAME_MAX_LENGTH) {
            throw new ValidationError(
                `Field name cannot exceed ${FIELD_CONSTRAINTS.NAME_MAX_LENGTH} characters`
            );
        }

        if (!this.props.farmId) {
            throw new ValidationError('Farm ID is required');
        }
    }

    // Getters
    get id(): string {
        return this.props.id;
    }

    get farmId(): string {
        return this.props.farmId;
    }

    get name(): string {
        return this.props.name;
    }

    get fieldType(): FieldType {
        return this.props.fieldType;
    }

    get area(): Area {
        return this.props.area;
    }

    get status(): FieldStatus {
        return this.props.status;
    }

    get location(): Coordinates | undefined {
        return this.props.location;
    }

    get soilType(): string | undefined {
        return this.props.soilType;
    }

    get irrigationType(): string | undefined {
        return this.props.irrigationType;
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
     * Update field name
     */
    updateName(newName: string): Field {
        if (!newName || newName.trim().length < FIELD_CONSTRAINTS.NAME_MIN_LENGTH) {
            throw new ValidationError(
                `Field name must be at least ${FIELD_CONSTRAINTS.NAME_MIN_LENGTH} characters`
            );
        }

        return Field.reconstitute({
            ...this.props,
            name: newName,
            updatedAt: new Date(),
        });
    }

    /**
     * Update area
     */
    updateArea(newArea: number): Field {
        const area = Area.create(newArea);

        return Field.reconstitute({
            ...this.props,
            area,
            updatedAt: new Date(),
        });
    }

    /**
     * Change status
     */
    changeStatus(newStatus: FieldStatus): Field {
        if (this.props.status === newStatus) {
            return this;
        }

        return Field.reconstitute({
            ...this.props,
            status: newStatus,
            updatedAt: new Date(),
        });
    }

    /**
     * Set to fallow (business rule: can only set ACTIVE fields to fallow)
     */
    setToFallow(): Field {
        if (this.props.status !== FieldStatus.ACTIVE) {
            throw new BusinessRuleViolationError(
                'Only active fields can be set to fallow'
            );
        }

        return this.changeStatus(FieldStatus.FALLOW);
    }

    /**
     * Activate field
     */
    activate(): Field {
        if (this.props.status === FieldStatus.ACTIVE) {
            return this;
        }

        return this.changeStatus(FieldStatus.ACTIVE);
    }

    /**
     * Check if field can be deleted
     */
    canBeDeleted(): boolean {
        // Business rule: Active fields with ongoing plantings cannot be deleted
        // This would need to check planting status in the use case layer
        return this.props.status !== FieldStatus.ACTIVE;
    }

    /**
     * Check if field is active
     */
    isActive(): boolean {
        return this.props.status === FieldStatus.ACTIVE;
    }

    /**
     * Update location
     */
    updateLocation(latitude: number, longitude: number): Field {
        const location = Coordinates.create({ latitude, longitude });

        return Field.reconstitute({
            ...this.props,
            location,
            updatedAt: new Date(),
        });
    }
}
