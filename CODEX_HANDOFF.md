# CODEX HANDOFF & SYSTEM ARCHITECTURE DOCUMENTATION

**Author:** El Bravo Dantas Portfolio Engineering Team  
**Architecture Version:** 2.0.0 (Sophisticated Dark + Editable CMS Architecture)  
**Target Runtime:** React 18 / TypeScript / Vite / Tailwind CSS / Supabase / Express Container

---

## 1. Executive Summary

This repository contains the official portfolio and dynamic content management system (CMS) for **El Bravo Dantas**. The system is built with a **"Sophisticated Dark"** aesthetic, featuring bilingual content (PT-BR / EN), interactive browser mockups, case studies, transparent build methodologies, and an administrative CMS for dynamic project management without hardcoded source-code redeployments.

---

## 2. Core Architectural Pillars

### 2.1 Single-Owner Admin CMS (`/admin` / `#admin`)
- **Access Route:** Protected administrative area accessed via hash `#admin` or path `/admin`.
- **Authentication:** Prepared for **Supabase Auth** (`email` / `password`). When running in offline or sandbox preview mode without Supabase environment variables, it safely falls back to authenticated local persistence.
- **CMS Capabilities:**
  - Create new projects (`name`, `slug`, `category`, `status`, `tagline`, `description`, `coverImage`, `screenshots`, `stack`, `caseStudy`, `demoCredentials`, `published`, `featured`).
  - Edit existing projects with interactive tabs (General, Story & Problem, Features, Media & Screenshots, Tech & Demo Credentials).
  - Delete projects with confirmation safety modal.
  - Quick toggles for **Publish / Draft** and **Featured Star**.
  - Reorder projects (Arrow Up / Arrow Down) with sequential display order indexing (`01`, `02`, `03`...).
  - Reset to default seeded projects (`src/data/seed-projects.ts`).

### 2.2 Dual-Tier Data Repository (`src/lib/projectsRepository.ts`)
- **Cloud Layer (Supabase PostgreSQL):** Reads and writes from `public.projects` table with Row-Level Security (RLS).
- **Fallback / Local Persistence (`localStorage` + `seed-projects.ts`):** If Supabase is unconfigured, all changes persist seamlessly in browser `localStorage` and sync via `window` storage events.

---

## 3. Database Schema & Supabase Setup

The complete migration file is located in `/supabase-schema.sql`.

### 3.1 PostgreSQL Schema (`public.projects`)
```sql
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
```

### 3.2 Row Level Security (RLS)
- **Public Read:** `SELECT` allowed only where `published = true`.
- **Authenticated Admin:** Full CRUD (`ALL`) allowed for authenticated users.

### 3.3 Storage (`project-media` Bucket)
- Public read access for cover images and screenshots.
- Authenticated write access for admin media uploads.

---

## 4. Environment Variables

Documented in `.env.example`:
```env
# Supabase Integration (Optional - falls back to persistent local storage if unset)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

---

## 5. Directory Structure & Key Modules

```
/
├── index.html                  # SEO & Typography entry point
├── metadata.json               # Applet capabilities & frame permissions
├── supabase-schema.sql         # SQL schema, RLS policies, and storage triggers
├── CODEX_HANDOFF.md            # System documentation and handoff guidelines
├── src/
│   ├── main.tsx                # React root mount
│   ├── App.tsx                 # Core layout, hash routing, language & SEO sync
│   ├── types.ts                # Strict TypeScript schemas (Project, Status, Lang)
│   ├── data/
│   │   ├── seed-projects.ts    # Comprehensive initial projects dataset
│   │   ├── projects.ts         # Backward compatibility re-export
│   │   └── i18n.ts             # Complete PT/EN UI translation dictionary
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client & Storage upload helper
│   │   └── projectsRepository.ts # CRUD data access layer
│   ├── hooks/
│   │   └── useProjects.ts      # React hook subscribing to repository updates
│   └── components/
│       ├── Navbar.tsx          # Sticky navigation & language selector
│       ├── Hero.tsx            # High-impact introduction with quick links
│       ├── ProjectShowcase.tsx # Main project grid with interactive previews
│       ├── NowBuildingSection.tsx # Real-time build status radar
│       ├── BentoGrid.tsx       # Live metric breakdown & transparency stats
│       ├── HowIBuildSection.tsx # 4-step engineering methodology
│       ├── AboutSection.tsx    # Background, positioning, and philosophy
│       ├── AiAssistedSection.tsx # AI tooling disclosure & pragmatic workflow
│       ├── SkillsSection.tsx   # Stack categories & tooling
│       ├── HaveAnIdeaSection.tsx # Custom SaaS development call-to-action
│       ├── ContactSection.tsx  # Direct outreach form & channels
│       ├── CaseStudyView.tsx   # Deep-dive case study with dynamic SEO
│       ├── ProjectBrowserMockup.tsx # Custom browser simulation with tabs
│       ├── ErrorBoundary.tsx   # React lifecycle crash protection
│       ├── NotFoundView.tsx    # 404 handler for missing project slugs
│       └── admin/
│           ├── AdminRouter.tsx # Admin auth check & view switching
│           ├── AdminLogin.tsx  # Admin credentials form
│           ├── AdminDashboard.tsx # Project management table & metrics
│           ├── ProjectFormModal.tsx # Multi-tab project creator & editor
│           └── SupabaseSetupModal.tsx # Guided setup modal with copyable SQL
```

---

## 6. Verification and Deployment

1. **Compilation:** `npm run build` compiles static assets to `dist/`.
2. **Quality Checks:** Fully validated with TypeScript strict checking and ESLint.
