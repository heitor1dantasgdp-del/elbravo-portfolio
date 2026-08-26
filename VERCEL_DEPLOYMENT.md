# Vercel Deployment

The repository is a Vite SPA. Production deployment remains manual and is not performed by this document.

## Import and Preview

1. In Vercel, import the GitHub repository `jeysondantasgdp-lang/elbravo-portfolio`.
2. Keep the detected framework as Vite, or set:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
3. Add only the final Supabase project's `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the Preview environment first.
4. Create a Preview deployment. Do not connect `elbravodantas.com.br` yet.
5. Test the Preview directly on its `vercel.app` URL:
   - all SPA routes and refreshes;
   - owner login and failed-login error;
   - project CRUD, publish/unpublish, reorder and private media;
   - draft preview and public draft denial;
   - PT-BR/EN switching, desktop/mobile layouts and accessibility.

`vercel.json` rewrites application paths to `/index.html`, while static assets remain resolved by Vercel. No service-role key, database password, owner password, or private media URL belongs in Vercel frontend variables.

## Final domain connection, only after Preview approval

1. In the Vercel project, open **Settings → Domains**.
2. Add `elbravodantas.com.br` and follow the exact DNS verification instructions shown by Vercel.
3. Add `www.elbravodantas.com.br` separately.
4. Set one canonical redirect, preferably `www` to the apex domain, and verify HTTPS.
5. Run a production smoke test for public pages, published media, admin login, draft denial and logout.

Do not enable Vercel DNS or edit registrar records until the Preview has passed QA and the final Supabase project has been approved.
