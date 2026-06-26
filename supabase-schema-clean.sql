-- ─────────────────────────────────────────────────────────────────────────────
-- AURAVIX Bath Studio — CLEAN Supabase Schema (Drop + Recreate)
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- This version DROPS existing tables/policies/triggers first, so no errors.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. DROP everything first (safe — ignores if not exists) ───

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
DROP TRIGGER IF EXISTS contact_messages_updated_at ON public.contact_messages;
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at();

-- Drop policies (must drop before tables)
DROP POLICY IF EXISTS "Allow anonymous booking inserts" ON public.bookings;
DROP POLICY IF EXISTS "Allow reading bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow anonymous contact message inserts" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow reading contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Drop tables
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;


-- ─── 2. RECREATE everything ───

-- Auto-update trigger function (shared)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── Bookings table ───
CREATE TABLE public.bookings (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reference_number    TEXT UNIQUE NOT NULL,
  full_name           TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT NOT NULL,
  address             TEXT,
  preferred_date      TEXT NOT NULL,
  preferred_time      TEXT NOT NULL,
  consultation_type   TEXT,
  bathroom_status     TEXT,
  budget_range        TEXT,
  style_preferences   JSONB,
  contact_method      TEXT DEFAULT 'phone',
  requirements        JSONB,
  status              TEXT DEFAULT 'pending',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_email ON public.bookings(email);
CREATE INDEX idx_bookings_reference ON public.bookings(reference_number);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous booking inserts"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow reading bookings"
  ON public.bookings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ─── Contact Messages table ───
CREATE TABLE public.contact_messages (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reference_number    TEXT UNIQUE NOT NULL,
  full_name           TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT,
  subject             TEXT NOT NULL,
  message             TEXT NOT NULL,
  status              TEXT DEFAULT 'new',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_email ON public.contact_messages(email);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous contact message inserts"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow reading contact messages"
  ON public.contact_messages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TRIGGER contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ─── Profiles table (links to Supabase Auth users) ───
CREATE TABLE public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  phone       TEXT,
  role        TEXT DEFAULT 'customer',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Auto-create profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- DONE! All tables created cleanly with no errors.
--
-- Email Auth Setup (Supabase Dashboard):
-- 1. Authentication → Providers → Email → ENABLED
-- 2. Turn OFF "Confirm email" for instant login (optional)
-- 3. Authentication → URL Configuration:
--    - Site URL = http://localhost:3000
--    - Redirect URLs = add http://localhost:3000/auth/callback
-- ─────────────────────────────────────────────────────────────────────────────
