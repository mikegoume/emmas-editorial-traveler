"use client";

import dynamic from "next/dynamic";

// pdfjs touches browser-only APIs (DOMMatrix), so load the viewer client-side only.
const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/15 p-12 flex items-center justify-center animate-pulse">
      <div className="flex items-center gap-3 text-outline">
        <span className="material-symbols-outlined animate-spin">refresh</span>
        <span className="font-label text-sm uppercase tracking-widest">
          Loading guide...
        </span>
      </div>
    </div>
  ),
});

export default function PdfViewerWrapper({ url }: { url: string }) {
  return <PdfViewer url={url} />;
}
