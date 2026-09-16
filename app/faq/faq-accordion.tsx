"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.css";

type Props = {
    id?: string;
    question: string;
    answer: React.ReactNode;
};

export function FaqAccordion({ id, question, answer }: Props) {
    const ref = useRef<HTMLDetailsElement>(null);

    useEffect(() => {
        if (!id) return;
        const open = () => {
            if (window.location.hash === `#${id}` && ref.current) {
                ref.current.open = true;
                ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        };
        open();
        window.addEventListener("hashchange", open);
        return () => window.removeEventListener("hashchange", open);
    }, [id]);

    return (
        <details ref={ref} id={id} className={styles.accordion}>
            <summary className={styles.summary}>
                <span className={styles.question}>{question}</span>
                <span className={styles.expandIcon}>+</span>
            </summary>
            <div className={styles.answer}>{answer}</div>
        </details>
    );
}
