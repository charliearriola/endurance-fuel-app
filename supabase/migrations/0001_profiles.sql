-- Athlete profiles for Endurance Fuel System.
-- One row per auth.users row, created automatically on signup via trigger below.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  age smallint check (age between 1 and 120),
  sex text check (sex in ('male', 'female', 'other')),
  weight_kg numeric(5, 2) check (weight_kg > 0),
  height_cm numeric(5, 1) check (height_cm > 0),
  sport text check (sport in ('runner', 'cyclist', 'swimmer', 'triathlete')),
  experience_level text check (experience_level in ('beginner', 'intermediate', 'advanced', 'elite')),
  goal text check (goal in ('performance', 'fat_loss', 'recovery', 'race_day')),
  dietary_restrictions text[] not null default '{}',
  plan_type text not null default 'free' check (plan_type in ('free', 'race_day', 'starter', 'pro')),
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Keep updated_at current on every row change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Auto-create a bare profile row the moment someone signs up, so onboarding
-- only ever needs to UPDATE, never INSERT. Runs as the function owner
-- (bypassing RLS), which is what lets it write a row the new user doesn't
-- technically have insert rights to yet at signup time.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
