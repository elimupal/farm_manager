/**
 * Domain constants for Field aggregate
 * Centralized location for all field-related enums and constants
 */

export enum FieldType {
    OPEN_FIELD = 'OPEN_FIELD',
    GREENHOUSE = 'GREENHOUSE',
    SCREENHOUSE = 'SCREENHOUSE',
    SHADE_HOUSE = 'SHADE_HOUSE',
    NURSERY = 'NURSERY',
    HYDROPONICS = 'HYDROPONICS',
}

export enum FieldStatus {
    ACTIVE = 'ACTIVE',
    FALLOW = 'FALLOW',
    UNDER_PREPARATION = 'UNDER_PREPARATION',
}

export const FIELD_CONSTRAINTS = {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 100,
    AREA_MIN: 0.01, // Minimum 0.01 hectares
    AREA_MAX: 10000, // Maximum 10,000 hectares
} as const;

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
    [FieldType.OPEN_FIELD]: 'Open Field',
    [FieldType.GREENHOUSE]: 'Greenhouse',
    [FieldType.SCREENHOUSE]: 'Screenhouse',
    [FieldType.SHADE_HOUSE]: 'Shade House',
    [FieldType.NURSERY]: 'Nursery',
    [FieldType.HYDROPONICS]: 'Hydroponics',
};

export const FIELD_STATUS_LABELS: Record<FieldStatus, string> = {
    [FieldStatus.ACTIVE]: 'Active',
    [FieldStatus.FALLOW]: 'Fallow',
    [FieldStatus.UNDER_PREPARATION]: 'Under Preparation',
};
