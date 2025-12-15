import { Prisma } from "@prisma/client";

/**
 * Standard service response type
 */
export type ServiceResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

/**
 * Pagination parameters
 */
export type PaginationParams = {
    page?: number;
    limit?: number;
    orderBy?: string;
    order?: "asc" | "desc";
};

/**
 * Paginated response
 */
export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

/**
 * Date range filter
 */
export type DateRangeFilter = {
    from?: Date;
    to?: Date;
};

/**
 * Common query options
 */
export type QueryOptions = {
    include?: Record<string, boolean | object>;
    select?: Record<string, boolean>;
};

/**
 * Service error types
 */
export class ServiceError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number
    ) {
        super(message);
        this.name = "ServiceError";
    }
}

export class NotFoundError extends ServiceError {
    constructor(resource: string, id?: string) {
        super(
            id ? `${resource} with id ${id} not found` : `${resource} not found`,
            "NOT_FOUND",
            404
        );
        this.name = "NotFoundError";
    }
}

export class ValidationError extends ServiceError {
    constructor(message: string, public fields?: Record<string, string>) {
        super(message, "VALIDATION_ERROR", 400);
        this.name = "ValidationError";
    }
}

export class UnauthorizedError extends ServiceError {
    constructor(message: string = "Unauthorized") {
        super(message, "UNAUTHORIZED", 401);
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends ServiceError {
    constructor(message: string = "Forbidden") {
        super(message, "FORBIDDEN", 403);
        this.name = "ForbiddenError";
    }
}

export class ConflictError extends ServiceError {
    constructor(message: string) {
        super(message, "CONFLICT", 409);
        this.name = "ConflictError";
    }
}
