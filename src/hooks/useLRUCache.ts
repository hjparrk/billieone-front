import { useState, useCallback } from "react";
import type { LRUCacheConfig, LRUCacheReturn } from "../types";

export function useLRUCache<T>({
    maxSize = 10,
}: LRUCacheConfig = {}): LRUCacheReturn<T> {
    const [cachedPages, setCachedPages] = useState<Map<number, T[]>>(new Map());
    const [cacheOrder, setCacheOrder] = useState<number[]>([]);

    const updateCacheOrder = useCallback((page: number) => {
        setCacheOrder((prev) => {
            const newOrder = prev.filter((p) => p !== page);
            newOrder.push(page);
            return newOrder;
        });
    }, []);

    const addToCache = useCallback(
        (page: number, data: T[]) => {
            setCachedPages((prev) => {
                const newCache = new Map(prev);
                newCache.set(page, data);

                if (newCache.size > maxSize) {
                    const oldestPage = cacheOrder[0];
                    newCache.delete(oldestPage);
                    setCacheOrder((current) => current.slice(1));
                }

                return newCache;
            });
            updateCacheOrder(page);
        },
        [maxSize, cacheOrder, updateCacheOrder]
    );

    const getCachedData = useCallback(
        (page: number): T[] | undefined => {
            return cachedPages.get(page);
        },
        [cachedPages]
    );

    return {
        cachedPages,
        cacheOrder,
        addToCache,
        getCachedData,
        updateCacheOrder,
    };
}
