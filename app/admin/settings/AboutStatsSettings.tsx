"use client";

import { useState, useTransition } from "react";
import { saveAboutStatsAction } from "./actions";

interface Props {
  initialStat1Value: string;
  initialStat1Label: string;
  initialStat2Value: string;
  initialStat2Label: string;
  initialStat3Value: string;
  initialStat3Label: string;
}

export default function AboutStatsSettings({
  initialStat1Value,
  initialStat1Label,
  initialStat2Value,
  initialStat2Label,
  initialStat3Value,
  initialStat3Label,
}: Props) {
  const [stats, setStats] = useState([
    { value: initialStat1Value, label: initialStat1Label },
    { value: initialStat2Value, label: initialStat2Label },
    { value: initialStat3Value, label: initialStat3Label },
  ]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function update(index: number, field: "value" | "label", v: string) {
    setSaved(false);
    setStats((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: v } : s)));
  }

  function handleSave() {
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const result = await saveAboutStatsAction({
        stat1Value: stats[0].value,
        stat1Label: stats[0].label,
        stat2Value: stats[1].value,
        stat2Label: stats[1].label,
        stat3Value: stats[2].value,
        stat3Label: stats[2].label,
      });
      if (result?.error) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <div className="space-y-4">
      {stats.map((stat, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="space-y-1 w-28 shrink-0">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
              Τιμή {i + 1}
            </label>
            <input
              type="text"
              value={stat.value}
              onChange={(e) => update(i, "value", e.target.value)}
              placeholder="42"
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-on-surface placeholder:text-outline-variant text-sm font-body focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
              Ετικέτα {i + 1}
            </label>
            <input
              type="text"
              value={stat.label}
              onChange={(e) => update(i, "label", e.target.value)}
              placeholder="Χώρες"
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-on-surface placeholder:text-outline-variant text-sm font-body focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
        </div>
      ))}

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
