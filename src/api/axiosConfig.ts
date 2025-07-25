import axios from "axios";
import { tryCatch } from "../utils/tryCatch";
import type { Result } from "../types/common";

const getBaseURL = () => {
    if (import.meta.env.DEV) {
        // 개발환경에서는 프록시 사용
        return "/api";
    } else {
        // 프로덕션환경에서는 환경변수에서 백엔드 URL 사용
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        return backendUrl ? `${backendUrl}/api` : "/api";
    }
};

const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export const api = {
    async get<T>(endpoint: string): Promise<Result<T>> {
        return tryCatch(
            axiosInstance.get<T>(endpoint).then((response) => response.data)
        );
    },

    async post<T, D = unknown>(endpoint: string, data?: D): Promise<Result<T>> {
        return tryCatch(
            axiosInstance
                .post<T>(endpoint, data)
                .then((response) => response.data)
        );
    },

    async put<T, D = unknown>(endpoint: string, data?: D): Promise<Result<T>> {
        return tryCatch(
            axiosInstance
                .put<T>(endpoint, data)
                .then((response) => response.data)
        );
    },

    async delete<D = unknown>(endpoint: string, data?: D): Promise<Result<void>> {
        return tryCatch(
            axiosInstance
                .delete(endpoint, { data })
                .then(() => undefined)
        );
    },
};
