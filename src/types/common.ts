// Result types for API responses
export type Success<T> = { data: T; error: null };
export type Failure<E> = { data: null; error: E };
export type Result<T, E = Error> = Success<T> | Failure<E>;

// Pagination response type (matching backend structure)
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    first: boolean;
    last: boolean;
}

// Base entity with common fields
export interface BaseEntity {
    id: number;
}

// API request parameter types
export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}
