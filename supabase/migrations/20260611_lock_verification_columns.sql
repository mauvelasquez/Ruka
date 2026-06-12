-- SECURITY FIX: profiles_update_own no restringe columnas
--
-- La policy RLS profiles_update_own (USING auth.uid() = id, sin WITH CHECK)
-- permite a cualquier usuario autenticado escribir CUALQUIER columna de su
-- propia fila, incluyendo las derivadas del proceso de verificación de
-- identidad. Un usuario podía ejecutar desde el cliente:
--
--   supabase.from('profiles').update({ verified: true, verification_status: 'verified' })
--
-- ...y auto-verificarse sin pasar por OCR ni selfie.
--
-- Este trigger revierte esas columnas a su valor anterior (OLD) en cualquier
-- UPDATE que no provenga de service_role. Las rutas /api/verify-id/* y
-- /api/verify-id/confirm-existing ya usan el cliente admin (service_role) y
-- no se ven afectadas.

CREATE OR REPLACE FUNCTION public.lock_verification_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  NEW.verified                  := OLD.verified;
  NEW.verification_status       := OLD.verification_status;
  NEW.verification_completed_at := OLD.verification_completed_at;
  NEW.identification_number     := OLD.identification_number;
  NEW.identification_type       := OLD.identification_type;
  NEW.identification_country    := OLD.identification_country;
  NEW.id_full_name               := OLD.id_full_name;
  NEW.id_rejection_reason       := OLD.id_rejection_reason;
  NEW.birth_date                := OLD.birth_date;
  NEW.liveness                  := OLD.liveness;
  NEW.selfie_attempts           := OLD.selfie_attempts;
  NEW.full_name                 := OLD.full_name;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.lock_verification_columns() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.lock_verification_columns() FROM authenticated;
REVOKE ALL ON FUNCTION public.lock_verification_columns() FROM anon;

DROP TRIGGER IF EXISTS lock_verification_columns_trigger ON public.profiles;

CREATE TRIGGER lock_verification_columns_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.lock_verification_columns();
