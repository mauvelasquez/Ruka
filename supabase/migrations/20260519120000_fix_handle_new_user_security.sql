-- ── Security fix: handle_new_user ────────────────────────────────────────────
--
-- Fixes tres warnings del Supabase Security Advisor:
--
--   1. Function Search Path Mutable
--      → Agrega SET search_path = '' para prevenir schema hijacking.
--
--   2 & 3. Public/Signed-In Users Can Execute SECURITY DEFINER Function
--      → Revoca EXECUTE de PUBLIC, authenticated y anon.
--        La función solo se invoca desde el trigger on_auth_user_created,
--        no necesita ser callable directamente por clientes.
--
-- El trigger on_auth_user_created NO se modifica; sigue funcionando igual.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''          -- previene schema hijacking
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    name,
    avatar,
    status
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      'Usuario'
    ),
    new.raw_user_meta_data->>'avatar_url',
    'pending'
  )
  ON CONFLICT (id) DO NOTHING;   -- la app puede haber creado el perfil primero

  RETURN new;
END;
$$;

-- Revocar acceso directo de ejecución pública
-- (la función es solo para uso interno del trigger del sistema)
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
