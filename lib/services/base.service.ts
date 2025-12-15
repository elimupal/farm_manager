import { prisma } from "@/lib/prisma";
import type { PrismaClient } from "@prisma/client";
import {
    ServiceError,
    NotFoundError,
    ValidationError,
    type PaginationParams,
    type PaginatedResponse,
} from "./types";

/**
 * Base service class with common functionality
 */
export abstract class BaseService {
    protected db: PrismaClient;

    constructor() {
        this.db = prisma;
    }

    /**
     * Handle service errors and convert to standard format
     */
    protected handleError(error: unknown): never {
        if (error instanceof ServiceError) {
            throw error;
        }

        if (error instanceof Error) {
            throw new ServiceError(error.message);
        }

        throw new ServiceError("An unexpected error occurred");
    }

    /**
     * Validate required fields
     */
    protected validateRequired(
        data: Record<string, any>,
        fields: string[]
    ): void {
        const missing = fields.filter((field) => !data[field]);

        if (missing.length > 0) {
            throw new ValidationError(
                `Missing required fields: ${missing.join(", ")}`,
                missing.reduce((acc, field) => ({ ...acc, [field]: "Required" }), {})
            );
        }
    }

    /**
     * Check if resource exists
     */
    protected async checkExists(
        model: any,
        id: string,
        resourceName: string
    ): Promise<void> {
        const exists = await model.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundError(resourceName, id);
        }
    }

    /**
     * Apply pagination to query
     */
    protected getPaginationParams(params?: PaginationParams) {
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const skip = (page - 1) * limit;

        return {
            skip,
            take: limit,
            orderBy: params?.orderBy
                ? { [params.orderBy]: params.order || "asc" }
                : undefined,
        };
    }

    /**
     * Create paginated response
     */
    protected createPaginatedResponse<T>(
        data: T[],
        total: number,
        params?: PaginationParams
    ): PaginatedResponse<T> {
        const page = params?.page || 1;
        const limit = params?.limit || 10;

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Execute in transaction
     */
    protected async transaction<T>(
        callback: (tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) => Promise<T>
    ): Promise<T> {
        return this.db.$transaction(callback);
    }

    /**
     * Log service action (can be extended for proper logging)
     */
    protected log(action: string, data?: any): void {
        if (process.env.NODE_ENV === "development") {
            console.log(`[${this.constructor.name}] ${action}`, data || "");
        }
    }
}
