-- Extensions CareFlow depends on. Runs once on first container start.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- field-level encryption, gen_random_uuid
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- fuzzy terminology search (amavata / āmavāta / aam vaat)
CREATE EXTENSION IF NOT EXISTS "vector";     -- concept embeddings; requires pgvector image if unavailable
