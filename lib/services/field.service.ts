import { BaseService } from "./base.service";
import { NotFoundError, ValidationError } from "./types";
import type { Field, Prisma } from "@prisma/client";

export type CreateFieldInput = {
    farmId: string;
    name: string;
    fieldType: "OPEN_FIELD" | "GREENHOUSE" | "SCREENHOUSE" | "SHADE_HOUSE" | "NURSERY" | "HYDROPONICS";
    area: number;
    location?: string;
    soilType?: string;
    irrigationType?: string;
    status?: "ACTIVE" | "FALLOW" | "UNDER_PREPARATION";
};

export type UpdateFieldInput = Partial<Omit<CreateFieldInput, "farmId">>;

export type FieldWithRelations = Prisma.FieldGetPayload<{
    include: { farm: true; plantings: { include: { crop: true } } };
}>;

/**
 * Field management service
 */
export class FieldService extends BaseService {
    /**
     * Get all fields for a farm
     */
    async getFieldsByFarm(farmId: string): Promise<FieldWithRelations[]> {
        try {
            this.log("getFieldsByFarm", { farmId });

            return this.db.field.findMany({
                where: { farmId },
                include: {
                    farm: true,
                    plantings: {
                        include: { crop: true },
                        orderBy: { plantingDate: "desc" },
                        take: 5,
                    },
                    _count: {
                        select: {
                            plantings: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get field by ID
     */
    async getFieldById(id: string): Promise<FieldWithRelations> {
        try {
            this.log("getFieldById", { id });

            const field = await this.db.field.findUnique({
                where: { id },
                include: {
                    farm: true,
                    plantings: {
                        include: { crop: true },
                    },
                },
            });

            if (!field) {
                throw new NotFoundError("Field", id);
            }

            return field;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Create a new field
     */
    async createField(data: CreateFieldInput): Promise<Field> {
        try {
            this.log("createField", { name: data.name });

            this.validateRequired(data, ["farmId", "name", "fieldType", "area"]);

            // Validate farm exists
            await this.checkExists(this.db.farm, data.farmId, "Farm");

            // Check farm capacity
            await this.validateFarmCapacity(data.farmId, data.area);

            return this.db.field.create({
                data: {
                    ...data,
                    status: data.status || "ACTIVE",
                },
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Update field
     */
    async updateField(id: string, data: UpdateFieldInput): Promise<Field> {
        try {
            this.log("updateField", { id });

            await this.checkExists(this.db.field, id, "Field");

            // If area is being updated, validate farm capacity
            if (data.area !== undefined) {
                const field = await this.db.field.findUnique({ where: { id } });
                const areaDifference = data.area - field!.area;

                if (areaDifference > 0) {
                    await this.validateFarmCapacity(field!.farmId, areaDifference);
                }
            }

            return this.db.field.update({
                where: { id },
                data,
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Delete field
     */
    async deleteField(id: string): Promise<void> {
        try {
            this.log("deleteField", { id });

            await this.checkExists(this.db.field, id, "Field");

            await this.db.field.delete({
                where: { id },
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Calculate total area of fields in a farm
     */
    async calculateTotalArea(farmId: string): Promise<number> {
        try {
            const fields = await this.db.field.findMany({
                where: { farmId },
                select: { area: true },
            });

            return fields.reduce((sum, field) => sum + field.area, 0);
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get field statistics
     */
    async getFieldStatistics(fieldId: string) {
        try {
            this.log("getFieldStatistics", { fieldId });

            const field = await this.getFieldById(fieldId);

            const activePlantings = await this.db.planting.count({
                where: {
                    fieldId,
                    status: "GROWING",
                },
            });

            const totalActivities = await this.db.activity.count({
                where: { fieldId },
            });

            const recentActivities = await this.db.activity.findMany({
                where: { fieldId },
                orderBy: { activityDate: "desc" },
                take: 10,
                include: {
                    performedByUser: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });

            return {
                field,
                activePlantings,
                totalActivities,
                recentActivities,
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Validate farm capacity
     */
    private async validateFarmCapacity(
        farmId: string,
        additionalArea: number
    ): Promise<void> {
        const farm = await this.db.farm.findUnique({
            where: { id: farmId },
        });

        if (!farm) {
            throw new NotFoundError("Farm", farmId);
        }

        const currentTotalArea = await this.calculateTotalArea(farmId);

        if (currentTotalArea + additionalArea > farm.totalArea) {
            throw new ValidationError(
                `Adding ${additionalArea} hectares would exceed farm capacity of ${farm.totalArea} hectares`
            );
        }
    }
}

// Export singleton instance
export const fieldService = new FieldService();
