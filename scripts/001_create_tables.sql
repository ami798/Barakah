-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create lanterns table
create table if not exists public.lanterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create letters table (for sealed letters/messages)
create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  sealed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unlock_date timestamp with time zone default '2027-02-08'::timestamp with time zone,
  status text default 'sealed' check (status in ('sealed', 'sent', 'unlocked')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create journal_entries table
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  content text not null,
  emotion text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create echo_whispers table (sacred moments)
create table if not exists public.echo_whispers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  reflection text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create daily_boost table (daily messages)
create table if not exists public.daily_boost (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.lanterns enable row level security;
alter table public.letters enable row level security;
alter table public.journal_entries enable row level security;
alter table public.echo_whispers enable row level security;
alter table public.daily_boost enable row level security;

-- Create RLS Policies for profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Create RLS Policies for lanterns
create policy "lanterns_select_own" on public.lanterns for select using (auth.uid() = user_id);
create policy "lanterns_insert_own" on public.lanterns for insert with check (auth.uid() = user_id);
create policy "lanterns_update_own" on public.lanterns for update using (auth.uid() = user_id);
create policy "lanterns_delete_own" on public.lanterns for delete using (auth.uid() = user_id);

-- Create RLS Policies for letters
create policy "letters_select_own" on public.letters for select using (auth.uid() = user_id);
create policy "letters_insert_own" on public.letters for insert with check (auth.uid() = user_id);
create policy "letters_update_own" on public.letters for update using (auth.uid() = user_id);
create policy "letters_delete_own" on public.letters for delete using (auth.uid() = user_id);

-- Create RLS Policies for journal_entries
create policy "journal_entries_select_own" on public.journal_entries for select using (auth.uid() = user_id);
create policy "journal_entries_insert_own" on public.journal_entries for insert with check (auth.uid() = user_id);
create policy "journal_entries_update_own" on public.journal_entries for update using (auth.uid() = user_id);
create policy "journal_entries_delete_own" on public.journal_entries for delete using (auth.uid() = user_id);

-- Create RLS Policies for echo_whispers
create policy "echo_whispers_select_own" on public.echo_whispers for select using (auth.uid() = user_id);
create policy "echo_whispers_insert_own" on public.echo_whispers for insert with check (auth.uid() = user_id);
create policy "echo_whispers_update_own" on public.echo_whispers for update using (auth.uid() = user_id);
create policy "echo_whispers_delete_own" on public.echo_whispers for delete using (auth.uid() = user_id);

-- Create RLS Policies for daily_boost
create policy "daily_boost_select_own" on public.daily_boost for select using (auth.uid() = user_id);
create policy "daily_boost_insert_own" on public.daily_boost for insert with check (auth.uid() = user_id);
create policy "daily_boost_update_own" on public.daily_boost for update using (auth.uid() = user_id);
