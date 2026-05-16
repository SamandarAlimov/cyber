
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- User progress
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

alter table public.user_progress enable row level security;

create policy "Users can view own progress"
  on public.user_progress for select using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert with check (auth.uid() = user_id);

create policy "Users can delete own progress"
  on public.user_progress for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Update streak when progress is inserted
create or replace function public.update_streak()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  last_date date;
  current integer;
  longest integer;
  today date := current_date;
begin
  select last_activity_date, current_streak, longest_streak
    into last_date, current, longest
    from public.profiles where id = new.user_id;

  if last_date is null or last_date < today - interval '1 day' then
    current := 1;
  elsif last_date = today - interval '1 day' then
    current := current + 1;
  end if;

  if current > coalesce(longest, 0) then
    longest := current;
  end if;

  update public.profiles
    set current_streak = current,
        longest_streak = longest,
        last_activity_date = today,
        updated_at = now()
    where id = new.user_id;

  return new;
end;
$$;

create trigger on_progress_insert
  after insert on public.user_progress
  for each row execute function public.update_streak();

-- updated_at trigger for profiles
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_touch_updated
  before update on public.profiles
  for each row execute function public.touch_updated_at();
