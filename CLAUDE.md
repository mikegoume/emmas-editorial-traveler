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

`lib/graphql.ts` holds a generic `fetchGraphQL<T>()` wrapper plus typed query functions (`getAllPosts`, `getAllDestinations`, `getRegionsWithDestinations`, etc.) and helpers (`getImageUrl`, `stripHtml`, `formatDate`). Pages call these functions directly as async server components with `export const revalidate = 60` (ISR). If the GraphQL call fails, pages fall back to `lib/mockData.ts`.

ACF image fields return `{ node: { sourceUrl, altText } }` — use `getImageUrl()` rather than accessing `featuredImage` directly, as it also checks ACF `heroImage` first.

### Routing

| Route | File |
|---|---|
| `/` | `app/page.tsx` |
| `/destinations` | `app/destinations/page.tsx` |
| `/destinations/[slug]` | `app/destinations/[slug]/page.tsx` |
| `/blog` | `app/blog/page.tsx` |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` |
| `/blog/category/[slug]` | `app/blog/category/[slug]/page.tsx` |
| `/blog/tag/[slug]` | `app/blog/tag/[slug]/page.tsx` |
| `/gallery` | `app/gallery/page.tsx` |
| `/about` | `app/about/page.tsx` |

### Client vs server components

Most components are server components. Client components (`"use client"`) include:

- `TopNavBar` — uses `usePathname` for active-link highlighting
- `NavLinks` — nav link rendering with client routing
- `SmoothScroller` — wraps the whole app in Lenis smooth scroll (`lerp: 0.08`)
- `WorldMap` / `WorldMapWrapper` — Leaflet requires client-side rendering; `WorldMapWrapper` uses `next/dynamic` with `ssr: false` to avoid SSR hydration issues
- `CategoryFilter` — interactive filter UI for blog posts
- `DestinationExpandingCards` — animated expanding card interaction
- `components/motion/*` — Framer Motion wrappers (`FadeUp`, `PageTransition`, `StaggerGrid`, `StaggerItem`)
- `components/ui/*` — interactive gallery/hero UI components

Keep new client components at the leaves; wrap them via a `*Wrapper.tsx` file when the parent is a server component (see `WorldMapWrapper` pattern).

### Key components

- `DocxViewer` — server component that fetches a `.docx` from WordPress media and renders it via `mammoth`. Used in destination detail pages to show travel guides.
- `components/motion/` — thin Framer Motion wrappers exporting `FadeUp`, `PageTransition`, `StaggerGrid`, `StaggerItem`. Animation constants live in `lib/animations.ts` (`DURATION`, `EASE`).
- `components/ui/` — standalone interactive UI: `bento-gallery`, `expanding-cards`, `infinite-gallery`, `portfolio-gallery`, `scroll-expansion-hero`.

### Styling

Tailwind CSS with a Material Design 3 token set defined in `tailwind.config.js` (e.g. `on-surface`, `secondary-container`, `tertiary`). Custom font families (`font-headline`, `font-body`, `font-label`) map to CSS variables set in `app/layout.tsx` (Plus Jakarta Sans / Manrope from Google Fonts). Material Symbols icons are loaded via CSS in `app/globals.css` and used with the class `material-symbols-outlined`.

Use `cn()` from `lib/utils.ts` (re-exports `clsx` + `tailwind-merge`) for conditional class composition.

Remote images come from `lh3.googleusercontent.com` (whitelisted in `next.config.js`). Standard `<img>` tags are used rather than `next/image`. Leaflet map popups use inline styles (not Tailwind) because they render outside the React tree.
