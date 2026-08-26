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

-- 3. Single-owner authorization
-- After creating the Supabase Auth user, insert that user's UUID here.
CREATE TABLE IF NOT EXISTS public.portfolio_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.portfolio_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read own membership" ON public.portfolio_admins;
CREATE POLICY "Admins can read own membership"
  ON public.portfolio_admins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 4. RLS Policies:
-- Allow anonymous users to read PUBLISHED projects only.
DROP POLICY IF EXISTS "Allow public read access to published projects" ON public.projects;
CREATE POLICY "Allow public read access to published projects"
  ON public.projects
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Only the explicitly registered portfolio owner can manage projects.
DROP POLICY IF EXISTS "Allow full access to authenticated admins" ON public.projects;
CREATE POLICY "Allow full access to authenticated admins"
  ON public.projects
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolio_admins WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolio_admins WHERE user_id = auth.uid()));

-- 5. Create a PRIVATE Storage Bucket for Media.
-- Object names must follow: projects/<project-slug>/<folder>/<filename>.
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-media', 'project-media', false)
ON CONFLICT (id) DO NOTHING;

UPDATE storage.buckets
SET public = false
WHERE id = 'project-media';

-- 6. Storage Policies:
-- Anonymous users may read only objects whose project is published.
DROP POLICY IF EXISTS "Allow public to view project media" ON storage.objects;
DROP POLICY IF EXISTS "Allow published project media read" ON storage.objects;
CREATE POLICY "Allow published project media read"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'project-media'
    AND EXISTS (
      SELECT 1
      FROM public.projects
      WHERE projects.slug = split_part(storage.objects.name, '/', 2)
        AND projects.published = true
    )
  );

-- Allow authenticated users to upload and manage media
DROP POLICY IF EXISTS "Allow authenticated users to manage project media" ON storage.objects;
CREATE POLICY "Allow authenticated users to manage project media"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'project-media' AND EXISTS (SELECT 1 FROM public.portfolio_admins WHERE user_id = auth.uid()))
  WITH CHECK (bucket_id = 'project-media' AND EXISTS (SELECT 1 FROM public.portfolio_admins WHERE user_id = auth.uid()));

-- 7. Updated_at Trigger
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
