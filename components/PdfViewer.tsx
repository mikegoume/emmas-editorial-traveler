"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Served from /public (copied from pdfjs-dist by the copy-pdf-worker script) so
// webpack/Terser never tries to bundle the ESM worker. Version-matched on install/build.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function PdfViewer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [numPages, setNumPages] = useState<number>(0);
  const [failed, setFailed] = useState(false);

  // Track the container width so each page scales to fill it.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
          Download PDF
        </a>
      </div>

      {/* Document body — all pages stacked in a single scroll */}
      <div
        ref={containerRef}
        className=" bg-surface-container-low flex flex-col items-center"
      >
        {failed ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-secondary text-3xl mb-3 block">
              error_outline
            </span>
            <p className="font-body text-on-surface-variant text-sm mb-4">
              Unable to preview this document. Download it to read offline.
            </p>
            <a
              href={url}
              download
              className="inline-flex items-center gap-2 text-secondary text-sm font-bold hover:underline"
            >
              <span className="material-symbols-outlined text-base">
                download
              </span>
              Download PDF
            </a>
          </div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={() => setFailed(true)}
            loading={
              <div className="flex items-center gap-3 text-outline py-12">
                <span className="material-symbols-outlined animate-spin">
                  refresh
                </span>
                <span className="font-label text-sm uppercase tracking-widest">
                  Loading guide...
                </span>
              </div>
            }
            error={
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-secondary text-3xl mb-3 block">
                  error_outline
                </span>
                <p className="font-body text-on-surface-variant text-sm">
                  Unable to preview this document.
                </p>
              </div>
            }
            className="w-full flex flex-col items-center gap-4 md:gap-6"
          >
            {Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i + 1}
                pageNumber={i + 1}
                width={width || undefined}
                renderAnnotationLayer
                renderTextLayer
                className="shadow-md rounded-md overflow-hidden bg-white"
              />
            ))}
          </Document>
        )}
      </div>
    </div>
  );
}
