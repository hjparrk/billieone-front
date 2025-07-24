import { useState, useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender,
} from "@tanstack/react-table";
import { lessonService } from "../../services/lessonService";
import type { Lesson, Result, PageResponse } from "../../types";
import styles from "../../styles/components/lesson/LessonList.module.css";

const columnHelper = createColumnHelper<Lesson>();

const MAX_CACHED_PAGES = 10;

export function LessonList() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [cachedPages, setCachedPages] = useState<Map<number, Lesson[]>>(
        new Map()
    );
    const [cacheOrder, setCacheOrder] = useState<number[]>([]);
    const [pageInfo, setPageInfo] = useState({
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 10,
        first: true,
        last: true,
    });

    const updateCacheOrder = (page: number) => {
        setCacheOrder((prev) => {
            const newOrder = prev.filter((p) => p !== page);
            newOrder.push(page); // Move to end (most recently used)
            return newOrder;
        });
    };

    const addToCache = (page: number, data: Lesson[]) => {
        setCachedPages((prev) => {
            const newCache = new Map(prev);
            newCache.set(page, data);

            // LRU eviction if cache is full
            if (newCache.size > MAX_CACHED_PAGES) {
                const oldestPage = cacheOrder[0];
                newCache.delete(oldestPage);
                setCacheOrder((current) => current.slice(1));
            }

            return newCache;
        });
        updateCacheOrder(page);
    };

    const fetchLessons = async (page: number = 0) => {
        setError(null);

        // Check if page is already cached
        if (cachedPages.has(page)) {
            const cachedData = cachedPages.get(page)!;
            setLessons(cachedData);
            setCurrentPage(page);
            updateCacheOrder(page);

            // Update page info for navigation buttons
            setPageInfo((prev) => ({
                ...prev,
                currentPage: page,
                first: page === 0,
                last: page >= prev.totalPages - 1,
            }));
            return;
        }

        // Not in cache, fetch from backend
        setLoading(true);
        const result: Result<PageResponse<Lesson>> =
            await lessonService.getLessons({ page, size: 10 });

        if (result.error) {
            setError("Failed to load lessons. Please try again.");
        } else {
            // Extract lessons from PageResponse content
            if (result.data && Array.isArray(result.data.content)) {
                const lessonsData = result.data.content;

                setLessons(lessonsData);
                setPageInfo({
                    totalElements: result.data.totalElements,
                    totalPages: result.data.totalPages,
                    currentPage: result.data.currentPage,
                    pageSize: result.data.pageSize,
                    first: result.data.first,
                    last: result.data.last,
                });
                setCurrentPage(result.data.currentPage);

                // Add to cache
                addToCache(page, lessonsData);
            } else {
                setLessons([]);
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchLessons(0);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const columns = [
        columnHelper.accessor("title", {
            header: "Title",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("teacher", {
            header: "Teacher",
            cell: (info) => {
                const teacher = info.getValue();
                return teacher.name;
            },
        }),
        columnHelper.accessor("teacher.subject", {
            header: "Subject",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("schedule", {
            header: "Schedule",
            cell: (info) => {
                const schedule = info.getValue();
                return (
                    <div className={styles.schedule}>
                        <div>{schedule.days.join(", ")}</div>
                        <div>{schedule.time}</div>
                        <div>Room: {schedule.room}</div>
                    </div>
                );
            },
        }),
    ];

    const table = useReactTable({
        data: lessons,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handlePreviousPage = () => {
        if (!pageInfo.first) {
            fetchLessons(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (!pageInfo.last) {
            fetchLessons(currentPage + 1);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading classes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <p>{error}</p>
                    <button
                        className={styles.retryButton}
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Classes</h2>
                <p className={styles.subtitle}>
                    {pageInfo.totalElements} class
                    {pageInfo.totalElements !== 1 ? "s" : ""} opened
                </p>
            </div>

            {!Array.isArray(lessons) || lessons.length === 0 ? (
                <div className={styles.empty}>
                    <h3>No classes found</h3>
                    <p>There are no classes available at the moment.</p>
                </div>
            ) : (
                <>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className={styles.th}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className={styles.td}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.pagination}>
                        <span className={styles.paginationInfo}>
                            Page {currentPage + 1} of {pageInfo.totalPages}
                        </span>
                        <div className={styles.paginationButtons}>
                            <button
                                className={styles.paginationButton}
                                disabled={pageInfo.first}
                                onClick={handlePreviousPage}
                            >
                                Previous
                            </button>
                            <button
                                className={styles.paginationButton}
                                disabled={pageInfo.last}
                                onClick={handleNextPage}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
