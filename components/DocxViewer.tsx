import mammoth from "mammoth";

async function fetchAndConvert(
  url: string,
): Promise<{ html: string; messages: string[] } | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const result = await mammoth.convertToHtml({ buffer }, {
      styleMap: [
        "p[style-name='Title'] => h1.doc-title",
        "p[style-name='Subtitle'] => p.doc-subtitle",
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='List Paragraph'] => li:fresh",
        "r[style-name='Strong'] => strong",
        "r[style-name='Emphasis'] => em",
      ],
    });
    return { html: result.value, messages: result.messages.map((m) => m.message) };
  } catch {
    return null;
  }
}

export default async function DocxViewer({ url }: { url: string }) {
  const result = await fetchAndConvert(url);

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

      {/* Document body */}
      <div className="p-6 md:p-12 bg-white dark:bg-surface-container-lowest">
        {result?.html ? (
          <>
            <style>{`
              .docx-content { font-family: Georgia, 'Times New Roman', serif; font-size: 16px; line-height: 1.8; color: #1a1a1a; }
              .docx-content h1 { font-size: 2em; font-weight: 700; margin: 1.4em 0 0.6em; line-height: 1.2; color: #111; }
              .docx-content h2 { font-size: 1.5em; font-weight: 700; margin: 1.2em 0 0.5em; line-height: 1.3; color: #111; }
              .docx-content h3 { font-size: 1.2em; font-weight: 600; margin: 1em 0 0.4em; color: #111; }
              .docx-content h4 { font-size: 1em; font-weight: 600; margin: 0.8em 0 0.3em; color: #333; }
              .docx-content p { margin: 0 0 0.9em; }
              .docx-content p:last-child { margin-bottom: 0; }
              .docx-content strong, .docx-content b { font-weight: 700; }
              .docx-content em, .docx-content i { font-style: italic; }
              .docx-content u { text-decoration: underline; }
              .docx-content a { color: #1565c0; text-decoration: underline; }
              .docx-content ul { list-style: disc; padding-left: 1.6em; margin: 0.6em 0 0.9em; }
              .docx-content ol { list-style: decimal; padding-left: 1.6em; margin: 0.6em 0 0.9em; }
              .docx-content li { margin-bottom: 0.3em; }
              .docx-content blockquote { border-left: 4px solid #ccc; padding: 0.5em 1em; margin: 1em 0; color: #555; font-style: italic; }
              .docx-content table { width: 100%; border-collapse: collapse; margin: 1.2em 0; font-size: 0.93em; }
              .docx-content th { background: #f4f4f4; font-weight: 700; text-align: left; padding: 8px 12px; border: 1px solid #ddd; }
              .docx-content td { padding: 7px 12px; border: 1px solid #ddd; vertical-align: top; }
              .docx-content tr:nth-child(even) td { background: #fafafa; }
              .docx-content img { max-width: 100%; height: auto; border-radius: 6px; margin: 1em 0; }
              .docx-content .doc-title { font-size: 2.4em; font-weight: 800; text-align: center; margin-bottom: 0.3em; }
              .docx-content .doc-subtitle { text-align: center; color: #666; font-style: italic; margin-bottom: 1.5em; font-size: 1.1em; }
              .docx-content hr { border: none; border-top: 1px solid #e0e0e0; margin: 1.5em 0; }
            `}</style>
            <div
              className="docx-content max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: result.html }}
            />
          </>
        ) : (
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
              <span className="material-symbols-outlined text-base">download</span>
              Download .docx
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
