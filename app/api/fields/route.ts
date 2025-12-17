import { fieldService } from "@/lib/services";
import { NextResponse } from "next/server";

/**
 * GET /api/fields
 * Get all fields
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const farmId = searchParams.get("farmId");

        if (!farmId) {
            return NextResponse.json(
                { error: "farmId is required" },
                { status: 400 }
            );
        }

        const fields = await fieldService.getFieldsByFarm(farmId);

        return NextResponse.json({
            success: true,
            data: fields,
            count: fields.length,
        });
    } catch (error: any) {
        console.error("GET /api/fields error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch fields" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/fields
 * Create a new field
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const field = await fieldService.createField(body);

        return NextResponse.json(
            {
                success: true,
                data: field,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("POST /api/fields error:", error);

        if (error.name === "ValidationError") {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: error.message || "Failed to create field" },
            { status: 500 }
        );
    }
}
