create table if not exists monitor_seen_posts (
  id         uuid        default gen_random_uuid() primary key,
  url        text        unique not null,
  source     text,
  title      text,
  snippet    text,
  created_at timestamptz default now()
);

create index if not exists monitor_seen_posts_created_at_idx
  on monitor_seen_posts(created_at);

-- Solo el rol de servicio puede operar esta tabla
alter table monitor_seen_posts enable row level security;

create policy "service role only"
  on monitor_seen_posts
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Limpiar posts de más de 30 días automáticamente vía pg_cron (opcional)
-- Si tienes pg_cron habilitado en tu proyecto Supabase:
-- select cron.schedule('cleanup-monitor', '0 3 * * *',
--   $$delete from monitor_seen_posts where created_at < now() - interval '30 days'$$);
