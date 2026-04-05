'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Travel', href: '/travel' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Registry', href: '/registry' },
  { label: 'Gallery', href: '/gallery' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-cream shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-script text-3xl text-terracotta hover:text-brick transition-colors"
          >
            Hanna &amp; Vishal
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide uppercase transition-colors ${
                    isActive
                      ? 'text-terracotta border-b-2 border-terracotta pb-0.5'
                      : 'text-taupe hover:text-terracotta'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu — simple stacked links */}
          <div className="flex sm:hidden">
            <details className="relative">
              <summary className="cursor-pointer list-none text-taupe hover:text-terracotta p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </summary>
              <div className="absolute right-0 mt-2 w-48 bg-background border border-cream rounded shadow-lg py-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2 text-sm uppercase tracking-wide ${
                        isActive ? 'text-terracotta font-bold' : 'text-taupe hover:text-terracotta'
                      }`}
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
