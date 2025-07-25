import { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { lessonService } from "../../services/lessonService";
import { enrollmentService } from "../../services/enrollmentService";
import { studentService } from "../../services/studentService";
import type { Student, EditEnrollmentModalProps } from "../../types";
import styles from "../../styles/components/lesson/EditEnrollmentModal.module.css";

export function EditEnrollmentModal({
    isOpen,
    onClose,
    lessonId,
}: EditEnrollmentModalProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [removingStudentIds, setRemovingStudentIds] = useState<Set<number>>(
        new Set()
    );

    // Student search states
    const [searchEmail, setSearchEmail] = useState("");
    const [searchedStudent, setSearchedStudent] = useState<Student | null>(
        null
    );
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        if (isOpen && lessonId) {
            fetchStudents();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, lessonId]);

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);

        const result = await lessonService.getLessonStudents(lessonId);

        if (result.error) {
            setError("Failed to load students.");
        } else {
            setStudents(result.data?.content || []);
        }

        setLoading(false);
    };

    const handleModalClose = () => {
        setStudents([]);
        setError(null);
        setRemovingStudentIds(new Set());
        // Reset search states
        setSearchEmail("");
        setSearchedStudent(null);
        setSearching(false);
        setSearchError(null);
        setEnrolling(false);
        onClose();
    };

    const handleRemoveStudent = async (student: Student) => {
        const confirmed = window.confirm(
            `Remove ${student.name} from this class?`
        );
        if (!confirmed) return;

        setRemovingStudentIds((prev) => new Set(prev).add(student.id));

        const result = await enrollmentService.unenrollStudent(
            lessonId,
            student.id
        );

        if (result.error) {
            console.error("Unenroll error:", result.error);
            alert(`Failed to remove student from class: ${result.error}`);
        } else {
            // Remove student from local state
            setStudents((prev) => prev.filter((s) => s.id !== student.id));
        }

        setRemovingStudentIds((prev) => {
            const next = new Set(prev);
            next.delete(student.id);
            return next;
        });
    };

    const handleSearchStudent = async () => {
        if (!searchEmail.trim()) {
            setSearchError("Please enter an email address.");
            return;
        }

        setSearching(true);
        setSearchError(null);
        setSearchedStudent(null);

        const result = await studentService.getStudentByEmail(
            searchEmail.trim()
        );

        if (result.error) {
            setSearchError("Student not found with this email.");
        } else {
            // Check if student is already enrolled
            const isAlreadyEnrolled = students.some(
                (s) => s.id === result.data?.id
            );
            if (isAlreadyEnrolled) {
                setSearchError(
                    "This student is already enrolled in this class."
                );
            } else {
                setSearchedStudent(result.data!);
            }
        }

        setSearching(false);
    };

    const handleEnrollStudent = async () => {
        if (!searchedStudent) return;

        const confirmed = window.confirm(
            `Enroll ${searchedStudent.name} in this class?`
        );
        if (!confirmed) return;

        setEnrolling(true);

        const result = await enrollmentService.enrollStudent(
            lessonId,
            searchedStudent.id
        );

        if (result.error) {
            console.error("Enroll error:", result.error);
            alert(`Failed to enroll student: ${result.error}`);
        } else {
            // Add student to local state
            setStudents((prev) => [...prev, searchedStudent]);

            // Reset search form
            setSearchEmail("");
            setSearchedStudent(null);
            setSearchError(null);
        }

        setEnrolling(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleModalClose}
            title="Class Enrollment"
            size="md"
        >
            <div className={styles.container}>
                {loading && (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading students...</p>
                    </div>
                )}

                {error && (
                    <div className={styles.error}>
                        <p>{error}</p>
                        <button
                            className={styles.retryButton}
                            onClick={fetchStudents}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Add Student Section */}
                        <div className={styles.addStudentSection}>
                            <h3 className={styles.sectionTitle}>Add Student</h3>
                            <div className={styles.searchForm}>
                                <input
                                    type="email"
                                    value={searchEmail}
                                    onChange={(e) =>
                                        setSearchEmail(e.target.value)
                                    }
                                    placeholder="Enter student email"
                                    className={styles.searchInput}
                                    disabled={searching || enrolling}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearchStudent();
                                        }
                                    }}
                                />
                                <button
                                    onClick={handleSearchStudent}
                                    disabled={searching || enrolling}
                                    className={styles.searchButton}
                                >
                                    {searching ? "Searching..." : "Search"}
                                </button>
                            </div>

                            {searchError && (
                                <div className={styles.searchError}>
                                    {searchError}
                                </div>
                            )}

                            {searchedStudent && (
                                <div className={styles.searchResult}>
                                    <div className={styles.studentInfo}>
                                        <span className={styles.studentName}>
                                            {searchedStudent.name}
                                        </span>
                                        <span className={styles.studentEmail}>
                                            {searchedStudent.email}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleEnrollStudent}
                                        disabled={enrolling}
                                        className={styles.enrollButton}
                                    >
                                        {enrolling ? "Enrolling..." : "Enroll"}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Student List Section */}
                        {students.length === 0 ? (
                            <div className={styles.empty}>
                                <p>No students enrolled in this class.</p>
                            </div>
                        ) : (
                            <div className={styles.studentList}>
                                <h3 className={styles.listTitle}>
                                    Enrolled Students ({students.length})
                                </h3>
                                <div className={styles.students}>
                                    {students.map((student) => (
                                        <div
                                            key={student.id}
                                            className={styles.studentItem}
                                        >
                                            <div className={styles.studentInfo}>
                                                <span
                                                    className={
                                                        styles.studentName
                                                    }
                                                >
                                                    {student.name}
                                                </span>
                                                <span
                                                    className={
                                                        styles.studentEmail
                                                    }
                                                >
                                                    {student.email}
                                                </span>
                                            </div>
                                            <button
                                                className={styles.removeButton}
                                                onClick={() =>
                                                    handleRemoveStudent(student)
                                                }
                                                disabled={removingStudentIds.has(
                                                    student.id
                                                )}
                                                title="Remove student from class"
                                            >
                                                {removingStudentIds.has(
                                                    student.id
                                                )
                                                    ? "..."
                                                    : "X"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className={styles.actions}>
                    <button
                        className={styles.closeButton}
                        onClick={handleModalClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
