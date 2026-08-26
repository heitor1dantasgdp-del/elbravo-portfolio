# Production Checklist

## 0. Disposable test project (required first)

- [x] Create a separate test Supabase project; never use production as the first target.
- [x] Review and run the approved schema there only.
- [x] Create a test owner Auth user and add its UUID to `portfolio_admins`.
- [x] Configure test-only variables locally.
- [x] Run `npm run test:supabase` and record every PASS/FAIL (10/10 PASS).
- [x] Run `npm run test:responsive` at 375, 430, 768, 1024 and 1440px (27/27 PASS).
- [ ] Run `python scripts/browser-cms-check.py` and `npm run test:routes` against a test/preview URL.
- [x] Run `npm run test:cms` against the disposable project (21/21 PASS; E2E media cleanup confirmed).
- [ ] Resolve every failure before copying the exact approved SQL/configuration to production.

## 1. Production Supabase project

- [ ] Create the production Supabase project.
- [ ] Create the single owner Auth email/password account.
- [ ] Review `supabase-schema.sql` with a human reviewer.
- [ ] Run the approved schema/migration only in the intended environment.
- [ ] Insert the owner Auth UUID into `public.portfolio_admins`.

## 2. Storage and application configuration

- [ ] Confirm `project-media` is private.
- [ ] Confirm published media uses signed URLs and draft media is not anonymously readable.
- [ ] Remove or migrate any old permanent public media URLs.
- [ ] Set Vercel `VITE_SUPABASE_URL`.
- [ ] Set Vercel `VITE_SUPABASE_ANON_KEY` only; never set a service-role key in the client.
- [ ] Confirm no database password or privileged secret is bundled.

## 3. Security and functional tests

- [ ] Run `npm run test:supabase` with production test fixtures after the schema review.
- [ ] Run `npm run test:routes` against a Vercel preview URL.
- [ ] Confirm anonymous published read succeeds.
- [ ] Confirm anonymous draft read fails/returns no row.
- [ ] Confirm anonymous project insert/update/delete fails.
- [ ] Confirm anonymous media upload/remove fails.
- [ ] Confirm owner CRUD succeeds.
- [ ] Confirm owner media upload/remove succeeds.
- [ ] Confirm draft media cannot receive an anonymous signed URL.
- [ ] Test admin create, edit, delete, reorder, publish/unpublish, and featured/unfeatured.
- [ ] Test authenticated draft preview without publishing.
- [ ] Confirm normal anonymous draft URL returns 404/deny.

## 4. Browser and routing QA

- [ ] Verify `/` direct load and refresh.
- [ ] Verify `/projects` direct load and refresh.
- [ ] Verify `/projects/:slug` direct load and refresh.
- [ ] Verify `/about` direct load and refresh.
- [ ] Verify `/contact` direct load and refresh.
- [ ] Verify `/admin` direct load and refresh.
- [ ] Verify `/admin/login` direct load and refresh.
- [ ] Test mobile and desktop layouts.
- [ ] Test PT-BR and EN content, language persistence, and document language.
- [ ] Test 404 behavior for unknown and unpublished slugs.

## 5. SEO and release

- [ ] Verify Vercel rewrite behavior without breaking static assets.
- [ ] Review SPA SEO limitations and decide whether prerendering/SSR is needed.
- [ ] Review all metrics, demo credentials, and visual claims.
- [ ] Deploy a Vercel preview only after the preceding checks pass.
- [ ] Perform final security check on the preview.
- [ ] Connect `elbravodantas.com.br`.
- [ ] Run production smoke test for public pages, project routes, admin login, media, and draft denial.
