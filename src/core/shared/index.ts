/**
 * Shared types and utilities
 */

export * from './result';

/**
 * Base interface for value objects
 */
export interface ValueObject<T> {
    readonly value: T;
    equals(other: ValueObject<T>): boolean;
}

/**
 * Base interface for entities
 */
export interface Entity {
    readonly id: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
