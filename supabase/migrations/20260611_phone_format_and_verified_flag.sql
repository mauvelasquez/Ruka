-- Teléfono chileno: formato E.164 obligatorio + flag para verificación futura (OTP)
--
-- phone_verified: preparación para un futuro flujo de verificación por SMS/OTP.
-- No se implementa OTP en esta migración — queda en false por defecto.
--
-- CHECK: permite NULL (usuarios existentes sin teléfono siguen siendo válidos),
-- pero si hay un valor debe ser +569 seguido de 8 dígitos (+569XXXXXXXX).

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_phone_format_check
  CHECK (phone IS NULL OR phone ~ '^\+569[0-9]{8}$');
