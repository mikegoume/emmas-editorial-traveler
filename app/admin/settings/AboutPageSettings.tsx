"use client";

import ImageUpload from "@/components/admin/ImageUpload";
import { useState, useTransition } from "react";
import { saveAboutSettingsAction } from "./actions";

interface Props {
  initialPhotoUrl: string;
  initialHeading: string;
  initialBio: string;
}

export default function AboutPageSettings({
  initialPhotoUrl,
  initialHeading,
  initialBio,
}: Props) {
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [heading, setHeading] = useState(initialHeading);
  const [bio, setBio] = useState(initialBio);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const result = await saveAboutSettingsAction({
        photo_url: photoUrl,
        heading,
        bio,
      });
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(true);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Photo */}
      <ImageUpload
        value={photoUrl}
        onChange={(v) => { setPhotoUrl(v); setSaved(false); }}
        label="Portrait Photo"
      />

      {/* Heading */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
          Page Heading
        </label>
        <input
          type="text"
          value={heading}
          onChange={(e) => { setHeading(e.target.value); setSaved(false); }}
          placeholder="Curating the world, one story at a time."
          className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2.5 text-on-surface placeholder:text-outline-variant text-sm font-body focus:outline-none focus:ring-1 focus:ring-secondary"
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
          Bio
        </label>
        <p className="text-xs text-outline font-body">
          Each paragraph on a new line. Blank line between paragraphs.
        </p>
        <textarea
          value={bio}
          onChange={(e) => { setBio(e.target.value); setSaved(false); }}
          rows={10}
          placeholder={"Write your first paragraph here.\n\nThen your second paragraph.\n\nAnd so on."}
          className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2.5 text-on-surface placeholder:text-outline-variant text-sm font-body focus:outline-none focus:ring-1 focus:ring-secondary resize-y"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
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
      </div>

      {error && <p className="text-xs text-error font-body">{error}</p>}
    </div>
  );
}
