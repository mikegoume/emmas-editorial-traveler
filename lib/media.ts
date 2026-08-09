// Single source of truth for the media CDN origin.
//
// Client-safe: this module must never import the S3 client (see lib/r2.ts), because
// it is pulled into "use client" components such as components/ui/infinite-gallery.tsx.
//
// The literal `process.env.NEXT_PUBLIC_CDN_URL` access is what Next inlines at build
// time — do not refactor it into a dynamic lookup.
export const CDN_BASE = (
  process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.daskalosapp.com"
).replace(/\/$/, "");

// Origins that historically served our media and are still baked into stored rows.
// Anything matching gets rewritten to CDN_BASE at render time, so the database can be
// migrated to bare paths on its own schedule (or never) without breaking rendering.
const LEGACY_MEDIA_HOSTS = [/^https?:\/\/pub-[a-z0-9]+\.r2\.dev/i];

/**
 * Resolve a stored media value into a URL on the current CDN.
 *
 * Accepts either form, which is what makes the path migration safe to defer:
 *   "images/gallery/1780986314473-yiljlv8l40a.jpeg"          → prefixed with CDN_BASE
 *   "https://pub-….r2.dev/images/gallery/…jpeg"              → host swapped for CDN_BASE
 *   "https://some-other-host/photo.jpg"                      → passed through untouched
 */
export function getMediaUrl(pathOrUrl: string | null | undefined): string {
  if (!pathOrUrl) return "";
  const value = pathOrUrl.trim();
  if (!value) return "";

  for (const legacy of LEGACY_MEDIA_HOSTS) {
    if (legacy.test(value)) return value.replace(legacy, CDN_BASE);
  }

  // Absolute URL on a host we do not own (placeholders, Google-hosted images) — leave it.
  if (/^https?:\/\//i.test(value)) return value;

  // Protocol-relative and data/blob URIs are not object keys either.
  if (/^(\/\/|data:|blob:)/i.test(value)) return value;

  return `${CDN_BASE}/${value.replace(/^\//, "")}`;
}

/**
 * Inverse of getMediaUrl: reduce a stored value to its bare R2 object key.
 * Used by the path migration and by anything that needs the key rather than the URL.
 * Returns null when the value points at a host we do not control.
 */
export function getMediaPath(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null;
  const value = pathOrUrl.trim();
  if (!value) return null;

  for (const legacy of LEGACY_MEDIA_HOSTS) {
    if (legacy.test(value)) return value.replace(legacy, "").replace(/^\//, "");
  }
  if (value.startsWith(CDN_BASE)) {
    return value.slice(CDN_BASE.length).replace(/^\//, "");
  }
  if (/^(https?:\/\/|\/\/|data:|blob:)/i.test(value)) return null;

  return value.replace(/^\//, "");
}
