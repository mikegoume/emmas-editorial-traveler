import { S3Client } from "@aws-sdk/client-s3";

// Server-only R2 (S3-compatible) client. Never import this from a "use client" file —
// it reads secret credentials from the environment.
const accountId = process.env.R2_ACCOUNT_ID!;

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET = process.env.R2_BUCKET!;

// Public base URL objects are served from. Re-exported from lib/media so the CDN origin
// has exactly one definition shared by uploads and rendering.
export { CDN_BASE as R2_PUBLIC_BASE } from "./media";
