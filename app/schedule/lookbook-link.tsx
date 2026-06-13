"use client";

import { useState } from "react";
import { ClickableImage } from "../_components/image-lightbox";
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
                    {open ? "−" : "+"}
                </span>
            </button>
            {open && (
                <div className={styles.lookbookImageWrap}>
                    <ClickableImage
                        src={src}
                        alt={label}
                        width={800}
                        height={1100}
                        imageStyle={{ width: "100%", height: "auto" }}
                    />
                </div>
            )}
        </div>
    );
}
