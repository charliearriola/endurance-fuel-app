-- Extra athlete preferences that feed the (future) food-suggestion engine.
-- Not used by the macro-calculation formulas in lib/macros.ts today — these
-- exist so onboarding/settings can start collecting them now.

alter table public.profiles
  add column if not exists disliked_foods text[] not null default '{}',
  add column if not exists favorite_foods text[] not null default '{}',
  add column if not exists diet_strictness smallint not null default 3
    check (diet_strictness between 1 and 5),
  add column if not exists cheat_meals_per_week smallint not null default 1
    check (cheat_meals_per_week between 0 and 7),
  add column if not exists budget_level text not null default 'medium'
    check (budget_level in ('low', 'medium', 'high'));
