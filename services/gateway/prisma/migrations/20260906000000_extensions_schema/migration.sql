-- Extensions live in the `extensions` schema on Supabase (its convention, and where its default
-- search_path already looks), and in whatever schema is available locally. This migration is dated
-- BEFORE `init` on purpose: init's `CREATE EXTENSION IF NOT EXISTS` lines then become no-ops and its
-- `gin_trgm_ops` / `vector` references resolve through the search_path.
--
-- Idempotent: on a database that already has them (the local Docker Postgres) every statement is a
-- no-op.
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA extensions;
