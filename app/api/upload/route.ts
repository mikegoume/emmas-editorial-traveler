import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { R2_BUCKET, R2_PUBLIC_BASE, r2 } from "@/lib/r2";
import { createServerClient } from "@/lib/supabase-server";

// Only these prefixes are allowed — they mirror the migrated R2 key structure.
const ALLOWED_FOLDERS = new Set([
  "images",
  "images/gallery",
  "images/content",
  "documents",
]);

export async function POST(request: Request) {
  // Auth-gate: middleware does not cover /api, so verify the admin session here.
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { folder, ext, contentType } = await request.json().catch(() => ({}));

  if (!ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }

  const safeExt = String(ext || "bin").replace(/[^a-z0-9]/gi, "").toLowerCase();
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;

  const uploadUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType || "application/octet-stream",
    }),
    { expiresIn: 60 },
  );

  return NextResponse.json({
    uploadUrl,
    publicUrl: `${R2_PUBLIC_BASE}/${key}`,
  });
}
