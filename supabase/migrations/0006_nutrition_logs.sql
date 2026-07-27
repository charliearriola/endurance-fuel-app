-- Meal logs. Multiple rows per day per athlete (unlike workout_logs) —
-- someone can log breakfast, an extra snack, etc. independently.

create table if not exists public.nutrition_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  logged_date date not null default current_date,
  meal_type text check (
    meal_type in (
      'breakfast', 'pre_workout', 'during_workout', 'post_workout',
      'lunch', 'dinner', 'snack'
    )
  ),
  description text,
  calories_kcal numeric(7, 1),
  protein_g numeric(6, 1),
  carbs_g numeric(6, 1),
  fat_g numeric(6, 1),
  photo_url text,
  is_cheat_meal boolean not null default false,
  source text not null default 'manual'
    check (source in ('manual', 'plan', 'photo_analysis')),
  created_at timestamptz not null default now()
);

alter table public.nutrition_logs enable row level security;

create policy "Users can view own nutrition logs"
  on public.nutrition_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own nutrition logs"
  on public.nutrition_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own nutrition logs"
  on public.nutrition_logs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own nutrition logs"
  on public.nutrition_logs for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.nutrition_logs to authenticated;
