import { z } from "zod";

export const fieldSchema = z.object({
    farmId: z.string().cuid().optional(), // Will be set to default farm
    name: z.string().min(1, "Field name is required").max(100),
    fieldType: z.enum([
        "OPEN_FIELD",
        "GREENHOUSE",
        "SCREENHOUSE",
        "SHADE_HOUSE",
        "NURSERY",
        "HYDROPONICS",
    ]),
    area: z.number().positive("Area must be positive"),
    location: z.string().optional(),
    soilType: z.string().optional(),
    irrigationType: z.string().optional(),
    status: z.enum(["ACTIVE", "FALLOW", "UNDER_PREPARATION"]),
});

export type FieldFormData = z.infer<typeof fieldSchema>;
