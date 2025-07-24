import type { ReactNode } from "react";
import { Header } from "./Header";
import styles from "../../styles/components/layout/PageLayout.module.css";

interface PageLayoutProps {
    children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
    return (
        <div className={styles.layout}>
            <Header />
            <main className={styles.main}>
                <div className="container">{children}</div>
            </main>
        </div>
    );
}
