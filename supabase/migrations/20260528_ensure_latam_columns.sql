-- Asegura que las columnas de expansión LATAM existen en homes y profiles.
-- Idempotente: usa IF NOT EXISTS. Seguro correr en prod aunque ya estén.

ALTER TABLE homes
  ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'CL',
  ADD COLUMN IF NOT EXISTS region_code  TEXT;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'CL';

UPDATE homes    SET country_code = 'CL' WHERE country_code IS NULL;
UPDATE profiles SET country_code = 'CL' WHERE country_code IS NULL;

-- Índices (IF NOT EXISTS ya los protege si existen)
CREATE INDEX IF NOT EXISTS idx_homes_country        ON homes(country_code);
CREATE INDEX IF NOT EXISTS idx_homes_country_region ON homes(country_code, region_code);
