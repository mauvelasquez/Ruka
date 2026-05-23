-- Add 'id_verified' status for OCR-only identity verification (facial step disabled).
-- 'verified' remains valid for accounts verified with full face-match flow.

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_verification_status_check,
  ADD CONSTRAINT profiles_verification_status_check
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'id_verified', 'rejected'));
