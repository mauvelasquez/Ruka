-- SECURITY FIX #4: Agregar WITH CHECK a la policy de mensajes para evitar sender_id spoofing
--
-- Problema: la policy "participants_only" solo tenía cláusula USING.
-- Sin WITH CHECK explícito, PostgreSQL la aplica también al INSERT,
-- pero permite insertar con receiver_id = auth.uid() y sender_id = otro_usuario,
-- suplantando al remitente en el historial de mensajes.
--
-- La API del servidor ya fuerza sender_id = user.id, pero la REST API directa de Supabase
-- (con el anon key + token) podía bypassear esa lógica.

DROP POLICY IF EXISTS "participants_only" ON public.messages;

-- SELECT / UPDATE / DELETE: participante del intercambio
CREATE POLICY "participants_can_read"
  ON public.messages
  FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- INSERT: el sender DEBE ser el usuario autenticado
CREATE POLICY "sender_must_be_self"
  ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);
