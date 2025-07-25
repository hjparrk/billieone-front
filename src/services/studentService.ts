import { api } from "../api/axiosConfig";
import type { Result, Student } from "../types";

export const studentService = {
    async getStudentByEmail(email: string): Promise<Result<Student>> {
        return api.get<Student>(`/students/search?email=${encodeURIComponent(email)}`);
    },
};