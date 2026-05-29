-- Add liveness verification tracking fields
--
-- liveness:
--   NULL  = selfie step not attempted (OCR-only or flow not completed)
--   TRUE  = passed facial liveness check
--   FALSE = failed selfie 3+ times (bypass applied, partially verified)
--
-- selfie_attempts:
--   Counter of failed selfie attempts, persisted across sessions.
--   Resets to 0 on successful liveness pass.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS liveness         BOOLEAN DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS selfie_attempts  INTEGER DEFAULT 0;
