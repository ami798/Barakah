-- Barakah Lanterns Database Schema
-- Tables for user data persistence with Supabase

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lanterns table
CREATE TABLE IF NOT EXISTS public.lanterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  intention TEXT NOT NULL,
  brightness INTEGER DEFAULT 50 CHECK (brightness >= 0 AND brightness <= 100),
  release_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_released BOOLEAN DEFAULT FALSE,
  streak INTEGER DEFAULT 0,
  UNIQUE(id, user_id)
);

-- Letters table (messages in bottles)
CREATE TABLE IF NOT EXISTS public.letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sealed_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  unlock_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_opened BOOLEAN DEFAULT FALSE,
  opened_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id, user_id)
);

-- Journal entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  heart_level INTEGER NOT NULL CHECK (heart_level >= 1 AND heart_level <= 5),
  note TEXT,
  mood TEXT CHECK (mood IN ('radiant', 'calm', 'contemplative', 'restless', 'heavy')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Echo whispers table
CREATE TABLE IF NOT EXISTS public.echo_whispers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author TEXT,
  likes INTEGER DEFAULT 0,
  category TEXT CHECK (category IN ('wisdom', 'reflection', 'inspiration', 'healing')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id, user_id)
);

-- Daily boost table
CREATE TABLE IF NOT EXISTS public.daily_boost (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  message TEXT NOT NULL,
  seen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_lanterns_user_id ON public.lanterns(user_id);
CREATE INDEX IF NOT EXISTS idx_lanterns_created_at ON public.lanterns(created_at);
CREATE INDEX IF NOT EXISTS idx_letters_user_id ON public.letters(user_id);
CREATE INDEX IF NOT EXISTS idx_letters_unlock_date ON public.letters(unlock_date);
CREATE INDEX IF NOT EXISTS idx_journal_user_id ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_date ON public.journal_entries(date);
CREATE INDEX IF NOT EXISTS idx_echoes_user_id ON public.echo_whispers(user_id);
CREATE INDEX IF NOT EXISTS idx_echoes_created_at ON public.echo_whispers(created_at);
CREATE INDEX IF NOT EXISTS idx_daily_boost_user_id ON public.daily_boost(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_boost_date ON public.daily_boost(date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lanterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.echo_whispers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_boost ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Lanterns table policies
CREATE POLICY "Users can view their own lanterns"
  ON public.lanterns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lanterns"
  ON public.lanterns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lanterns"
  ON public.lanterns FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lanterns"
  ON public.lanterns FOR DELETE
  USING (auth.uid() = user_id);

-- Letters table policies
CREATE POLICY "Users can view their own letters"
  ON public.letters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own letters"
  ON public.letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own letters"
  ON public.letters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own letters"
  ON public.letters FOR DELETE
  USING (auth.uid() = user_id);

-- Journal entries table policies
CREATE POLICY "Users can view their own journal entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Echo whispers table policies
CREATE POLICY "Users can view their own echo whispers"
  ON public.echo_whispers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own echo whispers"
  ON public.echo_whispers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own echo whispers"
  ON public.echo_whispers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own echo whispers"
  ON public.echo_whispers FOR DELETE
  USING (auth.uid() = user_id);

-- Daily boost table policies
CREATE POLICY "Users can view their own daily boosts"
  ON public.daily_boost FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily boosts"
  ON public.daily_boost FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily boosts"
  ON public.daily_boost FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for users.updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at_trigger
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- Create trigger for journal_entries.updated_at
CREATE OR REPLACE FUNCTION update_journal_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_journal_entries_updated_at_trigger
BEFORE UPDATE ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION update_journal_entries_updated_at();
