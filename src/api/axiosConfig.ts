import axios from "axios";
import { tryCatch } from "../utils/tryCatch";
import type { Result } from "../types/common";

const axiosInstance = axios.create({
    baseURL: "/api",
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
