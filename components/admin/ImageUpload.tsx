"use client";

import { createClient } from "@/lib/supabase";
import { useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(path, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
        {label}
      </label>

      {value && (
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-outline-variant/20"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-black/80 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-outline-variant/40 rounded-lg p-6 text-center cursor-pointer hover:border-secondary/50 transition-colors"
      >
        {uploading ? (
          <p className="text-sm text-outline font-body">Uploading…</p>
        ) : (
          <>
            <span className="material-symbols-outlined text-secondary text-3xl mb-2 block">
              cloud_upload
            </span>
            <p className="text-sm text-on-surface-variant font-body">
              Click to upload (JPG, PNG, WebP · max 10 MB)
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {/* OR paste URL manually */}
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste an image URL"
        className="w-full text-xs bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-1 focus:ring-secondary"
      />

      {error && (
        <p className="text-xs text-error font-body">{error}</p>
      )}
    </div>
  );
}
