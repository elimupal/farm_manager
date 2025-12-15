"use server";

import { revalidatePath } from "next/cache";
import { fieldService } from "@/lib/services";
import { fieldSchema, type FieldFormData } from "@/lib/validations/field.schema";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createField(data: FieldFormData) {
    try {
        const session = await auth();
        if (!session?.user) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = fieldSchema.parse(data);

        // Get or create default farm
        const farm = await prisma.farm.findFirst();
        const farmId = farm?.id || (await createDefaultFarm());

        // Use FieldService to create field
        const field = await fieldService.createField({
            ...validated,
            farmId,
        });

        revalidatePath("/dashboard/fields");
        return { success: true, data: field };
    } catch (error: any) {
        console.error("Create field error:", error);

        // Handle specific error types
        if (error.name === "ValidationError") {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Failed to create field" };
    }
}

export async function updateField(id: string, data: FieldFormData) {
    try {
        const session = await auth();
        if (!session?.user) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = fieldSchema.parse(data);

        // Use FieldService to update field
        const field = await fieldService.updateField(id, validated);

        revalidatePath("/dashboard/fields");
        return { success: true, data: field };
    } catch (error: any) {
        console.error("Update field error:", error);

        if (error.name === "NotFoundError") {
            return { success: false, error: "Field not found" };
        }

        if (error.name === "ValidationError") {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Failed to update field" };
    }
}

export async function deleteField(id: string) {
    try {
        const session = await auth();
        if (!session?.user) {
            return { success: false, error: "Unauthorized" };
        }

        // Use FieldService to delete field
        await fieldService.deleteField(id);

        revalidatePath("/dashboard/fields");
        return { success: true };
    } catch (error: any) {
        console.error("Delete field error:", error);

        if (error.name === "NotFoundError") {
            return { success: false, error: "Field not found" };
        }

        return { success: false, error: "Failed to delete field" };
    }
}

export async function getFields() {
    try {
        // Get first farm (or create one)
        const farm = await prisma.farm.findFirst();
        const farmId = farm?.id || (await createDefaultFarm());

        // Use FieldService to get fields
        const fields = await fieldService.getFieldsByFarm(farmId);

        return { success: true, data: fields };
    } catch (error) {
        console.error("Get fields error:", error);
        return { success: false, error: "Failed to fetch fields", data: [] };
    }
}

export async function getFieldStatistics(fieldId: string) {
    try {
        const session = await auth();
        if (!session?.user) {
            return { success: false, error: "Unauthorized" };
        }

        // Use FieldService to get statistics
        const stats = await fieldService.getFieldStatistics(fieldId);

        return { success: true, data: stats };
    } catch (error: any) {
        console.error("Get field statistics error:", error);

        if (error.name === "NotFoundError") {
            return { success: false, error: "Field not found" };
        }

        return { success: false, error: "Failed to fetch field statistics" };
    }
}

// Helper function to create default farm
async function createDefaultFarm(): Promise<string> {
    const farm = await prisma.farm.create({
        data: {
            name: "My Farm",
            location: "Default Location",
            totalArea: 1000, // 1000 hectares default
        },
    });
    return farm.id;
}
