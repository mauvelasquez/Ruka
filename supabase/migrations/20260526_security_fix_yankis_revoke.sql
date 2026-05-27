-- SECURITY FIX #1: Revocar ejecución pública de funciones SECURITY DEFINER de Yankis
--
-- Problema: credit_yankis y debit_yankis son SECURITY DEFINER pero sin REVOKE.
-- Cualquier usuario autenticado podía llamarlas directamente vía supabase.rpc()
-- y acreditarse Yankis arbitrarios (fraude financiero).
--
-- Las funciones siguen siendo invocadas desde las rutas API del servidor (service_role),
-- que son las únicas que deben llamarlas.

REVOKE ALL ON FUNCTION public.credit_yankis(UUID, INTEGER, TEXT, TEXT, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.credit_yankis(UUID, INTEGER, TEXT, TEXT, UUID) FROM authenticated;
REVOKE ALL ON FUNCTION public.credit_yankis(UUID, INTEGER, TEXT, TEXT, UUID) FROM anon;

REVOKE ALL ON FUNCTION public.debit_yankis(UUID, INTEGER, TEXT, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.debit_yankis(UUID, INTEGER, TEXT, UUID) FROM authenticated;
REVOKE ALL ON FUNCTION public.debit_yankis(UUID, INTEGER, TEXT, UUID) FROM anon;
