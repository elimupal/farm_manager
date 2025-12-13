"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { fieldSchema, type FieldFormData } from "@/lib/validations/field.schema";
import { auth } from "@/lib/auth";

export async function createField(data: FieldFormData) {
    try {
        const session = await auth();
        if (!session?.user) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = fieldSchema.parse(data);

        // Get or create default farm
        let farm = await prisma.farm.findFirst();
        if (!farm) {
            farm = await prisma.farm.create({
                data: {
                    name: "My Farm",
                    location: "Default Location",
                    totalArea: 0,
                },
            });
        }

        const field = await prisma.field.create({
            data: {
                ...validated,
                farmId: farm.id,
            },
        });

        revalidatePath("/dashboard/fields");
        return { success: true, data: field };
    } catch (error) {
        console.error("Create field error:", error);
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

        const field = await prisma.field.update({
            where: { id },
            data: validated,
        });

        revalidatePath("/dashboard/fields");
        return { success: true, data: field };
    } catch (error) {
        console.error("Update field error:", error);
        return { success: false, error: "Failed to update field" };
    }
}

export async function deleteField(id: string) {
    try {
        const session = await auth();
        if (!session?.user) {
            return { success: false, error: "Unauthorized" };
        }

        await prisma.field.delete({
            where: { id },
        });

        revalidatePath("/dashboard/fields");
        return { success: true };
    } catch (error) {
        console.error("Delete field error:", error);
        return { success: false, error: "Failed to delete field" };
    }
}

export async function getFields() {
    try {
        const fields = await prisma.field.findMany({
            include: {
                farm: true,
                _count: {
                    select: {
                        plantings: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return { success: true, data: fields };
    } catch (error) {
        console.error("Get fields error:", error);
        return { success: false, error: "Failed to fetch fields", data: [] };
    }
}
