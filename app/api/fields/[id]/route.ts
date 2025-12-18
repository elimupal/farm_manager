import { container } from '@/config/di-container';
import { NextResponse } from 'next/server';

/**
 * GET /api/fields/[id]
 * Get a specific field by ID
 * Example: Demonstrates API Route using Clean Architecture
 */
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const useCase = container.getFieldsUseCase;
        const result = await useCase.executeAll();

        if (result.isFailure) {
            return NextResponse.json(
                { success: false, error: result.error.message },
                { status: 404 }
            );
        }

        // Find the specific field by ID
        const field = result.value.find(f => f.id === params.id);

        if (!field) {
            return NextResponse.json(
                { success: false, error: 'Field not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: field,
        });
    } catch (error: any) {
        console.error(`GET /api/fields/${params.id} error:`, error);

        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch field' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/fields/[id]
 * Update a specific field
 * Example: Demonstrates API Route using Clean Architecture
 */
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        const useCase = container.updateFieldUseCase;
        const result = await useCase.execute(params.id, body);

        if (result.isFailure) {
            const statusCode = result.error.name === 'NotFoundError' ? 404 : 400;
            return NextResponse.json(
                { success: false, error: result.error.message },
                { status: statusCode }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.value,
        });
    } catch (error: any) {
        console.error(`PATCH /api/fields/${params.id} error:`, error);

        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update field' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/fields/[id]
 * Delete a specific field
 * Example: Demonstrates API Route using Clean Architecture
 */
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const useCase = container.deleteFieldUseCase;
        const result = await useCase.execute(params.id);

        if (result.isFailure) {
            return NextResponse.json(
                { success: false, error: result.error.message },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Field deleted successfully',
        });
    } catch (error: any) {
        console.error(`DELETE /api/fields/${params.id} error:`, error);

        return NextResponse.json(
            { success: false, error: error.message || 'Failed to delete field' },
            { status: 500 }
        );
    }
}
