/**
 * Area Value Object
 * Represents area in hectares with validation
 */

import { ValueObject } from '@/core/shared';
import { ValidationError } from '@/core/domain/errors';
import { FIELD_CONSTRAINTS } from '@/core/domain/constants';

export class Area implements ValueObject<number> {
    private constructor(public readonly value: number) { }

    static create(hectares: number): Area {
        if (hectares < FIELD_CONSTRAINTS.AREA_MIN) {
            throw new ValidationError(
                `Area must be at least ${FIELD_CONSTRAINTS.AREA_MIN} hectares`
            );
        }

        if (hectares > FIELD_CONSTRAINTS.AREA_MAX) {
            throw new ValidationError(
                `Area cannot exceed ${FIELD_CONSTRAINTS.AREA_MAX} hectares`
            );
        }

        return new Area(hectares);
    }

    equals(other: ValueObject<number>): boolean {
        return this.value === other.value;
    }

    /**
     * Add areas together
     */
    add(other: Area): Area {
        return Area.create(this.value + other.value);
    }

    /**
     * Check if this area is greater than another
     */
    greaterThan(other: Area): boolean {
        return this.value > other.value;
    }

    /**
     * Check if this area is less than another
     */
    lessThan(other: Area): boolean {
        return this.value < other.value;
    }

    /**
     * Convert to display string
     */
    toString(): string {
        return `${this.value} ha`;
    }
}
