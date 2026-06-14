import { createAnonClient } from "./supabase";
import { createServerClient } from "./supabase-server";
import type { Destination, GalleryImage, Region } from "./types";

// ─── Helpers ────────────────────────────────────────────────────────────────

export function getOptimizedImageUrl(
  url: string,
  { width = 1200, quality = 80 }: { width?: number; quality?: number } = {},
): string {
  if (!url) return url;
  const STORAGE = "/storage/v1/object/public/";
  const idx = url.indexOf(STORAGE);
  if (idx === -1) return url; // external URL — pass through
  const base = url.slice(0, idx);
  const path = url.slice(idx + STORAGE.length);
  return `${base}/storage/v1/render/image/public/${path}?width=${width}&quality=${quality}&format=webp`;
}

export function getImageUrl(item: Destination): string {
  return (
    item.hero_image_url ??
    item.featured_image_url ??
    "https://placehold.co/800x600/eceeef/5b6061?text=No+Image"
  );
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

// ─── Destinations ────────────────────────────────────────────────────────────

export async function getAllDestinations(): Promise<Destination[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("destinations")
    .select(`*, region:regions(*)`)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;
  return data ?? [];
}

export async function getDestinationBySlug(
  slug: string,
): Promise<Destination | null> {
  const { data, error } = await createAnonClient()
    .from("destinations")
    .select(`*, region:regions(*)`)
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function getFeaturedDestinations(): Promise<Destination[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("destinations")
    .select(`*, region:regions(*)`)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(5);

  if (data && data.length > 0) return data;

  const { data: fallback } = await supabase
    .from("destinations")
    .select(`*, region:regions(*)`)
    .order("created_at", { ascending: false })
    .limit(5);

  return fallback ?? [];
}

// ─── Regions ─────────────────────────────────────────────────────────────────

export type RegionWithDestinations = Region & {
  destinations: Pick<Destination, "id" | "title" | "slug">[];
  children: RegionWithDestinations[];
};

export async function getRegionsWithDestinations(): Promise<
  RegionWithDestinations[]
> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("regions")
    .select(`*, destinations(id, title, slug)`)
    .order("name");

  if (error) throw error;

  // Build tree
  const byId: Record<string, RegionWithDestinations> = {};
  for (const r of data ?? []) {
    byId[r.id] = { ...r, children: [] };
  }
  const roots: RegionWithDestinations[] = [];
  for (const r of data ?? []) {
    if (r.parent_id && byId[r.parent_id]) {
      byId[r.parent_id].children.push(byId[r.id]);
    } else {
      roots.push(byId[r.id]);
    }
  }

  // Keep only branches that have at least one destination somewhere
  function hasDestinations(r: RegionWithDestinations): boolean {
    return r.destinations.length > 0 || r.children.some(hasDestinations);
  }
  return roots.filter(hasDestinations);
}

export type RegionWithFullDestinations = Region & {
  destinations: Destination[];
};

export async function getRegionBySlug(
  slug: string,
): Promise<RegionWithFullDestinations | null> {
  const { data, error } = await createAnonClient()
    .from("regions")
    .select(`*, destinations(*, region:regions(*))`)
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSetting(key: string): Promise<string | null> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();
  return data?.value ?? null;
}

export async function upsertSiteSetting(
  key: string,
  value: string,
): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
}

// ─── Static param helpers (build-time, no cookies) ───────────────────────────

export async function getAllDestinationSlugs(): Promise<string[]> {
  const { data } = await createAnonClient()
    .from("destinations")
    .select("slug")
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => r.slug);
}

export async function getAllRegionSlugs(): Promise<string[]> {
  const { data } = await createAnonClient()
    .from("regions")
    .select("slug")
    .order("name");
  return (data ?? []).map((r) => r.slug);
}
