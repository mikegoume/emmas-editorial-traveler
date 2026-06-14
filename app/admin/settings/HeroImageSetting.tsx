"use client";

import ImageUpload from "@/components/admin/ImageUpload";
import { useState, useTransition } from "react";
import { saveHeroImageAction } from "./actions";

export default function HeroImageSetting({ initialUrl }: { initialUrl: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const result = await saveHeroImageAction(url);
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(true);
      }
    });
  }

  return (
    <div className="space-y-4">
      <ImageUpload value={url} onChange={(v) => { setUrl(v); setSaved(false); }} label="Hero Image" />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-5 py-2.5 rounded-lg text-sm font-headline font-bold hover:bg-secondary/90 transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <>
              <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
              Saving…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">save</span>
              Save
            </>
          )}
        </button>

        {saved && (
          <span className="text-sm text-secondary font-body flex items-center gap-1">
            <span className="material-symbols-outlined text-base">check_circle</span>
            Saved
          </span>
        )}

        {url && (
          <button
            type="button"
            onClick={() => { setUrl(""); setSaved(false); }}
            className="text-sm text-outline hover:text-error font-body transition-colors"
          >
            Clear (use destination image)
          </button>
        )}
      </div>

      {error && <p className="text-xs text-error font-body">{error}</p>}
    </div>
  );
}
