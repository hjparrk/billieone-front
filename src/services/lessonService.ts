import { api } from "../api/axiosConfig";
import type {
    Result,
    Lesson,
    LessonSummary,
    Student,
    PageResponse,
    PaginationParams,
} from "../types";
import type { CreateLessonRequest } from "../types/lesson";

export const lessonService = {
    async getLessons(
        params: PaginationParams = {}
    ): Promise<Result<PageResponse<Lesson>>> {
        const { page = 0, size = 10, sort } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            ...(sort && { sort }),
        });

        return api.get<PageResponse<Lesson>>(`/lessons?${queryParams}`);
    },

    async getLessonsByTeacherId(
        teacherId: number,
        params: PaginationParams = {}
    ): Promise<Result<PageResponse<LessonSummary>>> {
        const { page = 0, size = 10, sort } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            ...(sort && { sort }),
        });

        return api.get<PageResponse<LessonSummary>>(
            `/teachers/${teacherId}/lessons?${queryParams}`
        );
    },

    async createLesson(request: CreateLessonRequest): Promise<Result<Lesson>> {
        return api.post<Lesson>("/lessons", request);
    },

    async getLessonStudents(lessonId: number): Promise<Result<PageResponse<Student>>> {
        return api.get<PageResponse<Student>>(`/lessons/${lessonId}/students`);
    },
};
