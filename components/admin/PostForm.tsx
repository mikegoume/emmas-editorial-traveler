"use client";

import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { createClient } from "@/lib/supabase";
import type { Category, Post, Tag } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  post?: Post;
  categories: Category[];
  tags: Tag[];
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function PostForm({ post, categories, tags }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!post;

  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    date: post?.date ? post.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    featured: post?.featured ?? false,
    read_time: post?.read_time ?? "",
    hero_image_url: post?.hero_image_url ?? "",
    featured_image_url: post?.featured_image_url ?? "",
    featured_image_alt: post?.featured_image_alt ?? "",
    selectedCategories: post?.categories?.map((c) => c.id) ?? [],
    selectedTags: post?.tags?.map((t) => t.id) ?? [],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function toggleCategory(id: string) {
    set(
      "selectedCategories",
      form.selectedCategories.includes(id)
        ? form.selectedCategories.filter((c) => c !== id)
        : [...form.selectedCategories, id],
    );
  }

  function toggleTag(id: string) {
    set(
      "selectedTags",
      form.selectedTags.includes(id)
        ? form.selectedTags.filter((t) => t !== id)
        : [...form.selectedTags, id],
    );
  }

  async function handleDelete() {
    if (!post || !confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    await supabase.from("posts").delete().eq("id", post.id);
    router.push("/admin/posts");
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
      date: new Date(form.date).toISOString(),
      featured: form.featured,
      read_time: form.read_time || null,
      hero_image_url: form.hero_image_url || null,
      featured_image_url: form.featured_image_url || null,
      featured_image_alt: form.featured_image_alt,
    };

    let postId = post?.id;

    if (isEdit) {
      const { error: dbError } = await supabase
        .from("posts")
        .update(payload)
        .eq("id", post.id);
      if (dbError) {
        setError(dbError.message);
        setSaving(false);
        return;
      }
    } else {
      const { data, error: dbError } = await supabase
        .from("posts")
        .insert(payload)
        .select("id")
        .single();
      if (dbError || !data) {
        setError(dbError?.message ?? "Failed to create post");
        setSaving(false);
        return;
      }
      postId = data.id;
    }

    // Sync categories
    await supabase.from("post_categories").delete().eq("post_id", postId);
    if (form.selectedCategories.length > 0) {
      await supabase.from("post_categories").insert(
        form.selectedCategories.map((cid) => ({
          post_id: postId,
          category_id: cid,
        })),
      );
    }

    // Sync tags
    await supabase.from("post_tags").delete().eq("post_id", postId);
    if (form.selectedTags.length > 0) {
      await supabase.from("post_tags").insert(
        form.selectedTags.map((tid) => ({ post_id: postId, tag_id: tid })),
      );
    }

    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Basic info */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-lg p-6 space-y-5">
        <h2 className="font-headline font-bold text-on-surface">Basic info</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5">
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

          <div className="col-span-2 space-y-1.5">
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

          <div className="col-span-2 space-y-1.5">
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
              Publication date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
              Read time
            </label>
            <input
              value={form.read_time}
              onChange={(e) => set("read_time", e.target.value)}
              placeholder="e.g. 8 min read"
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="w-4 h-4 accent-secondary"
              />
              <span className="text-sm font-medium text-on-surface">
                Featured post
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Categories & Tags */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-lg p-6 space-y-5">
        <h2 className="font-headline font-bold text-on-surface">
          Categories &amp; Tags
        </h2>

        {categories.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    form.selectedCategories.includes(cat.id)
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {tags.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    form.selectedTags.includes(tag.id)
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
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
        <div className="grid grid-cols-2 gap-6">
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

      {error && (
        <p className="text-sm text-error bg-error-container/20 border border-error/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-secondary-dim transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Publish post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="px-6 py-2.5 rounded-lg font-bold text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
        >
          Cancel
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto px-6 py-2.5 rounded-lg font-bold text-sm text-error hover:bg-error-container/20 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
