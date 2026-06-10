create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text null check (name is null or char_length(name) <= 100),
  email text null check (email is null or char_length(email) <= 254),
  message text not null check (
    char_length(message) between 3 and 4000
  ),
  created_at timestamp with time zone not null default now()
);

alter table public.feedback enable row level security;

drop policy if exists "Anyone can submit feedback" on public.feedback;
create policy "Anyone can submit feedback"
on public.feedback
for insert
to anon, authenticated
with check (true);
