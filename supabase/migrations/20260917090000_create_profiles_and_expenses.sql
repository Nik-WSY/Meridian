-- profiles: one row per user. auth.users only knows auth details, so this is
-- where app-specific fields live -- most importantly `role`, which every
-- authorization decision in this app is based on. Role must NOT live in
-- user_metadata, since a user can edit their own user_metadata client-side.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'employee' check (role in ('employee', 'manager')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up, so there's never a
-- user without one. Everyone starts as 'employee' -- promote your first
-- test manager by hand afterwards.
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Helper used inside RLS policies to check "is the current user a manager".
-- Marked `security definer` so it reads `profiles` WITHOUT itself being
-- subject to RLS. Without this, a policy on `profiles` that queries
-- `profiles` to check the role recurses into itself, and Postgres rejects
-- it with "infinite recursion detected in policy for relation profiles".
create function is_manager()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'manager'
  );
$$;

-- expenses: the actual submissions.
create table expenses (
  id uuid primary key default gen_random_uuid(),
  submitter_id uuid not null references profiles(id) on delete cascade,
  description text not null,
  amount_cents integer not null check (amount_cents > 0),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table expenses enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Managers can view all profiles"
  on profiles for select
  using (is_manager());

create policy "Employees can view their own expenses"
  on expenses for select
  using (auth.uid() = submitter_id);

create policy "Managers can view all expenses"
  on expenses for select
  using (is_manager());

create policy "Employees can submit their own expenses"
  on expenses for insert
  with check (auth.uid() = submitter_id);

create policy "Managers can update expense status"
  on expenses for update
  using (is_manager())
  with check (is_manager());
