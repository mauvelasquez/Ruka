-- Consolidate identity verification schema (prod-safe version)
--
-- Context: migrations 20260525_add_id_profile_columns and 20260520_id_verified_status
-- were never applied to prod, so id_document_* and id_verified columns don't exist.
-- This migration only operates on columns confirmed to exist in the prod DB.
--
-- What this does:
--   1. Ensure canonical columns exist (verified, identification_*, birth_date)
--   2. Consolidate redundant booleans → verified (only if those columns exist)
--   3. Sync verified from verification_status for any stragglers
--   4. Drop redundant columns that may exist (safe with IF EXISTS)
--   5. Fix verification_status check constraint to include 'id_verified'
--   6. Recreate index on verified

-- ── 1. Ensure canonical columns exist ────────────────────────────────────────

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS verified               BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS identification_type    TEXT,
  ADD COLUMN IF NOT EXISTS identification_country TEXT,
  ADD COLUMN IF NOT EXISTS identification_number  TEXT,
  ADD COLUMN IF NOT EXISTS birth_date             DATE,
  ADD COLUMN IF NOT EXISTS id_full_name           TEXT;

-- ── 2. Conditionally consolidate redundant boolean columns → verified ─────────
-- Uses DO block so it doesn't fail if identification_verified / id_verified
-- don't exist in this environment.

DO $safe$
DECLARE
  col_exists boolean;
BEGIN
  -- identification_verified
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'profiles'
      AND column_name  = 'identification_verified'
  ) INTO col_exists;

  IF col_exists THEN
    UPDATE profiles SET verified = TRUE
    WHERE verified = FALSE AND identification_verified = TRUE;
  END IF;

  -- id_verified
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'profiles'
      AND column_name  = 'id_verified'
  ) INTO col_exists;

  IF col_exists THEN
    UPDATE profiles SET verified = TRUE
    WHERE verified = FALSE AND id_verified = TRUE;
  END IF;
END;
$safe$;

-- ── 3. Sync verified from verification_status ────────────────────────────────

UPDATE profiles SET verified = TRUE
WHERE verified = FALSE
  AND verification_status IN ('verified', 'id_verified');

-- ── 4. Drop redundant columns if they exist ──────────────────────────────────

ALTER TABLE profiles
  DROP COLUMN IF EXISTS identification_verified,
  DROP COLUMN IF EXISTS id_verified,
  DROP COLUMN IF EXISTS id_verified_at,
  DROP COLUMN IF EXISTS id_document_type,
  DROP COLUMN IF EXISTS id_document_country,
  DROP COLUMN IF EXISTS id_document_number;

-- ── 5. Fix verification_status check constraint ───────────────────────────────
-- Ensures 'id_verified' is a valid value (was missing in prod).

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_verification_status_check,
  ADD CONSTRAINT profiles_verification_status_check
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'id_verified', 'rejected'));

-- ── 6. Recreate index ────────────────────────────────────────────────────────

DROP INDEX IF EXISTS idx_profiles_id_verified;
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON profiles(verified);
