import { Link } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { lessonService } from "../../services/lessonService";
import { useDataFetching } from "../../hooks/useDataFetching";
import { usePagination } from "../../hooks/usePagination";
import { DataTable } from "../common/DataTable";
import { Pagination } from "../common/Pagination";
import type { Lesson } from "../../types";
import styles from "../../styles/components/lesson/LessonList.module.css";

const columnHelper = createColumnHelper<Lesson>();

const columns = [
    columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("teacher", {
        header: "Teacher",
        cell: (info) => {
            const teacher = info.getValue();
            return (
                <Link
                    to={`/teachers/${teacher.id}`}
                    className={styles.teacherLink}
                >
                    {teacher.name}
                </Link>
            );
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

export function LessonList() {
    const {
        data: lessons,
        loading,
        error,
        currentPage,
        pageInfo,
        fetchData,
    } = useDataFetching<Lesson>({
        fetchFn: async (page: number) =>
            lessonService.getLessons({ page, size: 10 }),
    });

    const { handlePreviousPage, handleNextPage } = usePagination({
        pageInfo,
        currentPage,
        onFetch: fetchData,
    });

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

            <DataTable
                data={lessons}
                columns={columns}
                emptyMessage="No classes found"
                emptyDescription="There are no classes available at the moment."
                containerClassName={styles.tableContainer}
                tableClassName={styles.table}
                headerClassName={styles.th}
                cellClassName={styles.td}
                emptyClassName={styles.empty}
            />

            <Pagination
                pageInfo={pageInfo}
                currentPage={currentPage}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                className={styles.pagination}
                infoClassName={styles.paginationInfo}
                buttonsClassName={styles.paginationButtons}
                buttonClassName={styles.paginationButton}
            />
        </div>
    );
}
