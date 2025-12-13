export const FIELD_TYPES = {
    OPEN_FIELD: "Open Field",
    GREENHOUSE: "Greenhouse",
    SCREENHOUSE: "Screenhouse",
    SHADE_HOUSE: "Shade House",
    NURSERY: "Nursery",
    HYDROPONICS: "Hydroponics",
} as const;

export const FIELD_STATUS = {
    ACTIVE: "Active",
    FALLOW: "Fallow",
    UNDER_PREPARATION: "Under Preparation",
} as const;

export const CROP_CATEGORIES = {
    VEGETABLES: "Vegetables",
    FRUITS: "Fruits",
    CEREALS: "Cereals",
    LEGUMES: "Legumes",
    HERBS: "Herbs",
    FLOWERS: "Flowers",
    OTHER: "Other",
} as const;

export const USER_ROLES = {
    OWNER: "Farm Owner",
    MANAGER: "Manager",
    SUPERVISOR: "Supervisor",
    WORKER: "Worker",
    AGRONOMIST: "Agronomist",
} as const;

export const PRODUCT_CATEGORIES = {
    AGROCHEMICAL: "Agrochemical",
    FERTILIZER: "Fertilizer",
    SEED: "Seed",
    EQUIPMENT: "Equipment",
} as const;

export const ACTIVITY_TYPES = {
    PLANTING: "Planting",
    IRRIGATION: "Irrigation",
    FERTILIZATION: "Fertilization",
    PEST_CONTROL: "Pest Control",
    WEEDING: "Weeding",
    PRUNING: "Pruning",
    HARVESTING: "Harvesting",
    SOIL_PREPARATION: "Soil Preparation",
    OTHER: "Other",
} as const;

export const PLANTING_STATUS = {
    GROWING: "Growing",
    HARVESTED: "Harvested",
    FAILED: "Failed",
} as const;

export const PLANTING_METHODS = {
    DIRECT_SEEDING: "Direct Seeding",
    TRANSPLANTING: "Transplanting",
} as const;
