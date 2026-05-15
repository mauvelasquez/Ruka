create table if not exists public.messages (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  request_id   uuid        not null references public.exchange_requests(id) on delete cascade,
  sender_id    uuid        not null references auth.users(id) on delete cascade,
  receiver_id  uuid        not null references auth.users(id) on delete cascade,
  content      text        not null check (char_length(content) between 1 and 2000),
  read_at      timestamptz
);

create index on public.messages (request_id, created_at desc);
create index on public.messages (receiver_id, read_at) where read_at is null;

alter table public.messages enable row level security;

-- Solo los participantes del intercambio pueden leer y escribir
create policy "participants_only" on public.messages
  using (
    auth.uid() = sender_id or auth.uid() = receiver_id
  );
