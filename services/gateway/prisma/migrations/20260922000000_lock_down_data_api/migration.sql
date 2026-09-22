-- Supabase exposes every table in `public` through its REST API (PostgREST) to the `anon` and
-- `authenticated` roles — and the anon key is public by design (it ships to browsers). CareFlow
-- reaches Postgres only through the gateway, as the table owner, which bypasses RLS. So:
--   1. row-level security ON for every table, with NO policies  -> anon/authenticated read nothing
--   2. every privilege revoked from those roles, now and for future objects
-- Patient data must never be one anon-key request away. Local Docker Postgres has no such roles,
-- so the role-dependent part is guarded.
--
-- FUTURE MIGRATIONS: a new table needs `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` in the same
-- migration. `scripts/supabase/verify_lockdown.py` (make db-verify) fails if any table lacks it.
DO $$
DECLARE t record;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
  END LOOP;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON ALL TABLES    IN SCHEMA public FROM anon, authenticated';
    EXECUTE 'REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated';
    EXECUTE 'REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES    FROM anon, authenticated';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon, authenticated';
  END IF;
END $$;
