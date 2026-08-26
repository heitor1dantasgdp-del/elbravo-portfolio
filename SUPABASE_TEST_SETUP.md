# Supabase Test Project Setup

This guide is for a disposable Supabase project only. Do not use the production project and do not paste keys, passwords, or tokens into chat, source control, screenshots, or issue trackers.

## 1. Create the disposable project

1. Open the Supabase Dashboard and create a new project, for example `elbravo-portfolio-test`.
2. Choose a region near the expected users.
3. Generate a strong database password and store it in your password manager. The application does not need this password.
4. Wait for the project to finish provisioning.

## 2. Review and run the schema

1. Open the project Dashboard → **SQL Editor**.
2. Create a new query.
3. Copy the reviewed repository file `supabase-schema.sql` into the editor.
4. Review it again, especially the `portfolio_admins` membership checks and private `project-media` policies.
5. Run it only in this disposable test project.

The Codex workflow does not execute this file automatically. It must not be run against the final production project until the test results pass and the SQL is separately approved.

The schema creates/updates:

- `public.projects` with RLS enabled;
- `public.portfolio_admins` for the single owner;
- a private `project-media` bucket;
- published-only anonymous Storage reads using `projects/<project-slug>/<folder>/<filename>` paths;
- owner-only project CRUD and Storage upload/remove policies.

## 3. Create the test owner

1. Open Authentication → Users.
2. Add a user with email/password for the test owner.
3. Confirm the user is present and copy only its UUID into the SQL Editor locally; do not send it here.
4. Run this statement in the test project SQL Editor, replacing the UUID locally:

```sql
insert into public.portfolio_admins (user_id)
values ('REPLACE_WITH_TEST_OWNER_AUTH_UUID');
```

The Auth email/password and the portfolio project demo credentials are separate. Never reuse the portfolio admin password as a demo credential.

## 4. Configure local environment variables

The frontend needs only these public runtime values:

```env
VITE_SUPABASE_URL=https://YOUR_TEST_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_TEST_PROJECT_ANON_KEY
```

For the integration harness, set these locally in the shell or an ignored local env file:

```text
SUPABASE_URL=https://YOUR_TEST_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_TEST_PROJECT_ANON_KEY
SUPABASE_OWNER_EMAIL=TEST_OWNER_EMAIL
SUPABASE_OWNER_PASSWORD=TEST_OWNER_PASSWORD
SUPABASE_TEST_PUBLISHED_SLUG=an-existing-published-slug
SUPABASE_TEST_DRAFT_SLUG=an-existing-draft-slug
SUPABASE_TEST_DRAFT_MEDIA_PATH=projects/an-existing-draft-slug/screenshots/known-draft-file.png
```

Use an existing published and draft fixture, or create them through the authorized CMS after the schema is installed. `SUPABASE_TEST_DRAFT_MEDIA_PATH` must point to a real media object owned by the draft project for the privacy assertion.

Safe for the frontend:

- Supabase project URL;
- Supabase anon/public key, only when RLS and Storage policies are correct.

Never expose:

- database password;
- Supabase service-role/secret key;
- owner password in frontend variables or source;
- real customer credentials;
- long-lived private media URLs.

Keep local test values out of Git. `.env.local` and `.env.*.local` should remain ignored if used.

## 5. Storage configuration

The SQL creates `project-media` as private and forces `public = false`. Do not make it public in the Dashboard.

Object paths must use:

```text
projects/<project-slug>/covers/<generated-file>
projects/<project-slug>/screenshots/<generated-file>
```

The application stores a path marker (`supabase://project-media/...`) and resolves a one-hour signed URL at runtime. Do not replace it with a permanent public URL. Anonymous reads are allowed only when the related project is published; owner-authenticated reads/writes use the owner membership policy.

## 6. Run the integration harness

From the repository root, after setting the variables above:

```powershell
npm run test:supabase
```

Expected output is one `PASS` line per scenario:

```text
PASS anonymous reads published project
PASS anonymous cannot read draft project
PASS anonymous cannot CRUD projects
PASS anonymous cannot upload/remove media or sign draft media
PASS admin can create project
PASS admin can edit project
PASS admin can publish and anonymous can read
PASS admin can upload and published media is accessible
PASS admin can unpublish and draft media becomes inaccessible
PASS admin can delete project and media
```

The script creates a uniquely named temporary fixture and attempts cleanup. If a run is interrupted, remove any `integration-test-*` project rows and media objects in the test project manually.

## 7. Run browser checks

For route rendering and authenticated draft preview, install Playwright locally if needed:

```powershell
pip install playwright
playwright install chromium
```

Set `BASE_URL`, `PUBLIC_PROJECT_SLUG`, `PUBLIC_PROJECT_NAME`, `DRAFT_PROJECT_SLUG`, `OWNER_EMAIL`, and `OWNER_PASSWORD`, then run:

```powershell
python scripts/browser-cms-check.py
```

Expected scenarios:

- published project renders;
- public draft route renders the bilingual 404 view;
- authorized owner can open the authenticated draft preview without publishing.

The separate SPA shell check is:

```powershell
npm run test:routes
```

It requires `BASE_URL` and `PUBLIC_PROJECT_SLUG` and checks `/`, `/projects`, `/projects/:slug`, `/about`, `/contact`, `/admin`, and `/admin/login` return the SPA shell. It does not replace browser rendering or security tests.

## 8. Interpreting results

- `PASS` from a local typecheck/build is not a Supabase integration result.
- Do not mark the production checklist complete until every Supabase and browser scenario passes against this disposable project.
- Any `FAIL` must be investigated before copying the schema/configuration to production.
- The current repository has not run these real Supabase checks until the required test variables are configured and the commands are executed.

