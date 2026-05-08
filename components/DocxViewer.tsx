import mammoth from "mammoth";

type Props = {
  url: string;
};

export default async function DocxViewer({ url }: Props) {
  let html = "";
  let error = "";

  try {
    // Fetch the .docx file from WordPress media library
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error(`Failed to fetch document: ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert .docx → HTML using mammoth
    const result = await mammoth.convertToHtml(
      { buffer },
      {
        // Style map — maps Word styles to clean HTML elements
        styleMap: [
          "p[style-name='Heading 1'] => h2:fresh",
          "p[style-name='Heading 2'] => h3:fresh",
          "p[style-name='Heading 3'] => h4:fresh",
          "b => strong",
          "i => em",
        ],
      },
    );

    html = result.value;

    if (result.messages.length > 0) {
      console.warn("Mammoth warnings:", result.messages);
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not load document.";
    console.error("DocxViewer error:", error);
  }

  if (error) {
    return (
      <div className="rounded-lg bg-error-container/20 border border-error/20 p-8 text-center">
        <span className="material-symbols-outlined text-error text-3xl mb-3 block">
          error_outline
        </span>
        <p className="font-body text-error text-sm">{error}</p>
        <a
          href={url}
          download
          className="mt-4 inline-flex items-center gap-2 text-secondary text-sm font-bold hover:underline"
        >
          <span className="material-symbols-outlined text-base">download</span>
          Download file instead
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

      {/* Document content */}
      <div className="p-8 md:p-12">
        <div
          className="prose prose-lg max-w-none font-body text-on-surface-variant leading-relaxed
            prose-headings:font-headline prose-headings:text-on-surface prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-2
            prose-p:mb-5 prose-p:text-lg
            prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-lg prose-img:shadow-md
            prose-blockquote:border-l-4 prose-blockquote:border-secondary prose-blockquote:pl-6 prose-blockquote:italic
            prose-strong:text-on-surface
            prose-ul:my-4 prose-ol:my-4
            prose-li:my-1 prose-li:text-lg
            prose-table:w-full prose-th:bg-surface-container-low prose-td:border prose-td:border-outline-variant/20 prose-td:p-3"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
