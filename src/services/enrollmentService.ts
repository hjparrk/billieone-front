import { api } from "../api/axiosConfig";
import type { Result, CreateEnrollmentRequest, Enrollment } from "../types";

export const enrollmentService = {
    async enrollStudent(
        lessonId: number,
        studentId: number
    ): Promise<Result<Enrollment>> {
        const request: CreateEnrollmentRequest = {
            lessonId,
            studentId,
        };

        return api.post<Enrollment>("/enrollments", request);
    },

    async unenrollStudent(
        lessonId: number,
        studentId: number
    ): Promise<Result<void>> {
        const request: CreateEnrollmentRequest = {
            lessonId,
            studentId,
        };

        return api.delete("/enrollments", request);
    },
};
