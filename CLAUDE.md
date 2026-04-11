# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

This is a **password-protected wedding website** for Vishal & Hanna (October 17, 2026, The Bowden, Keller TX). Built with Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS v4.

### Auth flow

- `proxy.ts` — middleware that redirects unauthenticated users to `/login` (note: named `proxy.ts`, not `middleware.ts`)
- `app/api/login/route.ts` — POST endpoint that validates a password and sets a `wedding-auth` cookie (90-day, httpOnly)
- `app/layout.tsx` — reads the `wedding-auth` cookie server-side to conditionally render `<Navbar>`

### Page structure

All pages live under `app/` using the App Router convention. Each page has a co-located `page.module.css`. Pages: `/` (hero), `/login`, `/gallery`, `/schedule`, `/travel`, `/registry`, `/faq`.

Shared components live in `app/_components/` (currently just `navbar.tsx`).

### Styling

- Use **CSS modules** for all component styles (co-located `*.module.css` files)
- Global styles in `app/globals.css`; Tailwind utility classes are also available
- Four fonts are loaded in `layout.tsx` and exposed as CSS variables: `--font-great-vibes`, `--font-ed-lavonia`, `--font-renogare`, `--font-lato`
- Custom fonts (Ed Lavonia, Renogare) are served from `public/fonts/`
