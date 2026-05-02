-- ── app_logs: structured application log table for Rukka ─────────────────────
--
-- Useful queries:
--   Últimos 50 errores:
--     SELECT * FROM app_logs WHERE level='error' ORDER BY created_at DESC LIMIT 50;
--
--   Errores de un usuario específico:
--     SELECT * FROM app_logs WHERE user_id='<uuid>' ORDER BY created_at DESC;
--
--   Errores de una fuente:
--     SELECT * FROM app_logs WHERE source='airbnb-import' ORDER BY created_at DESC;
--
--   Errores de la última hora:
--     SELECT * FROM app_logs WHERE level='error' AND created_at > now() - interval '1 hour';
--
--   Errores con campo del metadata:
--     SELECT created_at, source, message, metadata->>'roomId' AS room
--     FROM app_logs WHERE level='error' AND source='airbnb-import';
--
--   Duración promedio por fuente:
--     SELECT source, AVG(duration_ms) AS avg_ms, COUNT(*) FROM app_logs GROUP BY source;

create table if not exists public.app_logs (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  level       text        not null check (level in ('error', 'warn', 'info', 'debug')),
  source      text        not null,
  message     text        not null,
  user_id     uuid        references auth.users(id) on delete set null,
  route       text,
  request_id  text,
  duration_ms integer,
  metadata    jsonb,
  environment text        default current_setting('app.environment', true)
);

create index on public.app_logs (level, created_at desc);
create index on public.app_logs (source, created_at desc);
create index on public.app_logs (user_id, created_at desc);
create index on public.app_logs (created_at desc);

alter table public.app_logs enable row level security;

-- Solo service_role puede escribir y leer — nunca el cliente anónimo
create policy "service_role_only" on public.app_logs
  using (auth.role() = 'service_role');
