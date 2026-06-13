"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.css";

type Props = { src: string; label: string };

export function LookbookLink({ src, label }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.lookbookDrawer}>
            <button
                onClick={() => setOpen((o) => !o)}
                className={styles.lookbookLink}
                aria-expanded={open}
            >
                <span>{label}</span>
                <span className={`${styles.lookbookChevron} ${open ? styles.lookbookChevronOpen : ""}`}>
                    ›
                </span>
            </button>
            {open && (
                <div className={styles.lookbookImageWrap}>
                    <Image
                        src={src}
                        alt={label}
                        width={800}
                        height={1100}
                        style={{ width: "100%", height: "auto" }}
                        priority
                    />
                </div>
            )}
        </div>
    );
}
