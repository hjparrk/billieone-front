import type { BaseEntity } from "./common";
import type { Teacher } from "./teacher";

// Schedule JSONB type
export interface Schedule {
    days: string[];
    time: string;
    room: string;
}

// LessonSummary for teacher dashboard (without teacher info)
export interface LessonSummary extends BaseEntity {
    title: string;
    schedule: Schedule;
}

// Basic Lesson entity (updated to match backend structure)
export interface Lesson extends BaseEntity {
    title: string;
    teacher: Teacher;
    schedule: Schedule;
}

export interface CreateLessonRequest {
    title: string;
    schedule: {
        days: string[];
        time: string;
        room: string;
    };
    teacherId: number;
}
