import type { BaseEntity } from "./common";

// Schedule JSONB type
export interface Schedule {
    days: string[];
    time: string;
    room: string;
}

// Teacher entity
export interface Teacher {
    id: number;
    name: string;
    subject: string;
}

// Basic Lesson entity (updated to match backend structure)
export interface Lesson extends BaseEntity {
    title: string;
    teacher: Teacher;
    schedule: Schedule;
}
