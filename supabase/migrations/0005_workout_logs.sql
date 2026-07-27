-- Training logs, one row per day per athlete (see unique constraint below).
--
-- Two additions beyond the original spec, both needed to make the "Today's
-- Training" dashboard card work as described:
--   1. `time_of_day` — the meal-timing engine branches on whether training
--      happens morning/afternoon/evening, but nothing else in the schema
--      captures that. Defaults to 'morning' since it's the most common
--      slot for endurance athletes.
--   2. `unique (user_id, logged_date)` — the dashboard shows exactly one
--      training entry per day with an edit affordance, so logging is an
--      upsert keyed on (user, day) rather than an open-ended list.

create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  logged_date date not null default current_date,
  sport text not null check (sport in ('runner', 'cyclist', 'swimmer', 'triathlete')),
  duration_minutes integer not null check (duration_minutes > 0),
  intensity text not null check (intensity in ('easy', 'moderate', 'hard', 'race')),
  training_phase text not null default 'base'
    check (training_phase in ('base', 'build', 'peak', 'taper', 'recovery')),
  time_of_day text not null default 'morning'
    check (time_of_day in ('morning', 'afternoon', 'evening')),
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, logged_date)
);

alter table public.workout_logs enable row level security;

create policy "Users can view own workout logs"
  on public.workout_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own workout logs"
  on public.workout_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own workout logs"
  on public.workout_logs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own workout logs"
  on public.workout_logs for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.workout_logs to authenticated;
