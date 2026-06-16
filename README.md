# Travel With Emma — Next.js Frontend

A Next.js 14 (App Router) frontend for Travel With Emma WordPress site, converted from the Google Stitch design. Currently uses mock data — ready to be wired up to the WordPress REST API or WPGraphQL.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (with custom Material Design 3-inspired tokens)
- **Google Fonts** via `next/font` — Plus Jakarta Sans + Manrope
- **Material Symbols Outlined** via Google Fonts CSS import

## Project Structure

```
app/
  layout.tsx          Root layout (fonts, global CSS)
  page.tsx            Home page
  destinations/
    page.tsx          Europe destinations category
    rome/
      page.tsx        Rome city guide
  blog/
    page.tsx          Blog listing
  about/
    page.tsx          About & Contact with world map
components/
  TopNavBar.tsx       Fixed navigation (client component, uses usePathname)
  Footer.tsx          Shared footer
lib/
  mockData.ts         Mock WordPress data — swap for real API calls
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Connecting to WordPress

All mock data lives in `lib/mockData.ts`. To wire up WordPress:

### Option A — WordPress REST API

```ts
// lib/api.ts
const WP_BASE = process.env.NEXT_PUBLIC_WP_URL; // e.g. https://your-wp-site.com

export async function getPosts() {
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/posts?_embed`);
  return res.json();
}

export async function getPageBySlug(slug: string) {
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages?slug=${slug}&_embed`);
  const pages = await res.json();
  return pages[0];
}
```

### Option B — WPGraphQL

```ts
// lib/graphql.ts
export async function fetchGraphQL(query: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_WP_GRAPHQL_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const { data } = await res.json();
  return data;
}
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_WP_URL=https://your-wordpress-site.com
NEXT_PUBLIC_WP_GRAPHQL_URL=https://your-wordpress-site.com/graphql
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, featured destinations, blog preview, about teaser |
| `/destinations` | Europe category with asymmetric grid and activities |
| `/destinations/rome` | Rome city guide with attractions, dining, tips |
| `/blog` | Blog listing with featured story, sidebar, tag cloud |
| `/about` | About + interactive world map + contact form |

## Design Tokens

Custom Tailwind colors follow Material Design 3 conventions (e.g. `secondary`, `on-secondary`, `surface-container-low`). See `tailwind.config.js` for the full palette.
