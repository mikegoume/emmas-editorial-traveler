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

// Public base URL that objects are served from (the r2.dev bucket URL, no trailing slash).
export const R2_PUBLIC_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!.replace(/\/$/, "");
