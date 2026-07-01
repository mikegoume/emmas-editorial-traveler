// Client-side helper: upload a file to Cloudflare R2 via a presigned PUT URL.
// The browser asks our auth-gated /api/upload route for a signed URL, then PUTs the
// file straight to R2 (bypassing serverless body-size limits — important for large PDFs).
//
// `folder` becomes the key prefix and must match the migrated R2 paths:
//   "images" | "images/gallery" | "images/content" | "documents"
export async function uploadToR2(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      folder,
      ext,
      contentType: file.type || "application/octet-stream",
    }),
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || `Upload failed to initialize (${res.status})`);
  }

  const { uploadUrl, publicUrl } = (await res.json()) as {
    uploadUrl: string;
    publicUrl: string;
  };

  const put = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "application/octet-stream" },
  });

  if (!put.ok) {
    throw new Error(`Upload failed (${put.status})`);
  }

  return publicUrl;
}
