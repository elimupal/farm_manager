import { fieldService } from "@/lib/services";
import { NextResponse } from "next/server";

/**
 * GET /api/fields/[id]
 * Get a specific field by ID
 */
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const field = await fieldService.getFieldById(params.id);

        return NextResponse.json({
            success: true,
            data: field,
        });
    } catch (error: any) {
        console.error(`GET /api/fields/${params.id} error:`, error);

        if (error.name === "NotFoundError") {
            return NextResponse.json(
                { success: false, error: "Field not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch field" },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/fields/[id]
 * Update a specific field
 */
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        const field = await fieldService.updateField(params.id, body);

        return NextResponse.json({
            success: true,
            data: field,
        });
    } catch (error: any) {
        console.error(`PATCH /api/fields/${params.id} error:`, error);

        if (error.name === "NotFoundError") {
            return NextResponse.json(
                { success: false, error: "Field not found" },
                { status: 404 }
            );
        }

        if (error.name === "ValidationError") {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: error.message || "Failed to update field" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/fields/[id]
 * Delete a specific field
 */
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await fieldService.deleteField(params.id);

        return NextResponse.json({
            success: true,
            message: "Field deleted successfully",
        });
    } catch (error: any) {
        console.error(`DELETE /api/fields/${params.id} error:`, error);

        if (error.name === "NotFoundError") {
            return NextResponse.json(
                { success: false, error: "Field not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: false, error: error.message || "Failed to delete field" },
            { status: 500 }
        );
    }
}
