/**
 * Domain constants for Planting aggregate
 */

export enum PlantingStatus {
    PLANNED = 'PLANNED',
    PLANTED = 'PLANTED',
    GROWING = 'GROWING',
    HARVESTED = 'HARVESTED',
    FAILED = 'FAILED',
}

export const PLANTING_CONSTRAINTS = {
    EXPECTED_YIELD_MIN: 0,
    PLANTS_COUNT_MIN: 1,
} as const;

export const PLANTING_STATUS_LABELS: Record<PlantingStatus, string> = {
    [PlantingStatus.PLANNED]: 'Planned',
    [PlantingStatus.PLANTED]: 'Planted',
    [PlantingStatus.GROWING]: 'Growing',
    [PlantingStatus.HARVESTED]: 'Harvested',
    [PlantingStatus.FAILED]: 'Failed',
};
