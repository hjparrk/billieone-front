import { useState } from "react";
import { Modal } from "../common/Modal";
import { lessonService } from "../../services/lessonService";
import type { CreateLessonRequest, CreateLessonModalProps } from "../../types";
import styles from "../../styles/components/lesson/CreateLessonModal.module.css";

export function CreateLessonModal({
    isOpen,
    onClose,
    teacherId,
}: CreateLessonModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        days: "",
        time: "",
        room: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation - check if fields are not empty
        if (
            !formData.title.trim() ||
            !formData.days.trim() ||
            !formData.time.trim() ||
            !formData.room.trim()
        ) {
            alert("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            const request: CreateLessonRequest = {
                title: formData.title,
                schedule: {
                    days: formData.days.split(",").map((day) => day.trim()),
                    time: formData.time,
                    room: formData.room,
                },
                teacherId,
            };

            const result = await lessonService.createLesson(request);

            if (result.error) {
                alert("Failed to create class.");
                return;
            }

            // Reset form and close modal
            setFormData({ title: "", days: "", time: "", room: "" });
            onClose();

            // Refresh page
            window.location.reload();
        } catch (error) {
            console.error("Failed to create lesson:", error);
            alert("Failed to create class.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setFormData({ title: "", days: "", time: "", room: "" });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleModalClose}
            title="Create New Class"
            size="md"
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="title" className={styles.label}>
                        Class Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                            handleInputChange("title", e.target.value)
                        }
                        className={styles.input}
                        placeholder="Maths 101"
                        disabled={isSubmitting}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="days" className={styles.label}>
                        Days (comma separated) *
                    </label>
                    <input
                        type="text"
                        id="days"
                        value={formData.days}
                        onChange={(e) =>
                            handleInputChange("days", e.target.value)
                        }
                        className={styles.input}
                        placeholder="Mon, Wed, Fri"
                        disabled={isSubmitting}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="time" className={styles.label}>
                        Time *
                    </label>
                    <input
                        type="text"
                        id="time"
                        value={formData.time}
                        onChange={(e) =>
                            handleInputChange("time", e.target.value)
                        }
                        className={styles.input}
                        placeholder="09:00-10:30"
                        disabled={isSubmitting}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="room" className={styles.label}>
                        Classroom *
                    </label>
                    <input
                        type="text"
                        id="room"
                        value={formData.room}
                        onChange={(e) =>
                            handleInputChange("room", e.target.value)
                        }
                        className={styles.input}
                        placeholder="A101"
                        disabled={isSubmitting}
                    />
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={handleModalClose}
                        className={styles.cancelButton}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
