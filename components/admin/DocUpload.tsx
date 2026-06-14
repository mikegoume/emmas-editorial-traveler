"use client";

import { createClient } from "@/lib/supabase";
import { useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function DocUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    const ext = file.name.split(".").pop() || "docx";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(path, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("documents").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
        Destination Guide (.docx)
      </label>

      {value && (
        <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3">
          <span className="material-symbols-outlined text-secondary">
            description
          </span>
          <span className="text-sm text-on-surface font-body flex-1 truncate">
            {value.split("/").pop()}
          </span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-outline hover:text-error transition-colors"
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
              upload_file
            </span>
            <p className="text-sm text-on-surface-variant font-body">
              Click to upload a .docx file (max 50 MB)
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && <p className="text-xs text-error font-body">{error}</p>}
    </div>
  );
}
