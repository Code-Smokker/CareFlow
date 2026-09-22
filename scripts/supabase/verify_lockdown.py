#!/usr/bin/env python3
"""`make db-verify` — proves the database is safe to hold patient data. Read-only except for ONE
tagged audit row (needed to demonstrate the append-only trigger against a real row).

  1. every table in `public` has row-level security enabled
  2. the anon and authenticated roles hold no privilege on any public table
  3. audit_log refuses UPDATE and refuses DELETE
  4. (Supabase) the PUBLIC anon key cannot read patient data through the REST API

Prints table counts, role names and HTTP status codes — never a key, password or row content."""
from __future__ import annotations

import asyncio
import json
import sys
import urllib.error
import urllib.request

import asyncpg

from _env import host_of, is_supabase, load_env, pg_url

ENV = load_env()


async def main() -> int:
    failures: list[str] = []
    print(f"database host: {host_of(ENV['DATABASE_URL'])}")
    conn = await asyncpg.connect(pg_url(ENV), statement_cache_size=0, timeout=20)

    tables = await conn.fetch("select c.relname, c.relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' order by 1")
    no_rls = [r["relname"] for r in tables if not r["relrowsecurity"]]
    print(f"[1] public tables: {len(tables)}; without RLS: {no_rls or 'none'}")
    if no_rls:
        failures.append(f"RLS off on {no_rls}")

    if await conn.fetchval("select exists(select 1 from pg_roles where rolname='anon')"):
        grants = await conn.fetch("select table_name, privilege_type from information_schema.role_table_grants where table_schema='public' and grantee in ('anon','authenticated')")
        print(f"[2] privileges held by anon/authenticated on public tables: {len(grants)}")
        if grants:
            failures.append(f"anon/authenticated hold {len(grants)} grants")
    else:
        print("[2] no anon/authenticated roles on this server (local Postgres) — n/a")

    ext = await conn.fetch("select e.extname, n.nspname from pg_extension e join pg_namespace n on n.oid=e.extnamespace where e.extname in ('pg_trgm','vector','pgcrypto') order by 1")
    print("[extensions] " + ", ".join(f"{r['extname']}→{r['nspname']}" for r in ext))

    # the trigger, against a real row
    row = await conn.fetchval("select id from audit_log where action='db.verify' limit 1")
    if not row:
        row = await conn.fetchval("insert into audit_log (actor_id, actor_role, action, resource, reason) values ('make db-verify','system','db.verify','database','append-only trigger proof') returning id")
    for label, sql in (("UPDATE", "update audit_log set reason='tampered' where id=$1"), ("DELETE", "delete from audit_log where id=$1")):
        try:
            async with conn.transaction():
                await conn.execute(sql, row)
            print(f"[3] {label} on audit_log: ALLOWED  <-- FAIL")
            failures.append(f"audit_log {label} allowed")
        except asyncpg.PostgresError as e:
            print(f"[3] {label} on audit_log: refused ({e.message.split(':')[0]}…)")
    await conn.close()

    if is_supabase(ENV):
        anon = ENV.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") or ENV.get("SUPABASE_ANON_KEY")
        base = ENV["SUPABASE_URL"].rstrip("/")
        for table in ("patient", "answer", "audit_log", "visit"):
            req = urllib.request.Request(f"{base}/rest/v1/{table}?select=*&limit=1", headers={"apikey": anon, "Authorization": f"Bearer {anon}"})
            try:
                with urllib.request.urlopen(req, timeout=15) as r:
                    body = json.loads(r.read() or "[]")
                    leaked = bool(body)
                    print(f"[4] anon key GET /rest/v1/{table}: HTTP {r.status}, rows returned: {len(body)}")
                    if leaked:
                        failures.append(f"anon read rows from {table}")
            except urllib.error.HTTPError as e:
                print(f"[4] anon key GET /rest/v1/{table}: HTTP {e.code} (refused)")
    print("RESULT:", "FAIL — " + "; ".join(failures) if failures else "PASS")
    return 1 if failures else 0


sys.exit(asyncio.run(main()))
