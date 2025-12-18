/**
 * Domain constants for Crop aggregate
 */

export enum CropCategory {
    VEGETABLES = 'VEGETABLES',
    FRUITS = 'FRUITS',
    CEREALS = 'CEREALS',
    LEGUMES = 'LEGUMES',
    HERBS = 'HERBS',
    FLOWERS = 'FLOWERS',
    OTHER = 'OTHER',
}

export const CROP_CONSTRAINTS = {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    GROWTH_CYCLE_MIN_DAYS: 1,
    GROWTH_CYCLE_MAX_DAYS: 365,
    EXPECTED_YIELD_MIN: 0,
} as const;

export const CROP_CATEGORY_LABELS: Record<CropCategory, string> = {
    [CropCategory.VEGETABLES]: 'Vegetables',
    [CropCategory.FRUITS]: 'Fruits',
    [CropCategory.CEREALS]: 'Cereals',
    [CropCategory.LEGUMES]: 'Legumes',
    [CropCategory.HERBS]: 'Herbs',
    [CropCategory.FLOWERS]: 'Flowers',
    [CropCategory.OTHER]: 'Other',
};
