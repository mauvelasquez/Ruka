-- Separates identity verification from email/onboarding confirmation.
-- Existing rows receive DEFAULT 'unverified' automatically — no backfill needed.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'unverified'
    CONSTRAINT profiles_verification_status_check
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  ADD COLUMN IF NOT EXISTS verification_completed_at timestamptz;
