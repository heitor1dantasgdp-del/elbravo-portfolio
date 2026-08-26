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
| Public EN switch on case study | PASS |
| Published project edit reflected publicly | PASS |
| Invalid image-type validation | PASS |
| Duplicate slug rejection | PASS |
| Unsaved-changes warning | NOT IMPLEMENTED/NOT VERIFIED |

## Issues found

- The first browser runner used brittle text selectors and was removed.
- The final runner completed the draft/media/preview flow after replacing brittle selectors with explicit role/label/title selectors and waits.
- Project deletion originally left Storage objects orphaned; the repository now removes project media before deleting the database row.
- The application has one intentional ESLint warning for the defensive database-row mapper and a Vite bundle-size warning.

## Fixes applied

- Added `scripts/cms-browser-e2e.py` with unique slugs, local-only credentials, and PASS/FAIL output.
- Added `scripts/qa-fixture.svg` and `scripts/qa-fixture-two.svg` as small non-production upload fixtures.
- Added `npm run test:cms` and `npm run typecheck` scripts.
- Added explicit production Supabase and Vercel deployment procedures.
- Project deletion now cleans the private Storage project folders before removing the project row.
- No production database, DNS record, domain connection, or deployment was changed.

## Cleanup confirmation

The completed UI run deleted its test project and media. A final owner-authenticated check reported `remaining_rows=0` and `remaining_media=0`. No test content remains under the E2E prefix.

## Manual-only checks remaining

Remaining manual-only checks: oversized-file validation, unsaved-changes behavior (not implemented), loading/error states under slow network, forced upload/save/network failure messaging, full keyboard traversal through every modal control, and visual review of mobile admin spacing. Run these before production migration or Vercel Preview approval.
