/**
 * Coordinates Value Object
 * Represents GPS coordinates
 */

import { ValueObject } from '@/core/shared';
import { ValidationError } from '@/core/domain/errors';

interface CoordinatesProps {
    latitude: number;
    longitude: number;
}

export class Coordinates implements ValueObject<CoordinatesProps> {
    private constructor(
        public readonly latitude: number,
        public readonly longitude: number
    ) { }

    static create(props: CoordinatesProps): Coordinates {
        if (props.latitude < -90 || props.latitude > 90) {
            throw new ValidationError('Latitude must be between -90 and 90');
        }

        if (props.longitude < -180 || props.longitude > 180) {
            throw new ValidationError('Longitude must be between -180 and 180');
        }

        return new Coordinates(props.latitude, props.longitude);
    }

    get value(): CoordinatesProps {
        return { latitude: this.latitude, longitude: this.longitude };
    }

    equals(other: ValueObject<CoordinatesProps>): boolean {
        const otherValue = other.value;
        return (
            this.latitude === otherValue.latitude &&
            this.longitude === otherValue.longitude
        );
    }

    /**
     * Convert to string format for storage
     */
    toString(): string {
        return `${this.latitude},${this.longitude}`;
    }

    /**
     * Parse from string format
     */
    static fromString(value: string): Coordinates {
        const [lat, lon] = value.split(',').map(Number);
        return Coordinates.create({ latitude: lat, longitude: lon });
    }
}
