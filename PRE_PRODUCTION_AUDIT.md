# PRE-PRODUCTION AUDIT

Audit date: 2026-08-26  
Repository: `jeysondantasgdp-lang/elbravo-portfolio`

## Current architecture

- React 19 + TypeScript 5.8 + Vite 6.
- Tailwind CSS 4, Lucide icons, Motion, Supabase JS.
- Client-side SPA in `src/App.tsx`; `/admin` and `/projects/:slug` are handled in the client, with legacy hash URLs retained.
- Project model: `src/types.ts`; seed data: `src/data/seed-projects.ts`.
- Repository layer: `src/lib/projectsRepository.ts`; Supabase client/upload helper: `src/lib/supabase.ts`.
- Admin UI: `AdminRouter`, `AdminLogin`, `AdminDashboard`, and `ProjectFormModal`.
- Express, dotenv, and Gemini dependencies exist, but no server entry point or server-side secret usage was found.
- Sophisticated Dark visual direction was preserved.

## What works

- Strict TypeScript compilation and production Vite build pass.
- Public lists and public slug resolution now use published projects only.
- Bilingual `{pt, en}` project/content fields and UI translations exist.
- CMS UI supports create, edit, delete, reorder, publish/unpublish, featured/unfeatured, cover upload, screenshots, case-study fields, and demo credential fields.
- Delete confirmation exists.
- Supabase email/password authentication is implemented.
- `NotFoundView` handles missing/unpublished projects in PT-BR/EN.
- No service-role key, database password, or hard-coded production admin password was found in client source.
- Positioning preserved: “I build. I test. I learn. I improve.”

## Blockers resolved

- Draft preview now renders `CaseStudyView` inside the authenticated `AdminRouter`; it does not change the public URL or publish the project.
- Public project lists and direct public slug resolution remain published-only.
- Media uploads now use a private-bucket path marker and one-hour signed preview URLs; permanent public URLs are not persisted.
- A Vercel SPA rewrite is present in `vercel.json`.
- A scriptable Supabase integration harness is available at `scripts/supabase-integration-check.mjs`.

## Remaining blockers

- No real Supabase integration was run by design; RLS/Storage behavior remains unverified.
- The private-bucket SQL is pending execution and review.
- Host routing, mobile/desktop behavior, and authenticated draft preview require real environment/browser verification.
- No per-project server-rendered SEO exists because this remains a Vite SPA.

## Security findings

### High/Critical

1. Storage is now defined as private in the pending SQL. Published asset access uses signed URLs and Storage SELECT policy checks the project slug/publication state. This is not yet production-proven because the SQL was not executed.
2. The original schema allowed every authenticated user full project CRUD. `supabase-schema.sql` was updated to add `public.portfolio_admins` and require membership for project CRUD and authenticated media writes. It was not executed.
3. The original client trusted any `sessionStorage` admin marker. Configured/production mode now checks the Supabase session plus `portfolio_admins`; local markers are development-only.
4. The original repository silently fell back to localStorage after Supabase errors and could report success. Production now disables local persistence/media fallback and reports failure.

### Other findings

- Published `demo_credentials` are intentionally browser-visible. Use disposable demo accounts only; never use portfolio admin or real customer credentials.
- Upload MIME and size validation is present (5 MB covers, 10 MB screenshots); server-side content validation remains recommended.
- Reorder uses multiple independent updates, not a transaction.

## Code fixes applied

- Production guard for localStorage CMS persistence and Data URL media fallback.
- Supabase errors no longer become successful production saves/deletes.
- Removed automatic client seeding into an empty Supabase table.
- Upload errors are surfaced by the form.
- Added owner membership checks in admin login/session checks.
- Public project lists and slug routes are published-only.
- Added real `/projects/:slug` parsing while retaining old hash links.
- Save/reorder UI now reports failures.
- Updated project/RLS/Storage SQL to use the owner membership table and private published-media access.
- Added signed URL hydration and non-permanent `supabase://project-media/...` path markers.
- Added authenticated admin-only draft preview.
- Added Vercel fallback rewrites and direct section-path handling.
- Added ESLint flat configuration and a Supabase integration harness.
- Rewrote visible mock metrics as illustrative/example data where found.

## CMS findings

| Capability | Result |
|---|---|
| Create | Implemented; cloud behavior needs RLS test. |
| Edit | Implemented. |
| Delete | Implemented with confirmation; needs RLS test. |
| Reorder | Implemented; non-transactional. |
| Publish/unpublish | Implemented through `published`. |
| Featured/unfeatured | Implemented through `featured`. |
| Draft preview | Implemented inside authenticated `AdminRouter`; needs real Auth/RLS/browser test. |
| Media/screenshots | Implemented with private Storage path markers and signed URLs; needs real Storage test. |
| Reset defaults | Local development reset only; does not reset Supabase. |

## Supabase/RLS findings

The revised schema enables RLS, creates `portfolio_admins(user_id)`, permits public/authenticated SELECT only for `published = true`, and permits project ALL plus authenticated Storage writes only for a registered owner.

The SQL has not been executed. Verify syntax, grants, Auth UUID setup, and behavior with anonymous, owner, and authenticated non-owner JWTs. The revised SQL creates a private bucket, uses `projects/<slug>/<folder>/<filename>` paths, permits anonymous reads only when the corresponding project is published, and restricts writes to `portfolio_admins`. The client uses signed URLs and stores path markers rather than permanent URLs.

## LocalStorage findings

localStorage is user-editable and unauthenticated; it is not secure persistence. It is now development-only for projects/media. In production with missing or failing Supabase, project writes fail closed and old local drafts are not used as CMS data. Language preference may remain localStorage because it is not sensitive.

## Authentication/admin design

Supabase Auth handles email/password and session persistence. The database membership table is the actual single-owner boundary. Any authenticated non-owner may still reach the login flow, but membership checks and RLS deny admin access/data operations. The local fallback accepts a development password and must never be enabled as production authentication. `admin123` is only a development example.

## Bilingual behavior

Project fields, UI dictionary, case studies, status labels, and 404 messaging support PT-BR/EN. Initial `<html lang>` is PT-BR; a saved language is applied to the document on toggle, not during initial mount. Client-side metadata changes are not server-rendered bilingual SEO. Several visible files contain mojibake (`Ã§`, `Ã£`) and need encoding cleanup.

## Dynamic routes, SEO, and 404

`/projects/:slug` is now parsed by `App.tsx`; missing and unpublished slugs render `NotFoundView`. Direct refresh requires SPA rewrite rules for `/projects/*` and `/admin`. Base SEO exists in `index.html`; case-study title/description/OG title/description are changed client-side. Canonical remains the root URL; there is no per-project canonical, `hreflang`, JSON-LD, sitemap, or OG image generation.

## Copy/claim review

- No unsupported senior/expert self-claim or named fake customer was found.
- Claims needing qualification or replacement include “Verified Product Metrics”, “100% Live Demos”, “100% Private”, “92% action verbs”, “+14.2% vs last month”, “82%”, “68% used”, “34.8%”, and revenue/MRR-style dashboard figures.
- `ProjectBrowserMockup` figures read like real evidence unless explicitly labeled illustrative or backed by sources.
- Seed copy uses enterprise/multi-tenant/real-time/comprehensive language; present it as demo scope unless substantiated.

## Required environment variables

- `VITE_SUPABASE_URL`: public Supabase URL.
- `VITE_SUPABASE_ANON_KEY`: public anon key only.
- `GEMINI_API_KEY`: documented but unused in current source; never expose a privileged key through client code.
- `APP_URL`: documented app URL; no active OAuth/server implementation found.

Never put a service-role key, database password, or privileged secret in `VITE_*` variables.

## Exact Supabase SQL still pending

1. Create the Supabase project and owner Auth email/password account.
2. In a disposable non-production project, review and execute `supabase-schema.sql` only after approval.
3. Insert the owner Auth UUID into `public.portfolio_admins` through a trusted channel.
4. Execute the revised private Storage policies only after reviewing the SQL. Confirm existing bucket state is changed to `public = false`.
5. Configure only the two `VITE_SUPABASE_*` values in the frontend runtime.
6. Seed/import projects through an authenticated owner process; client auto-seeding was removed.
7. Test anonymous, owner, and non-owner CRUD/Storage permissions.
8. Test publish/unpublish, featured state, ordering, media, and direct route refresh.
9. Add host rewrite rules for `/admin` and `/projects/*`.
10. Qualify all metrics and use disposable demo credentials.

## Integration tests available

Run after setting `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_OWNER_EMAIL`, `SUPABASE_OWNER_PASSWORD`, `SUPABASE_TEST_PUBLISHED_SLUG`, `SUPABASE_TEST_DRAFT_SLUG`, and `SUPABASE_TEST_DRAFT_MEDIA_PATH`:

```text
npm run test:supabase
```

The harness creates temporary published/draft fixtures in the configured disposable project and checks anonymous published/draft reads, anonymous project insert/update/delete denial, anonymous media upload/remove/signed-URL denial, owner CRUD, publish/unpublish, and owner media upload/remove. On 2026-08-26 it completed 10/10 PASS against the disposable Supabase project. A separate `npm run test:routes` checks the SPA shell for all required paths. Browser rendering, mobile/desktop, and preview-flow checks remain manual/e2e work.

`SUPABASE_TEST_SETUP.md` documents the disposable-project setup, safe variables, expected PASS output, and browser checks.

## Build/typecheck/lint results

- `npm.cmd install`: passed; 225 packages added, 226 audited, 0 vulnerabilities reported. One deprecated transitive package warning.
- `npx.cmd tsc --noEmit`: passed.
- `npm.cmd run lint`: passed with 0 errors and 1 remaining warning (defensive Supabase row mapper uses `any`); reduced from 79 warnings without broad refactoring.
- `npm.cmd run build`: passed.
- Build warning: main JS chunk is about 643 kB, above Vite’s 500 kB warning threshold.
- `node --check scripts/supabase-integration-check.mjs`: passed.
- `npm.cmd run test:supabase`: passed 10/10 against the disposable Supabase project; no production project was used.
- `npm.cmd run dev`: started successfully with the ESM-safe Vite config; local `/` returned HTTP 200 with the application root.
- `npm.cmd run test:routes`: passed 7/7 SPA shell route checks against the local server.
- `npm.cmd run test:responsive`: passed 27/27 viewport, focus, and label checks.
- Browser admin QA: failed-login and successful-login/dashboard access were verified against the disposable project; full CRUD/media/preview browser automation remains pending and is documented as manual QA.
- No live database access, schema execution, or deployment performed.

## Vercel routing state

`vercel.json` rewrites all application paths to `/index.html`, preserving Vercel static asset resolution. This supports `/`, `/projects`, `/projects/:slug`, `/about`, `/contact`, `/admin`, and `/admin/login` at the SPA level. It has not been tested on a deployed Vercel preview. No API routes exist in this repository.

## SEO limitations

The SPA updates title/description/OG title/description client-side. It cannot provide reliable crawler-time per-project metadata, per-project canonical URLs, `hreflang`, JSON-LD, sitemap, or OG images without prerendering/SSR. A future Next.js migration would materially improve route-level SEO, but is intentionally out of scope for this audit.

## Known issues

- Production Supabase RLS/Storage tests are not executed; disposable-project checks passed.
- Browser rendering checks are available in `scripts/browser-cms-check.py`; the full CRUD/media/preview browser flow remains manual QA because no stable automated runner is currently included.
- Existing old public object URLs, if any, require migration/cleanup before private-bucket enforcement.
- SPA rewrite and client-only SEO requirements remain.
- Mojibake in visible copy.
- Generic package name and unused/server-oriented dependencies are cleanup items, not blockers by themselves.

## Deployment readiness

**Not ready for production.** The code-level blockers are addressed, but the pending SQL, real RLS/Storage verification, Vercel preview, browser checks, and final media/copy review remain required.

## Recommended next step

Run the browser route/preview matrix against the local/test environment, then review and copy the approved SQL/configuration to production only after human approval. Do not deploy yet.
