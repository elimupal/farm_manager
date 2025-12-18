import { container } from '@/config/di-container';
import { NextResponse } from 'next/server';

/**
 * GET /api/fields
 * Get all fields (optionally filtered by farmId)
 * Example: Demonstrates API Route using Clean Architecture
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const farmId = searchParams.get('farmId');

        const useCase = container.getFieldsUseCase;

        // Get fields by farm or all fields
        const result = farmId
            ? await useCase.executeByFarmId(farmId)
            : await useCase.executeAll();

        if (result.isFailure) {
            return NextResponse.json(
                { success: false, error: result.error.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.value,
            count: result.value.length,
        });
    } catch (error: any) {
        console.error('GET /api/fields error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch fields' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/fields
 * Create a new field
 * Example: Demonstrates API Route using Clean Architecture
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const useCase = container.createFieldUseCase;
        const result = await useCase.execute(body);

        if (result.isFailure) {
            return NextResponse.json(
                { success: false, error: result.error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: result.value,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('POST /api/fields error:', error);

        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create field' },
            { status: 500 }
        );
    }
}
