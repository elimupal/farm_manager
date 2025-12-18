/**
 * Domain constants for Inventory aggregate
 */

export enum ProductCategory {
    FERTILIZER = 'FERTILIZER',
    PESTICIDE = 'PESTICIDE',
    HERBICIDE = 'HERBICIDE',
    FUNGICIDE = 'FUNGICIDE',
    SEEDS = 'SEEDS',
    EQUIPMENT = 'EQUIPMENT',
    OTHER = 'OTHER',
}

export const INVENTORY_CONSTRAINTS = {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    QUANTITY_MIN: 0,
    REORDER_LEVEL_MIN: 0,
} as const;

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
    [ProductCategory.FERTILIZER]: 'Fertilizer',
    [ProductCategory.PESTICIDE]: 'Pesticide',
    [ProductCategory.HERBICIDE]: 'Herbicide',
    [ProductCategory.FUNGICIDE]: 'Fungicide',
    [ProductCategory.SEEDS]: 'Seeds',
    [ProductCategory.EQUIPMENT]: 'Equipment',
    [ProductCategory.OTHER]: 'Other',
};
