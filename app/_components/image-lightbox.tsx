"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./image-lightbox.module.css";

type Props = {
    src: string;
    alt: string;
    width: number;
    height: number;
    imageStyle?: React.CSSProperties;
    className?: string;
};

export function ClickableImage({ src, alt, width, height, imageStyle, className }: Props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <>
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                style={{ ...imageStyle, cursor: "zoom-in" }}
                className={className}
                onClick={() => setOpen(true)}
            />
            {open && (
                <div className={styles.overlay} onClick={() => setOpen(false)}>
                    <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close">×</button>
                    <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={src}
                            alt={alt}
                            width={width}
                            height={height}
                            style={{ maxWidth: "90vw", maxHeight: "90vh", width: "auto", height: "auto" }}
                            priority
                        />
                    </div>
                </div>
            )}
        </>
    );
}
