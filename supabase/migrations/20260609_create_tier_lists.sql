create table if not exists public.tier_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled tier list',
  data jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.tier_lists enable row level security;

create or replace function public.set_tier_lists_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tier_lists_updated_at on public.tier_lists;

create trigger set_tier_lists_updated_at
before update on public.tier_lists
for each row
execute function public.set_tier_lists_updated_at();

drop policy if exists "Users can select their own tier lists" on public.tier_lists;
create policy "Users can select their own tier lists"
on public.tier_lists
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own tier lists" on public.tier_lists;
create policy "Users can insert their own tier lists"
on public.tier_lists
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own tier lists" on public.tier_lists;
create policy "Users can update their own tier lists"
on public.tier_lists
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own tier lists" on public.tier_lists;
create policy "Users can delete their own tier lists"
on public.tier_lists
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Anyone can read public tier lists" on public.tier_lists;
create policy "Anyone can read public tier lists"
on public.tier_lists
for select
to anon, authenticated
using (is_public = true);
