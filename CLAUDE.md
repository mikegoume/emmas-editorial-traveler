# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Production build (also runs TypeScript type-check)
npm run start     # Start production server
npm run lint      # ESLint via Next.js defaults
```

No test framework is configured.

## Architecture

**Next.js 14 App Router** travel editorial site backed by WordPress via WPGraphQL. Currently all pages render from mock data in `lib/mockData.ts`; the real API endpoint is set in `.env.local` (`NEXT_PUBLIC_WP_GRAPHQL_URL`).

### Data flow

`lib/graphql.ts` holds a generic `fetchGraphQL<T>()` wrapper plus typed query functions (`getAllPosts`, `getDestinationBySlug`, etc.) and helpers (`getImageUrl`, `stripHtml`, `formatDate`). Pages call these functions directly as async server components with `export const revalidate = 60` (ISR). If the GraphQL call fails, pages fall back to `lib/mockData.ts`.

### Routing

| Route | File |
|---|---|
| `/` | `app/page.tsx` |
| `/destinations` | `app/destinations/page.tsx` |
| `/destinations/[slug]` | `app/destinations/[slug]/page.tsx` |
| `/blog` | `app/blog/page.tsx` |
| `/about` | `app/about/page.tsx` |

### Client vs server components

`TopNavBar` is the only `"use client"` component (uses `usePathname`). Everything else is a server component. Keep client components at the leaves.

### Styling

Tailwind CSS with a Material Design 3 token set defined in `tailwind.config.js` (e.g. `on-surface`, `secondary-container`, `tertiary`). Custom font families (`font-headline`, `font-body`, `font-label`) map to CSS variables set in `app/layout.tsx` (Plus Jakarta Sans / Manrope from Google Fonts). Material Symbols icons are loaded via CSS in `app/globals.css` and used with the class `material-symbols-outlined`.

Remote images come from `lh3.googleusercontent.com` (whitelisted in `next.config.js`). Standard `<img>` tags are used rather than `next/image`.
