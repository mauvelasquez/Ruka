-- Adds identity document metadata columns to profiles.
-- Images are never stored — only the extracted metadata and verification result.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS id_document_type    TEXT,
  ADD COLUMN IF NOT EXISTS id_document_country  CHAR(2),
  ADD COLUMN IF NOT EXISTS id_document_number   TEXT,
  ADD COLUMN IF NOT EXISTS id_full_name         TEXT,
  ADD COLUMN IF NOT EXISTS id_verified          BOOLEAN     DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS id_verified_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS id_rejection_reason  TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_id_verified ON profiles(id_verified);
