"use client";

import DocUpload from "@/components/admin/DocUpload";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { createClient } from "@/lib/supabase";
import type { Destination, Region } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  destination?: Destination;
  regions: Region[];
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function DestinationForm({ destination, regions }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!destination;

  const [form, setForm] = useState({
    title: destination?.title ?? "",
    slug: destination?.slug ?? "",
    excerpt: destination?.excerpt ?? "",
    content: destination?.content ?? "",
    visit_date: destination?.visit_date ?? "",
    featured: destination?.featured ?? false,
    hero_image_url: destination?.hero_image_url ?? "",
    featured_image_url: destination?.featured_image_url ?? "",
    featured_image_alt: destination?.featured_image_alt ?? "",
    latitude: destination?.latitude?.toString() ?? "",
    longitude: destination?.longitude?.toString() ?? "",
    document_url: destination?.document_url ?? "",
    region_id: destination?.region_id ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleGeocode() {
    const query = [form.title].filter(Boolean).join(", ");
    if (!query) return;
    setGeocoding(true);
    setGeocodeError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } },
      );
      const data = await res.json();
      if (!data.length) {
        setGeocodeError("No location found — try a more specific title.");
      } else {
        set("latitude", parseFloat(data[0].lat).toFixed(6));
        set("longitude", parseFloat(data[0].lon).toFixed(6));
      }
    } catch {
      setGeocodeError("Geocoding request failed — check your connection.");
    } finally {
      setGeocoding(false);
    }
  }

  async function handleDelete() {
    if (!destination || !confirm(`Delete "${destination.title}"? This cannot be undone.`)) return;
    await supabase.from("destinations").delete().eq("id", destination.id);
    router.push("/admin/destinations");
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content: form.content || null,
      visit_date: form.visit_date || null,
      featured: form.featured,
      hero_image_url: form.hero_image_url || null,
      featured_image_url: form.featured_image_url || null,
      featured_image_alt: form.featured_image_alt,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      document_url: form.document_url || null,
      region_id: form.region_id || null,
    };

    const { error: dbError } = isEdit
      ? await supabase.from("destinations").update(payload).eq("id", destination.id)
      : await supabase.from("destinations").insert(payload);

    if (dbError) {
      setError(dbError.message);
      setSaving(false);
      return;
    }

    router.push("/admin/destinations");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Basic info */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-lg p-6 space-y-5">
        <h2 className="font-headline font-bold text-on-surface">Basic info</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-1 sm:col-span-1 sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
              Title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (!isEdit) set("slug", slugify(e.target.value));
              }}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
              Slug *
            </label>
            <input
              required
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-on-surface text-sm font-mono focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
              Excerpt
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={2}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-on-surface text-sm resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
              Region
            </label>
            <select
              value={form.region_id}
              onChange={(e) => set("region_id", e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">— No region —</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
              Visit date
            </label>
            <input
              type="date"
              value={form.visit_date}
              onChange={(e) => set("visit_date", e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label">
                Coordinates
              </span>
              <button
                type="button"
                onClick={handleGeocode}
                disabled={geocoding || !form.title}
                className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary/80 disabled:opacity-40 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  {geocoding ? "progress_activity" : "my_location"}
                </span>
                {geocoding ? "Finding…" : "Find from title"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => set("latitude", e.target.value)}
                placeholder="Latitude (e.g. 37.9838)"
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => set("longitude", e.target.value)}
                placeholder="Longitude (e.g. 23.7275)"
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            {geocodeError && (
              <p className="text-xs text-error">{geocodeError}</p>
            )}
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="w-4 h-4 accent-secondary"
              />
              <span className="text-sm font-medium text-on-surface">
                Featured destination
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-lg p-6 space-y-4">
        <h2 className="font-headline font-bold text-on-surface">Content</h2>
        <RichTextEditor
          value={form.content}
          onChange={(html) => set("content", html)}
        />
      </section>

      {/* Images */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-lg p-6 space-y-5">
        <h2 className="font-headline font-bold text-on-surface">Images</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ImageUpload
            label="Hero image"
            value={form.hero_image_url}
            onChange={(url) => set("hero_image_url", url)}
          />
          <ImageUpload
            label="Featured image"
            value={form.featured_image_url}
            onChange={(url) => set("featured_image_url", url)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
            Image alt text
          </label>
          <input
            value={form.featured_image_alt}
            onChange={(e) => set("featured_image_alt", e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      </section>

      {/* Document */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-lg p-6">
        <h2 className="font-headline font-bold text-on-surface mb-4">
          Destination guide
        </h2>
        <DocUpload
          value={form.document_url}
          onChange={(url) => set("document_url", url)}
        />
      </section>

      {error && (
        <p className="text-sm text-error bg-error-container/20 border border-error/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-secondary-dim transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create destination"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/destinations")}
          className="px-6 py-2.5 rounded-lg font-bold text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
        >
          Cancel
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="sm:ml-auto px-6 py-2.5 rounded-lg font-bold text-sm text-error hover:bg-error-container/20 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
