-- ====================================================================
-- SUPABASE DATABASE & STORAGE SCHEMA FOR EL BRAVO DANTAS PORTFOLIO CMS
-- ====================================================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  order_number TEXT NOT NULL DEFAULT '01',
  display_order INTEGER NOT NULL DEFAULT 1,
  name TEXT NOT NULL,
  category JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('building', 'testing', 'beta', 'released', 'paused')),
  status_note JSONB,
  tagline JSONB NOT NULL,
  description JSONB NOT NULL,
  demo_url TEXT NOT NULL DEFAULT '',
  repository_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  cover_image TEXT,
  stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  case_study JSONB NOT NULL,
  demo_credentials JSONB,
  last_updated TEXT DEFAULT '2026',
  screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies:
-- Allow anyone to read PUBLISHED projects
CREATE POLICY "Allow public read access to published projects"
  ON public.projects
  FOR SELECT
  USING (published = true);

-- Allow authenticated users (Admin) full access to all projects
CREATE POLICY "Allow full access to authenticated admins"
  ON public.projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Create Storage Bucket for Media
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-media', 'project-media', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage Policies:
-- Allow public to view uploaded images
CREATE POLICY "Allow public to view project media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'project-media');

-- Allow authenticated users to upload and manage media
CREATE POLICY "Allow authenticated users to manage project media"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'project-media')
  WITH CHECK (bucket_id = 'project-media');

-- 6. Updated_at Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
