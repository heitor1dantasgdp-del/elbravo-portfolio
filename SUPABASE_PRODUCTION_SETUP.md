# Supabase Production Setup

This procedure is intentionally manual. Do not run it until the production project, owner identity, and final content plan have been reviewed.

## Order of operations

1. Create or open the final Supabase project for `elbravodantas.com.br`.
2. Confirm the project is the intended production project, not `elbravo-portfolio-test`.
3. Open **SQL Editor** and run the repository file `supabase-schema.sql` exactly once after human review.
4. Confirm the query completes without errors.
5. In **Authentication → Users**, create the single portfolio-owner account with a strong unique password. Confirm the email according to the chosen Auth policy.
6. Copy that user's UUID locally and run this statement in the production SQL Editor:

```sql
insert into public.portfolio_admins (user_id)
values ('FINAL_OWNER_AUTH_UUID');
```

7. In **Storage**, confirm `project-media` exists and is private. Do not change it to public.
8. Configure only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel Preview/Production environments.
9. Never configure the database password, `service_role`/secret key, owner password, or private media URLs in frontend variables.

## Verification queries

Run these after migration and owner enrollment:

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public' and tablename in ('projects', 'portfolio_admins');

select id, name, public
from storage.buckets
where id = 'project-media';

select policyname, schemaname, tablename, roles, cmd
from pg_policies
where (schemaname = 'public' and tablename in ('projects', 'portfolio_admins'))
   or (schemaname = 'storage' and tablename = 'objects');

select count(*) as owner_count from public.portfolio_admins;
```

Expected conditions: RLS is enabled on both tables, `project-media.public` is `false`, the owner count is exactly `1`, public project reads require `published = true`, and Storage writes require membership in `portfolio_admins`.

## Recovery notes

- Do not delete production data as a rollback strategy.
- If the schema fails, stop, save the error, and fix/review the SQL before retrying.
- The schema uses `IF NOT EXISTS` and named policy drops for some repeatability, but it is not a substitute for a reviewed migration process.
- To recover content, export/back up the database and Storage objects before any destructive operation.
- If an owner account is wrong, remove its membership row only after confirming the replacement UUID; Auth user deletion cascades to `portfolio_admins`.
