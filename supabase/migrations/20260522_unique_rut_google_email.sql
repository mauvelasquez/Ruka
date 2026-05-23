-- Unique constraint on profiles.rut
-- NULL values are allowed (users without verified identity have rut = NULL).
-- If this fails due to existing duplicate RUTs, manually clear them first:
--   UPDATE profiles SET rut = NULL WHERE id NOT IN (
--     SELECT DISTINCT ON (rut) id FROM profiles WHERE rut IS NOT NULL ORDER BY rut, verification_completed_at DESC NULLS LAST
--   ) AND rut IS NOT NULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_rut_unique'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_rut_unique UNIQUE (rut);
  END IF;
END$$;
