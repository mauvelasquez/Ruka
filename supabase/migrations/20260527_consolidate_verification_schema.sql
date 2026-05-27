-- Consolidate identity verification schema
--
-- Problems fixed:
--   1. Three overlapping boolean fields (verified / identification_verified / id_verified)
--      consolidated into a single canonical `verified` column.
--   2. id_document_country was CHAR without length, now migrated into
--      identification_country (TEXT) and dropped.
--   3. id_document_* columns (added 20260525) are migrated into the
--      identification_* columns used by the rest of the app, then dropped.
--   4. birth_date column ensured to exist.

-- ── 1. Ensure canonical columns exist ────────────────────────────────────────

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS verified               BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS identification_type    TEXT,
  ADD COLUMN IF NOT EXISTS identification_country TEXT,
  ADD COLUMN IF NOT EXISTS identification_number  TEXT,
  ADD COLUMN IF NOT EXISTS birth_date             DATE;

-- ── 2. Migrate id_document_* data into identification_* ──────────────────────

UPDATE profiles SET
  identification_number  = COALESCE(identification_number, id_document_number),
  identification_type    = COALESCE(identification_type, id_document_type),
  identification_country = COALESCE(identification_country, id_document_country::TEXT),
  id_full_name           = COALESCE(id_full_name, NULL)  -- already on same table; no-op placeholder
WHERE id_document_number  IS NOT NULL
   OR id_document_type    IS NOT NULL
   OR id_document_country IS NOT NULL;

-- ── 3. Consolidate all verification booleans → verified ──────────────────────

UPDATE profiles SET verified = TRUE
WHERE verified = FALSE
  AND (
    (identification_verified IS NOT NULL AND identification_verified = TRUE)
    OR (id_verified IS NOT NULL AND id_verified = TRUE)
  );

-- Also sync from verification_status for any stragglers
UPDATE profiles SET verified = TRUE
WHERE verified = FALSE
  AND verification_status IN ('verified', 'id_verified');

-- ── 4. Drop redundant boolean columns ────────────────────────────────────────

ALTER TABLE profiles
  DROP COLUMN IF EXISTS identification_verified,
  DROP COLUMN IF EXISTS id_verified,
  DROP COLUMN IF EXISTS id_verified_at;

-- ── 5. Drop migrated id_document_* columns ───────────────────────────────────

ALTER TABLE profiles
  DROP COLUMN IF EXISTS id_document_type,
  DROP COLUMN IF EXISTS id_document_country,
  DROP COLUMN IF EXISTS id_document_number;

-- ── 6. Update indexes ────────────────────────────────────────────────────────

DROP INDEX IF EXISTS idx_profiles_id_verified;
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON profiles(verified);
