-- Expansión Latinoamericana: Chile · México · Colombia · Argentina

ALTER TABLE homes
  ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'CL',
  ADD COLUMN IF NOT EXISTS region_code  TEXT;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'CL';

CREATE INDEX IF NOT EXISTS idx_homes_country        ON homes(country_code);
CREATE INDEX IF NOT EXISTS idx_homes_country_region ON homes(country_code, region_code);

UPDATE homes    SET country_code = 'CL' WHERE country_code IS NULL;
UPDATE profiles SET country_code = 'CL' WHERE country_code IS NULL;
