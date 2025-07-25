import { useEffect, useRef } from "react";
import type { ModalProps } from "../../types";
import styles from "../../styles/components/common/Modal.module.css";

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    className = "",
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current =
                document.activeElement as HTMLElement;
            modalRef.current?.focus();
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscapeKey);
        return () => document.removeEventListener("keydown", handleEscapeKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className={styles.backdrop}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                ref={modalRef}
                className={`${styles.modal} ${styles[size]} ${className}`}
                tabIndex={-1}
            >
                <div className={styles.header}>
                    <h2 id="modal-title" className={styles.title}>
                        {title}
                    </h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
}
