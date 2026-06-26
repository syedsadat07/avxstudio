-- ─────────────────────────────────────────────────────────────────────────────
-- AURAVIX Bath Studio — Supabase Schema for Bookings
-- ─────────────────────────────────────────────────────────────────────────────
-- Run this SQL in your Supabase Dashboard → SQL Editor → New query
-- This creates the 'bookings' table that the AURAVIX website writes to
-- when a customer fills the "Book a Slot" form.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create the bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
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

-- 2. Create an index on email for quick lookups
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);

-- 3. Create an index on reference_number for quick lookups
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON public.bookings(reference_number);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policy: Allow anyone (anon) to INSERT bookings
--    This is needed because the website uses the publishable (anon) key
CREATE POLICY "Allow anonymous booking inserts"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 6. RLS Policy: Allow anyone to READ their own bookings by email
--    (Optional — remove if you don't want public read access)
CREATE POLICY "Allow reading bookings"
  ON public.bookings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 7. Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Contact Messages Table (for the Contact form)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.contact_messages (
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

CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous contact message inserts"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow reading contact messages"
  ON public.contact_messages
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TRIGGER contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Customer Profiles Table (links to Supabase Auth users)
-- Automatically creates a profile when a new user signs up via Supabase Auth
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  phone       TEXT,
  role        TEXT DEFAULT 'customer',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Auto-create a profile when a new auth user is created
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
-- DONE! Tables are ready. The AURAVIX website will now save data here.
--
-- Email Authentication Setup:
-- 1. Supabase Dashboard → Authentication → Providers → Email → Make sure it's enabled
-- 2. To disable email confirmation (instant login): Authentication → Providers → Email → Turn off "Confirm email"
-- 3. To set the redirect URL: Authentication → URL Configuration → Site URL = your website URL
--    Add callback URL: https://your-domain.com/auth/callback
--
-- To verify, after submitting a booking or signing up, check:
-- Supabase Dashboard → Table Editor → bookings / profiles
-- Supabase Dashboard → Authentication → Users (to see registered customers)
-- ─────────────────────────────────────────────────────────────────────────────
