import styles from "../../styles/components/layout/Header.module.css";

export function Header() {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerContent}`}>
                <div className={styles.logo}>
                    <h1>Learning Management</h1>
                </div>
            </div>
        </header>
    );
}
