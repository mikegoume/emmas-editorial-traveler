"use client";

import { createClient } from "@/lib/supabase";
import type { GalleryImage } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

export default function AdminGalleryPage() {
  const supabase = createClient();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [batchCategory, setBatchCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchAssignCategory, setBatchAssignCategory] = useState("");
  const [batchWorking, setBatchWorking] = useState(false);

  async function fetchImages() {
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setImages(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(images.map((i) => i.id)));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  async function handleBatchDelete() {
    if (!confirm(`Delete ${selectedIds.size} image${selectedIds.size > 1 ? "s" : ""}? This cannot be undone.`)) return;
    setBatchWorking(true);
    const ids = Array.from(selectedIds);
    await supabase.from("gallery_images").delete().in("id", ids);
    clearSelection();
    await fetchImages();
    setBatchWorking(false);
  }

  async function handleBatchAssignCategory() {
    const value = batchAssignCategory.trim() || null;
    setBatchWorking(true);
    const ids = Array.from(selectedIds);
    await supabase
      .from("gallery_images")
      .update({ category: value })
      .in("id", ids);
    setImages((prev) =>
      prev.map((i) => (selectedIds.has(i.id) ? { ...i, category: value } : i)),
    );
    clearSelection();
    setBatchAssignCategory("");
    setBatchWorking(false);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setErrors([]);
    setProgress({ done: 0, total: files.length });

    const uploadErrors: string[] = [];
    let sortBase = images.length;

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const autoAlt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(path, file, { upsert: false });

      if (uploadError) {
        uploadErrors.push(`${file.name}: ${uploadError.message}`);
        setProgress((p) => p && { ...p, done: p.done + 1 });
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(path);

      const { error: dbError } = await supabase.from("gallery_images").insert({
        url: publicUrl,
        alt: autoAlt,
        caption: null,
        category: batchCategory.trim() || null,
        sort_order: sortBase++,
      });

      if (dbError) uploadErrors.push(`${file.name}: ${dbError.message}`);

      setProgress((p) => p && { ...p, done: p.done + 1 });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    setProgress(null);
    setErrors(uploadErrors);
    fetchImages();
  }

  async function handleDelete(img: GalleryImage) {
    if (!confirm(`Remove "${img.alt}" from the gallery?`)) return;
    await supabase.from("gallery_images").delete().eq("id", img.id);
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(img.id); return n; });
    fetchImages();
  }

  async function handleCategoryBlur(img: GalleryImage, newCategory: string) {
    const value = newCategory.trim() || null;
    if (value === img.category) return;
    await supabase.from("gallery_images").update({ category: value }).eq("id", img.id);
    setImages((prev) =>
      prev.map((i) => (i.id === img.id ? { ...i, category: value } : i)),
    );
  }

  const uploading = progress !== null;
  const hasSelection = selectedIds.size > 0;
  const allSelected = images.length > 0 && selectedIds.size === images.length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-background">Gallery</h1>
          <p className="text-outline font-body text-sm mt-1">
            {images.length} {images.length === 1 ? "image" : "images"}
          </p>
        </div>
      </div>

      {/* Upload zone */}
      <section className="bg-surface-container-lowest border border-outline-variant/15 rounded-lg p-6 mb-8">
        <h2 className="font-headline font-bold text-on-surface mb-4">Add images</h2>

        <div className="mb-4">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block mb-1">
            Category for this batch (optional)
          </label>
          <input
            type="text"
            value={batchCategory}
            onChange={(e) => setBatchCategory(e.target.value)}
            placeholder="e.g. Greece, Italy, Portraits…"
            disabled={uploading}
            className="w-full max-w-xs text-sm bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-1 focus:ring-secondary"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="gallery-upload"
        />
        <label
          htmlFor="gallery-upload"
          className={`flex flex-col items-center justify-center gap-3 cursor-pointer bg-surface-container-low border-2 border-dashed border-outline-variant/40 hover:border-secondary/50 rounded-lg px-4 py-12 text-center transition-colors ${
            uploading ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <span className="material-symbols-outlined text-secondary text-4xl">
            {uploading ? "progress_activity" : "add_photo_alternate"}
          </span>
          {uploading ? (
            <span className="text-sm font-medium text-on-surface">
              Uploading {progress!.done} of {progress!.total}…
            </span>
          ) : (
            <>
              <span className="text-sm font-medium text-on-surface">Click to choose images</span>
              <span className="text-xs text-on-surface-variant">Select as many as you like — all will be uploaded</span>
            </>
          )}
        </label>

        {uploading && (
          <div className="mt-3 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-300"
              style={{ width: `${(progress!.done / progress!.total) * 100}%` }}
            />
          </div>
        )}

        {errors.length > 0 && (
          <div className="mt-3 space-y-1">
            {errors.map((err, i) => (
              <p key={i} className="text-xs text-error">{err}</p>
            ))}
          </div>
        )}
      </section>

      {/* Image grid */}
      {loading ? (
        <p className="text-outline font-body italic">Loading…</p>
      ) : images.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low rounded-lg">
          <span className="material-symbols-outlined text-4xl text-outline mb-3 block">photo_library</span>
          <p className="text-outline font-body italic">No gallery images yet — upload some above.</p>
        </div>
      ) : (
        <>
          {/* Grid header: select-all toggle */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={allSelected ? clearSelection : selectAll}
              className="text-xs font-bold font-label text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">
                {allSelected ? "check_box" : "check_box_outline_blank"}
              </span>
              {allSelected ? "Deselect all" : "Select all"}
            </button>
            {hasSelection && (
              <span className="text-xs text-on-surface-variant font-label">
                {selectedIds.size} selected
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => {
              const isSelected = selectedIds.has(img.id);
              return (
                <div
                  key={img.id}
                  className={`relative group rounded-lg overflow-visible bg-surface-container-low transition-shadow ${
                    isSelected ? "ring-2 ring-secondary ring-offset-1" : ""
                  }`}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />

                    {/* Checkbox — always visible top-left */}
                    <button
                      onClick={() => toggleSelect(img.id)}
                      className="absolute top-2 left-2 z-10 w-6 h-6 flex items-center justify-center rounded-md bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                      title={isSelected ? "Deselect" : "Select"}
                    >
                      <span className="material-symbols-outlined text-white text-base leading-none">
                        {isSelected ? "check_box" : "check_box_outline_blank"}
                      </span>
                    </button>

                    {/* Hover overlay with delete */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <button
                        onClick={() => handleDelete(img)}
                        className="self-end bg-error text-on-error rounded-lg p-1.5 hover:bg-error/80 transition-colors"
                        title="Remove from gallery"
                      >
                        <span className="material-symbols-outlined text-base leading-none">delete</span>
                      </button>
                      <div>
                        <p className="text-white font-bold text-xs line-clamp-1">{img.alt}</p>
                        {img.caption && (
                          <p className="text-white/60 text-xs line-clamp-1 mt-0.5">{img.caption}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Inline category editor */}
                  <div className="px-1 pt-1.5 pb-2">
                    <input
                      type="text"
                      defaultValue={img.category ?? ""}
                      placeholder="Category…"
                      onBlur={(e) => handleCategoryBlur(img, e.target.value)}
                      className="w-full text-xs bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:outline-none text-on-surface-variant placeholder:text-outline-variant py-0.5 transition-colors"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Batch action bar ── */}
      {hasSelection && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-on-background text-background rounded-2xl shadow-2xl px-5 py-3 flex-wrap justify-center">
          <span className="font-label font-bold text-sm whitespace-nowrap">
            {selectedIds.size} selected
          </span>

          <div className="w-px h-5 bg-background/20" />

          {/* Assign category */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={batchAssignCategory}
              onChange={(e) => setBatchAssignCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBatchAssignCategory()}
              placeholder="Category name…"
              className="text-xs bg-background/10 border border-background/20 rounded-lg px-2 py-1.5 text-background placeholder:text-background/50 focus:outline-none focus:border-background/50 w-36"
            />
            <button
              onClick={handleBatchAssignCategory}
              disabled={batchWorking}
              className="text-xs font-bold font-label px-3 py-1.5 bg-secondary text-on-secondary rounded-lg hover:bg-secondary-dim transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              Assign
            </button>
          </div>

          <div className="w-px h-5 bg-background/20" />

          {/* Delete */}
          <button
            onClick={handleBatchDelete}
            disabled={batchWorking}
            className="text-xs font-bold font-label px-3 py-1.5 bg-error text-on-error rounded-lg hover:bg-error/80 transition-colors disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base leading-none">delete</span>
            Delete
          </button>

          <div className="w-px h-5 bg-background/20" />

          <button
            onClick={clearSelection}
            className="text-xs text-background/60 hover:text-background transition-colors font-label"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
