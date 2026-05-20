-- identity_verifications: stores only hashed RUT + result metadata.
-- Biometric images and embeddings never reach the server.

CREATE TABLE IF NOT EXISTS identity_verifications (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rut_hash          TEXT        NOT NULL,
  verified_at       TIMESTAMPTZ DEFAULT now(),
  method            TEXT        DEFAULT 'id_ocr_face_match',
  confidence_score  FLOAT,
  attempts          INTEGER     DEFAULT 1,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- Prevents one RUT from being used by multiple accounts
CREATE UNIQUE INDEX IF NOT EXISTS idx_identity_verifications_rut_hash
  ON identity_verifications(rut_hash);

CREATE INDEX IF NOT EXISTS idx_identity_verifications_user_id
  ON identity_verifications(user_id);

ALTER TABLE identity_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verification"
  ON identity_verifications FOR SELECT
  USING (auth.uid() = user_id);
