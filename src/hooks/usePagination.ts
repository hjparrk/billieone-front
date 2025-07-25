import { useCallback } from "react";
import type { UsePaginationProps, UsePaginationReturn } from "../types";

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
