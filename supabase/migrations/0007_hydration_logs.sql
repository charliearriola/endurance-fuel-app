-- Not in the original spec — added because the "Hydration Tracker" needs
-- somewhere to persist the glass count across reloads, and nothing else in
-- the schema covers it. One row per athlete per day, incremented by the "+"
-- button on the dashboard.

create table if not exists public.hydration_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  logged_date date not null default current_date,
  glasses_logged smallint not null default 0 check (glasses_logged >= 0),
  updated_at timestamptz not null default now(),
  unique (user_id, logged_date)
);

alter table public.hydration_logs enable row level security;

create policy "Users can view own hydration logs"
  on public.hydration_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own hydration logs"
  on public.hydration_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own hydration logs"
  on public.hydration_logs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.hydration_logs to authenticated;
