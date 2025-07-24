import { api } from "../api/axiosConfig";
import type { Result, Lesson, PageResponse, PaginationParams } from "../types";

export const lessonService = {
    async getLessons(params: PaginationParams = {}): Promise<Result<PageResponse<Lesson>>> {
        const { page = 0, size = 10, sort } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            ...(sort && { sort }),
        });
        
        return api.get<PageResponse<Lesson>>(`/lessons?${queryParams}`);
    },
};
