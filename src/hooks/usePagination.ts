import { useCallback } from "react";

export interface PageInfo {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    first: boolean;
    last: boolean;
}

export interface UsePaginationProps {
    pageInfo: PageInfo;
    currentPage: number;
    onFetch: (page: number) => void;
}

export interface UsePaginationReturn {
    handlePreviousPage: () => void;
    handleNextPage: () => void;
}

export function usePagination({
    pageInfo,
    currentPage,
    onFetch,
}: UsePaginationProps): UsePaginationReturn {
    const handlePreviousPage = useCallback(() => {
        if (!pageInfo.first) {
            onFetch(currentPage - 1);
        }
    }, [pageInfo.first, currentPage, onFetch]);

    const handleNextPage = useCallback(() => {
        if (!pageInfo.last) {
            onFetch(currentPage + 1);
        }
    }, [pageInfo.last, currentPage, onFetch]);

    return {
        handlePreviousPage,
        handleNextPage,
    };
}
