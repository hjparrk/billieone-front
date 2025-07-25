export interface CreateEnrollmentRequest {
    lessonId: number;
    studentId: number;
}

export interface Enrollment {
    id: number;
    lesson: {
        id: number;
        title: string;
    };
    student: {
        id: number;
        name: string;
        email: string;
    };
    enrolledAt: string;
}