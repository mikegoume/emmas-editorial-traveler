import { createAnonClient } from "./supabase";
import { createServerClient } from "./supabase-server";
import type { Category, Destination, Post, Region, Tag } from "./types";

// ─── Helpers ────────────────────────────────────────────────────────────────

export function getImageUrl(item: Post | Destination): string {
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

// ─── Posts ───────────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `*, post_categories(category_id, categories(*)), post_tags(tag_id, tags(*))`,
    )
    .order("date", { ascending: false })
    .limit(20);

  if (error) throw error;
  return (data ?? []).map(normalizePost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `*, post_categories(category_id, categories(*)), post_tags(tag_id, tags(*))`,
    )
    .eq("slug", slug)
    .single();

  if (error) return null;
  return normalizePost(data);
}

export async function getFeaturedPost(): Promise<Post | null> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("posts")
    .select(
      `*, post_categories(category_id, categories(*)), post_tags(tag_id, tags(*))`,
    )
    .eq("featured", true)
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (data) return normalizePost(data);

  // Fall back to most recent post
  const { data: latest } = await supabase
    .from("posts")
    .select(
      `*, post_categories(category_id, categories(*)), post_tags(tag_id, tags(*))`,
    )
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();

  return latest ? normalizePost(latest) : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePost(row: any): Post {
  return {
    ...row,
    categories: (row.post_categories ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (pc: any) => pc.categories,
    ),
    tags: (row.post_tags ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (pt: any) => pt.tags,
    ),
  };
}

// ─── Destinations ────────────────────────────────────────────────────────────

export async function getAllDestinations(): Promise<Destination[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("destinations")
    .select(`*, region:regions(*)`)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data ?? [];
}

export async function getDestinationBySlug(
  slug: string,
): Promise<Destination | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
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

  // Fall back to most recent
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
  // Only regions that have destinations
  return (data ?? []).filter((r) => r.destinations.length > 0);
}

export type RegionWithFullDestinations = Region & {
  destinations: Destination[];
};

export async function getRegionBySlug(
  slug: string,
): Promise<RegionWithFullDestinations | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("regions")
    .select(`*, destinations(*, region:regions(*))`)
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select(`*, post_categories(count)`)
    .order("name");

  if (error) throw error;
  return (data ?? []).map((c) => ({
    ...c,
    post_count: c.post_categories?.[0]?.count ?? 0,
  }));
}

export type CategoryWithPosts = Category & { posts: Post[] };

export async function getCategoryBySlug(
  slug: string,
): Promise<CategoryWithPosts | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select(
      `*, post_categories(posts(*, post_categories(category_id, categories(*)), post_tags(tag_id, tags(*))))`,
    )
    .eq("slug", slug)
    .single();

  if (error) return null;

  const posts = (data.post_categories ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((pc: any) => normalizePost(pc.posts))
    .filter(Boolean);

  return { ...data, posts };
}

// ─── Static param helpers (build-time, no cookies) ───────────────────────────

export async function getAllPostSlugs(): Promise<string[]> {
  const { data } = await createAnonClient()
    .from("posts")
    .select("slug")
    .order("date", { ascending: false });
  return (data ?? []).map((r) => r.slug);
}

export async function getAllDestinationSlugs(): Promise<string[]> {
  const { data } = await createAnonClient()
    .from("destinations")
    .select("slug")
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => r.slug);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const { data } = await createAnonClient().from("categories").select("slug");
  return (data ?? []).map((r) => r.slug);
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

export async function getTrendingTags(limit = 8): Promise<Tag[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("tags")
    .select(`*, post_tags(count)`)
    .order("name")
    .limit(50);

  if (error) throw error;

  return (data ?? [])
    .map((t) => ({ ...t, post_count: t.post_tags?.[0]?.count ?? 0 }))
    .filter((t) => t.post_count > 0)
    .sort((a, b) => b.post_count - a.post_count)
    .slice(0, limit);
}

export type TagWithPosts = Tag & { posts: Post[] };

export async function getTagBySlug(slug: string): Promise<TagWithPosts | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("tags")
    .select(
      `*, post_tags(posts(*, post_categories(category_id, categories(*)), post_tags(tag_id, tags(*))))`,
    )
    .eq("slug", slug)
    .single();

  if (error) return null;

  const posts = (data.post_tags ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((pt: any) => normalizePost(pt.posts))
    .filter(Boolean);

  return { ...data, posts };
}
