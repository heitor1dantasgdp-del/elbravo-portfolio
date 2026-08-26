# Responsive Rescue Report

Audit target: `https://elbravo-portfolio-git-main-el-bravo-dantas.vercel.app/`

## Result

The supplied Vercel URL is protected by Vercel Deployment Protection. Browser navigation redirects to `https://vercel.com/login` and shows the Vercel login screen instead of the portfolio. The portfolio itself therefore could not be visually audited on this URL.

The local application was then audited with the same route/viewport matrix after the safe fixes below. The final local matrix completed **189/189 PASS**.

## Issues found

- The target Preview is not publicly reachable for automated QA.
- The automated deployed matrix recorded HTTP 200 responses because the Vercel login page is a valid HTML response, but it is not the application shell.
- Console/network failures included 403 responses from the protected deployment and are infrastructure/protection symptoms, not layout findings.
- No unintended horizontal overflow or clipped visible controls was detected in the Vercel login shell; this does not establish that the portfolio has no layout issues.

## Root causes

- Vercel Deployment Protection/SSO is enabled for the supplied Preview URL.
- The browser test has no authenticated Vercel Preview session, so it cannot reach the deployed React application.

## Fixes applied

- No redesign, content, routing, or CMS behavior changes were applied.
- Added `scripts/responsive-rescue-check.py` for repeatable viewport/route measurements once an accessible Preview URL is available.
- Added document-level `overflow-x: clip` containment so fixed ambient glows cannot expand the document width on narrow screens.
- Changed the desktop navbar breakpoint to `xl` so the compact navigation is used at 1024px and avoids pushing the contact CTA off-screen.

## Viewports tested

`320x800`, `360x800`, `375x812`, `390x844`, `430x932`, `768x1024`, `1024x768`, `1440x900`, and `1920x1080`.

Routes attempted: `/`, `/projects`, `/projects/unknown`, `/about`, `/contact`, `/admin/login`, and `/admin`.

## Status

- Horizontal overflow: **PASS locally**, 189/189 matrix checks; deployed target remains blocked by Vercel protection.
- Text clipping: **PASS locally** for visible text/controls; deployed target remains blocked by Vercel protection.
- Mobile: **PASS locally** at all requested narrow/tablet widths; deployed target remains blocked by Vercel protection.
- Desktop: **PASS locally** at 1024, 1440 and 1920; deployed target remains blocked by Vercel protection.
- Admin/editor: **Blocked by Preview protection and production Supabase readiness**.

## Required next check

Temporarily allow public access to this Preview deployment, provide a Vercel Preview URL without Deployment Protection, or run the same script from an authenticated browser session. Do not disable protection on the production domain.
