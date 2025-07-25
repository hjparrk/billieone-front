import { useState } from "react";
import { useParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { lessonService } from "../../services/lessonService";
import { useDataFetching } from "../../hooks/useDataFetching";
import { usePagination } from "../../hooks/usePagination";
import { DataTable } from "../common/DataTable";
import { Pagination } from "../common/Pagination";
import { CreateLessonModal } from "../lesson/CreateLessonModal";
import { EditEnrollmentModal } from "../lesson/EditEnrollmentModal";
import type { LessonSummary } from "../../types";
import styles from "../../styles/components/teacher/TeacherDashboard.module.css";

const columnHelper = createColumnHelper<LessonSummary>();

export function TeacherDashboard() {
    const { teacherId } = useParams<{ teacherId: string }>();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditEnrollmentModalOpen, setIsEditEnrollmentModalOpen] =
        useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(
        null
    );

    const {
        data: lessons,
        loading,
        error,
        currentPage,
        pageInfo,
        fetchData,
    } = useDataFetching<LessonSummary>({
        fetchFn: async (page: number) => {
            if (!teacherId) {
                return {
                    data: null,
                    error: new Error("Teacher ID is required"),
                };
            }
            return lessonService.getLessonsByTeacherId(parseInt(teacherId), {
                page,
                size: 10,
            });
        },
        dependencies: [teacherId],
    });

    const { handlePreviousPage, handleNextPage } = usePagination({
        pageInfo,
        currentPage,
        onFetch: fetchData,
    });

    const columns = [
        columnHelper.accessor("title", {
            header: "Title",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("schedule.days", {
            header: "Days",
            cell: (info) => info.getValue().join(", "),
        }),
        columnHelper.accessor("schedule.time", {
            header: "Time",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("schedule.room", {
            header: "Room",
            cell: (info) => info.getValue(),
        }),
        columnHelper.display({
            id: "actions",
            header: "",
            cell: (info) => (
                <button
                    className={styles.editButton}
                    onClick={() => {
                        setSelectedLessonId(info.row.original.id);
                        setIsEditEnrollmentModalOpen(true);
                    }}
                >
                    Edit
                </button>
            ),
        }),
    ];

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading lessons...</p>
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
                <div className={styles.headerContent}>
                    <div>
                        <h2 className={styles.title}>Teacher Dashboard</h2>
                        <p className={styles.subtitle}>
                            {pageInfo.totalElements} class
                            {pageInfo.totalElements !== 1 ? "es" : ""} assigned
                        </p>
                    </div>
                    <button
                        className={styles.addButton}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Add New Class
                    </button>
                </div>
            </div>

            <DataTable
                data={lessons}
                columns={columns}
                emptyMessage="No classes found"
                emptyDescription="This teacher has no classes assigned at the moment."
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

            <CreateLessonModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                teacherId={teacherId ? parseInt(teacherId) : 0}
            />

            <EditEnrollmentModal
                isOpen={isEditEnrollmentModalOpen}
                onClose={() => {
                    setIsEditEnrollmentModalOpen(false);
                    setSelectedLessonId(null);
                }}
                lessonId={selectedLessonId || 0}
            />
        </div>
    );
}
