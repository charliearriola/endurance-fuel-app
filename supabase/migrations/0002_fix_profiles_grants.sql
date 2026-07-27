-- Fixes "permission denied for table profiles".
--
-- RLS policies (created in 0001) only filter WHICH rows a role can touch —
-- they never grant the underlying ability to SELECT/INSERT/UPDATE the table
-- in the first place. That base privilege is a separate Postgres layer and
-- has to be granted explicitly. Without it, Postgres blocks the query
-- before RLS is even evaluated, which is why the error says "permission
-- denied" instead of "new row violates row-level security policy".

grant usage on schema public to authenticated;

grant select, insert, update on public.profiles to authenticated;
