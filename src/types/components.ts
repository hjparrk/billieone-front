import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { PaginationPageInfo } from "./hooks";

// Modal component props
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg";
    className?: string;
}

// Lesson component props
export interface EditEnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    lessonId: number;
}

export interface CreateLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    teacherId: number;
}

// Data table component props
export interface DataTableProps<T> {
    data: T[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<T, any>[];
    emptyMessage?: string;
    emptyDescription?: string;
    containerClassName?: string;
    tableClassName?: string;
    headerClassName?: string;
    cellClassName?: string;
    emptyClassName?: string;
}

// Pagination component props
export interface PaginationProps {
    pageInfo: PaginationPageInfo;
    currentPage: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
    className?: string;
    infoClassName?: string;
    buttonsClassName?: string;
    buttonClassName?: string;
}