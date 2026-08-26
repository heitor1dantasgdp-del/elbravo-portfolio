# CMS Browser E2E Report

Date: 2026-08-26
Environment: local Vite server + disposable Supabase project

## Results

| Scenario | Result |
|---|---|
| Invalid admin login is rejected | PASS |
| Authorized test owner login | PASS |
| Admin dashboard access | PASS |
| Create a unique draft project through the UI | PASS |
| Fill PT/EN project content | PASS (form action completed) |
| Set category and status | PASS |
| Draft appears in admin | PASS |
| Upload cover during draft creation | PASS |
| Upload multiple screenshots | PASS |
| Reorder screenshots | PASS |
| Remove screenshot | PASS |
| Save edited draft | PASS |
| Authenticated draft preview | PASS |
| Anonymous direct draft route denied | PASS |
| Publish project | PASS |
| Public project renders after publish | PASS |
| Public PT content renders | PASS |
| Unpublish removes public access | PASS |
| Delete test project | PASS |
| Logout and protected admin route | PASS |
| Public EN switch on case study | NOT VERIFIED |
| Published project edit reflected publicly | NOT VERIFIED |
| Invalid image-type validation | NOT VERIFIED |
| Duplicate slug rejection | NOT VERIFIED |
| Unsaved-changes warning | NOT IMPLEMENTED/NOT VERIFIED |

## Issues found

- The first browser runner used brittle text selectors and was removed.
- The final runner completed the draft/media/preview flow after replacing brittle selectors with explicit role/label/title selectors and waits.
- The application has one intentional ESLint warning for the defensive database-row mapper and a Vite bundle-size warning.

## Fixes applied

- Added `scripts/cms-browser-e2e.py` with unique slugs, local-only credentials, and PASS/FAIL output.
- Added `scripts/qa-fixture.svg` and `scripts/qa-fixture-two.svg` as small non-production upload fixtures.
- Added `npm run test:cms` and `npm run typecheck` scripts.
- Added explicit production Supabase and Vercel deployment procedures.
- No production database, DNS record, domain connection, or deployment was changed.

## Cleanup confirmation

The completed UI run deleted its test project. A final owner-authenticated Storage check removed 8 orphaned E2E media objects; the final database check reported `remaining_rows=0`. No test content remains under the E2E prefix.

## Manual-only checks remaining

Remaining manual-only checks: PT/EN switch on the case study, published edit reflection, invalid file validation, duplicate slug behavior, unsaved-changes behavior (not implemented), loading/error states under slow network, full keyboard traversal through every modal control, and mobile admin layout. Run these before production migration or Vercel Preview approval.
