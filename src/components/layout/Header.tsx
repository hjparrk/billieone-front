import { Link } from "react-router-dom";
import styles from "../../styles/components/layout/Header.module.css";

export function Header() {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerContent}`}>
                <Link to="/" className={styles.logo}>
                    <h1>Learning Management</h1>
                </Link>
            </div>
        </header>
    );
}
