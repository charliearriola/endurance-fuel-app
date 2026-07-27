-- Sport and goal become multi-select in onboarding, so both columns move
-- from a single text value to a text[]. Renamed to plural (sports/goals) to
-- reflect that they now hold zero-or-more values.

alter table public.profiles rename column sport to sports;

alter table public.profiles
  alter column sports type text[]
  using case when sports is null then '{}'::text[] else array[sports] end;

alter table public.profiles
  alter column sports set default '{}',
  alter column sports set not null;

alter table public.profiles drop constraint if exists profiles_sport_check;

alter table public.profiles
  add constraint profiles_sports_check check (
    sports <@ array['runner', 'cyclist', 'swimmer', 'triathlete']::text[]
  );

alter table public.profiles rename column goal to goals;

alter table public.profiles
  alter column goals type text[]
  using case when goals is null then '{}'::text[] else array[goals] end;

alter table public.profiles
  alter column goals set default '{}',
  alter column goals set not null;

alter table public.profiles drop constraint if exists profiles_goal_check;

alter table public.profiles
  add constraint profiles_goals_check check (
    goals <@ array['performance', 'fat_loss', 'recovery', 'race_day']::text[]
  );
