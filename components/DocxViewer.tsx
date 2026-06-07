"use client";

export default function DocxViewer({ url }: { url: string }) {
  const isLocal =
    url.startsWith("http://localhost") || url.startsWith("blob:");

  if (isLocal) {
    return (
      <div className="rounded-lg bg-surface-container-low border border-outline-variant/15 p-8 text-center">
        <span className="material-symbols-outlined text-secondary text-3xl mb-3 block">
          info
        </span>
        <p className="font-body text-on-surface-variant text-sm">
          Document preview is available on the live site. Download the file to
          view it locally.
        </p>
        <a
          href={url}
          download
          className="mt-4 inline-flex items-center gap-2 text-secondary text-sm font-bold hover:underline"
        >
          <span className="material-symbols-outlined text-base">download</span>
          Download .docx
        </a>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/15 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-surface-container-low border-b border-outline-variant/15">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">
            description
          </span>
          <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Destination Guide
          </span>
        </div>
        <a
          href={url}
          download
          className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-full text-xs font-bold font-label hover:bg-secondary-dim transition-colors"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Download .docx
        </a>
      </div>

      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
        className="w-full border-0"
        style={{ height: "700px" }}
        title="Destination guide document"
      />
    </div>
  );
}
