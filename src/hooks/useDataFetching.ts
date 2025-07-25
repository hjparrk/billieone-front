import { useState, useEffect, useCallback } from "react";
import { useLRUCache } from "./useLRUCache";
import type { Result, PageResponse } from "../types";

export interface PageInfo {
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
    pageInfo: PageInfo;
    fetchData: (page: number) => Promise<void>;
}

export function useDataFetching<T>({
    fetchFn,
    dependencies = [],
    initialPageSize = 10,
    maxCacheSize = 10,
}: UseDataFetchingProps<T>): UseDataFetchingReturn<T> {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: initialPageSize,
        first: true,
        last: true,
    });

    const { addToCache, getCachedData, updateCacheOrder } = useLRUCache<T>({
        maxSize: maxCacheSize,
    });

    const handleCachedData = useCallback(
        (page: number): boolean => {
            const cachedData = getCachedData(page);
            if (!cachedData) return false;

            setData(cachedData);
            setCurrentPage(page);
            updateCacheOrder(page);

            setPageInfo((prev) => ({
                ...prev,
                currentPage: page,
                first: page === 0,
                last: page >= prev.totalPages - 1,
            }));
            return true;
        },
        [getCachedData, updateCacheOrder]
    );

    const handleApiData = useCallback(
        (responseData: PageResponse<T>, page: number) => {
            if (
                !responseData?.content ||
                !Array.isArray(responseData.content)
            ) {
                setData([]);
                return;
            }

            const contentData = responseData.content;
            setData(contentData);
            setPageInfo({
                totalElements: responseData.totalElements,
                totalPages: responseData.totalPages,
                currentPage: responseData.currentPage,
                pageSize: responseData.pageSize,
                first: responseData.first,
                last: responseData.last,
            });
            setCurrentPage(responseData.currentPage);
            addToCache(page, contentData);
        },
        [addToCache]
    );

    const fetchData = useCallback(
        async (page: number = 0) => {
            setError(null);

            // Early return for cached data
            if (handleCachedData(page)) return;

            // Fetch from API
            setLoading(true);
            const result = await fetchFn(page);

            if (result.error) {
                setError("Failed to load data. Please try again.");
            } else {
                handleApiData(result.data, page);
            }

            setLoading(false);
        },
        [fetchFn, handleCachedData, handleApiData]
    );

    useEffect(() => {
        fetchData(0);
    }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        data,
        loading,
        error,
        currentPage,
        pageInfo,
        fetchData,
    };
}
