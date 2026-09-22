/**
 * Runs before every test file. Integration tests write real rows (and real audit_log rows, which can never be
 * deleted), so they must NEVER run against the Supabase project that holds real patient data. They run against
 * the local Docker Postgres + MinIO by default; point TEST_DATABASE_URL somewhere else to override, and set
 * ALLOW_TESTS_ON_REMOTE_DB=1 only if you really mean to test a hosted database.
 */
const LOCAL_DB = "postgresql://careflow:careflow@localhost:5433/careflow";
const url = process.env.TEST_DATABASE_URL ?? LOCAL_DB;
process.env.DATABASE_URL = url;
process.env.DIRECT_URL = process.env.TEST_DIRECT_URL ?? url;

if (/supabase\.(co|com)/.test(url) && process.env.ALLOW_TESTS_ON_REMOTE_DB !== "1") {
  throw new Error("Refusing to run tests against a Supabase database (they write rows and audit entries that cannot be deleted). Unset TEST_DATABASE_URL to use local Docker Postgres.");
}

// Object storage: local MinIO for tests, same code path as Supabase Storage (S3).
if (!process.env.TEST_S3_ENDPOINT) {
  process.env.STORAGE_PROVIDER = "minio";
  process.env.S3_ENDPOINT = "http://localhost:9000";
  process.env.S3_REGION = "us-east-1";
  process.env.S3_ACCESS_KEY_ID = "careflow";
  process.env.S3_SECRET_ACCESS_KEY = "careflow123";
  delete process.env.S3_ACCESS_KEY;
  delete process.env.S3_SECRET_KEY;
} else {
  process.env.S3_ENDPOINT = process.env.TEST_S3_ENDPOINT;
}
