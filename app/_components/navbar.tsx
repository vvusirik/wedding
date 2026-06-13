"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import styles from "./navbar.module.css";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Schedule", href: "/schedule" },
    { label: "RSVP", href: "/rsvp" },
    { label: "Travel", href: "/travel" },
    { label: "Info", href: "/faq" },
    { label: "Gifting", href: "/gifting" },
    { label: "Gallery", href: "/gallery" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    function handleLogout(e: React.MouseEvent<HTMLAnchorElement>) {
        if (!window.confirm("Log out?")) {
            e.preventDefault();
        }
    }

    return (
        <nav className={styles.nav}>
            <div className={styles.inner}>
                <div className={styles.bar}>
                    <Link href="/" className={styles.logo}>
                        {pathname === "/" ? "October 17, 2026" : "Vishal & Hanna"}
                    </Link>

                    <div className={styles.links}>
                        {navLinks.map((link) => {
                            const isActive =
                                pathname === link.href || pathname.startsWith(link.href + "/");
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        {process.env.NODE_ENV === "development" && (
                            <a href="/api/logout" className={styles.devLogout}>
                                Logout
                            </a>
                        )}
                    </div>

                    <Drawer.Root open={open} onOpenChange={setOpen}>
                        <Drawer.Trigger asChild>
                            <button
                                type="button"
                                className={styles.toggle}
                                aria-label="Open menu"
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </Drawer.Trigger>
                        <Drawer.Portal>
                            <Drawer.Overlay className={styles.overlay} />
                            <Drawer.Content className={styles.drawer}>
                                <div className={styles.drawerHandle} aria-hidden />
                                <Drawer.Title className={styles.drawerLogo}>
                                    Vishal &amp; Hanna
                                </Drawer.Title>
                                <Drawer.Description className="sr-only">
                                    Site navigation
                                </Drawer.Description>
                                <div className={styles.drawerDivider} />
                                <div className={styles.drawerNav}>
                                    {navLinks.map((link) => {
                                        const isActive =
                                            pathname === link.href ||
                                            pathname.startsWith(link.href + "/");
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setOpen(false)}
                                                className={`${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ""}`}
                                            >
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                                <div className={styles.drawerFooter}>
                                    <a
                                        href="/api/logout"
                                        onClick={handleLogout}
                                        className={styles.drawerLogout}
                                    >
                                        Logout
                                    </a>
                                </div>
                            </Drawer.Content>
                        </Drawer.Portal>
                    </Drawer.Root>
                </div>
            </div>
        </nav>
    );
}
