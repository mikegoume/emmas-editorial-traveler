-- ============================================================================
-- Media URL migration: store bare object paths instead of absolute URLs
--
-- STATUS: NOT APPLIED — review before running.
-- Run in the Supabase SQL editor. Steps 0–2 are one transaction; step 3 verifies.
--
-- Precondition: lib/media.ts getMediaUrl() is deployed. It resolves bare paths
-- against NEXT_PUBLIC_CDN_URL, so rendering keeps working after this migration.
-- ============================================================================

-- ─── 0. Backup ──────────────────────────────────────────────────────────────
-- Plain tables, not temp — they must survive the session for rollback.
BEGIN;

CREATE TABLE IF NOT EXISTS _media_backup_gallery_images AS
  SELECT id, url FROM gallery_images;

CREATE TABLE IF NOT EXISTS _media_backup_destinations AS
  SELECT id, hero_image_url, featured_image_url, document_url FROM destinations;

CREATE TABLE IF NOT EXISTS _media_backup_site_settings AS
  SELECT key, value FROM site_settings;

-- ─── 1. Strip the origin, leaving the object key ────────────────────────────
-- Matches BOTH the old pub-*.r2.dev origin and the new cdn.daskalosapp.com,
-- so this is safe to re-run and safe if some rows were already rewritten.
-- The regex is anchored (^) and the trailing /? removes the separating slash.

UPDATE gallery_images
SET url = regexp_replace(
      url, '^https?://(pub-[a-z0-9]+\.r2\.dev|cdn\.daskalosapp\.com)/?', '')
WHERE url ~ '^https?://(pub-[a-z0-9]+\.r2\.dev|cdn\.daskalosapp\.com)/';

UPDATE destinations
SET hero_image_url = regexp_replace(
      hero_image_url, '^https?://(pub-[a-z0-9]+\.r2\.dev|cdn\.daskalosapp\.com)/?', '')
WHERE hero_image_url ~ '^https?://(pub-[a-z0-9]+\.r2\.dev|cdn\.daskalosapp\.com)/';

UPDATE destinations
SET featured_image_url = regexp_replace(
      featured_image_url, '^https?://(pub-[a-z0-9]+\.r2\.dev|cdn\.daskalosapp\.com)/?', '')
WHERE featured_image_url ~ '^https?://(pub-[a-z0-9]+\.r2\.dev|cdn\.daskalosapp\.com)/';

UPDATE destinations
SET document_url = regexp_replace(
      document_url, '^https?://(pub-[a-z0-9]+\.r2\.dev|cdn\.daskalosapp\.com)/?', '')
WHERE document_url ~ '^https?://(pub-[a-z0-9]+\.r2\.dev|cdn\.daskalosapp\.com)/';

UPDATE site_settings
SET value = regexp_replace(
      value, '^https?://(pub-[a-z0-9]+\.r2\.dev|cdn\.daskalosapp\.com)/?', '')
WHERE key IN ('hero_image_url', 'about_photo_url')
  AND value ~ '^https?://(pub-[a-z0-9]+\.r2\.dev|cdn\.daskalosapp\.com)/';

-- ─── 2. Sanity check BEFORE committing ──────────────────────────────────────
-- Expect: zero rows. Any row here means an absolute URL survived the rewrite.
SELECT 'gallery_images' AS src, url AS val FROM gallery_images WHERE url ~ '^https?://'
UNION ALL SELECT 'dest.hero',     hero_image_url     FROM destinations WHERE hero_image_url     ~ '^https?://'
UNION ALL SELECT 'dest.featured', featured_image_url FROM destinations WHERE featured_image_url ~ '^https?://'
UNION ALL SELECT 'dest.document', document_url       FROM destinations WHERE document_url       ~ '^https?://'
UNION ALL SELECT 'site_settings', value FROM site_settings
          WHERE key IN ('hero_image_url','about_photo_url') AND value ~ '^https?://';

-- Expect paths like: images/gallery/1780986314473-yiljlv8l40a.jpeg
SELECT url FROM gallery_images ORDER BY created_at LIMIT 5;

COMMIT;   -- or ROLLBACK; if the checks above look wrong

-- ─── 3. Rollback (only if something broke after commit) ─────────────────────
-- UPDATE gallery_images g SET url = b.url
--   FROM _media_backup_gallery_images b WHERE b.id = g.id;
-- UPDATE destinations d SET hero_image_url = b.hero_image_url,
--        featured_image_url = b.featured_image_url, document_url = b.document_url
--   FROM _media_backup_destinations b WHERE b.id = d.id;
-- UPDATE site_settings s SET value = b.value
--   FROM _media_backup_site_settings b WHERE b.key = s.key;

-- ─── 4. Cleanup (after the site is confirmed healthy) ───────────────────────
-- DROP TABLE _media_backup_gallery_images;
-- DROP TABLE _media_backup_destinations;
-- DROP TABLE _media_backup_site_settings;
