import type { Result, PageResponse } from "./common";

// LRU Cache hook types
export interface LRUCacheConfig {
    maxSize?: number;
}

export interface LRUCacheReturn<T> {
    cachedPages: Map<number, T[]>;
    cacheOrder: number[];
    addToCache: (page: number, data: T[]) => void;
    getCachedData: (page: number) => T[] | undefined;
    updateCacheOrder: (page: number) => void;
}

// Data fetching hook types
export interface DataFetchingPageInfo {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    first: boolean;
    last: boolean;
}

export interface UseDataFetchingProps<T> {
    fetchFn: (page: number) => Promise<Result<PageResponse<T>>>;
    dependencies?: React.DependencyList;
    initialPageSize?: number;
    maxCacheSize?: number;
}

export interface UseDataFetchingReturn<T> {
    data: T[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    pageInfo: DataFetchingPageInfo;
    fetchData: (page: number) => Promise<void>;
}

// Pagination hook types
export interface PaginationPageInfo {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    first: boolean;
    last: boolean;
}

export interface UsePaginationProps {
    pageInfo: PaginationPageInfo;
    currentPage: number;
    onFetch: (page: number) => void;
}

export interface UsePaginationReturn {
    handlePreviousPage: () => void;
    handleNextPage: () => void;
}