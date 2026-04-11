"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Schedule", href: "/schedule" },
  { label: "RSVP", href: "/rsvp" },
  { label: "Travel", href: "/travel" },
  { label: "FAQ", href: "/faq" },
  { label: "Registry", href: "/registry" },
  { label: "Gallery", href: "/gallery" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={`${styles.inner} sm:px-6 lg:px-8`}>
        <div className={styles.bar}>
          <Link
            href="/"
            className={`${styles.logo} hover:text-brick transition-colors`}
          >
            Vishal &amp; Hanna
          </Link>

          <div className={`${styles.links} hidden sm:flex`}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.link} ${isActive ? styles.linkActive : "hover:text-terracotta"} transition-colors`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu */}
          <div className="flex sm:hidden">
            <details className="relative">
              <summary
                className={`${styles.mobileToggle} cursor-pointer list-none hover:text-terracotta`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </summary>
              <div className={styles.mobileDropdown}>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`${styles.mobileLink} ${isActive ? styles.mobileLinkActive : "hover:text-terracotta"}`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
}
