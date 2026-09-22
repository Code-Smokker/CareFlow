.DEFAULT_GOAL := help
SHELL := /bin/bash

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

setup: ## First-time setup: env file, node deps, python venvs
	@test -f .env || (cp .env.example .env && echo "→ created .env, fill it in (see docs/API_KEYS.md)")
	pnpm install
	@echo "→ node workspace ready. Python services: make py-setup"

py-setup: ## Create venvs for the Python services (always from scratch — see comment below)
	@for s in ai docai terminology; do \
		if [ -d services/$$s ]; then \
			py=python3; \
			[ "$$s" = terminology ] && py=python3.12; \
			rm -rf services/$$s/.venv && \
			$$py -m venv services/$$s/.venv && \
			services/$$s/.venv/bin/pip install -q -U pip && \
			services/$$s/.venv/bin/pip install -q -r services/$$s/requirements.txt && \
			echo "→ services/$$s venv ready ($$($$py --version))"; \
		fi; \
	done
	# terminology is pinned to python3.12 (see services/terminology/README.md): its
	# sentence-transformers dependency was undocumented territory on 3.14 as of this writing.
	# `rm -rf` before creating: `python3 -m venv` on an *existing* venv directory doesn't
	# reliably reset it — it can leave scripts (uvicorn, pip) pointing at a different interpreter
	# than the one already-installed packages were built for, a broken half-upgraded state that
	# still imports but was never actually verified to run correctly. Always start clean.

up: ## Start postgres, redis, minio, hapi-fhir
	docker compose up -d
	@echo "→ postgres:5433  redis:6379  minio:9000 (console 9001)  fhir:8090"

down: ## Stop infra
	docker compose down

reset: ## Wipe all local data and restart infra
	docker compose down -v && docker compose up -d

dev: ## Start infra + all four services, wait for health, print every URL
	@bash scripts/dev-up.sh

dev-down: ## Stop the services `make dev` started (infra stays up)
	@bash scripts/dev-down.sh

demo-reset: ## Clean slate for a demo. Supabase: clears visits/answers/documents/audio/audit, keeps reference data (needs CONFIRM=1)
	@if grep -qE '^DATABASE_URL=.*supabase' .env; then \
		if [ "$(CONFIRM)" != "1" ]; then \
			services/docai/.venv/bin/python scripts/supabase/demo_reset.py; \
			echo "→ re-run as: make demo-reset CONFIRM=1"; exit 1; \
		fi; \
		services/docai/.venv/bin/python scripts/supabase/demo_reset.py --yes && $(MAKE) dev; \
		echo "→ demo-reset done: clean Supabase (visits, answers, documents, audio, audit) and reference data intact. Visits now come from real use — issue a token from the doctor app."; \
	else \
		docker compose down -v; docker compose up -d; \
		echo "→ waiting for postgres..."; \
		until docker exec careflow-postgres pg_isready -U careflow >/dev/null 2>&1; do sleep 1; done; \
		cd services/gateway && node --env-file=../../.env $$(which pnpm) exec prisma migrate deploy; cd ../..; \
		$(MAKE) dev; $(MAKE) demo; \
		echo "→ demo-reset done (local Docker Postgres): fresh database, every service running, one synthetic demo patient in the queue."; \
	fi

demo: ## Seed a patient and walk the entire path (needs `make dev` running)
	@test -d scripts/demo/.venv || python3 -m venv scripts/demo/.venv
	@scripts/demo/.venv/bin/pip install -q -U pip
	@scripts/demo/.venv/bin/pip install -q -r scripts/demo/requirements.txt
	@scripts/demo/.venv/bin/python3 scripts/demo/demo.py

storage-setup: ## Create the two private Supabase buckets (idempotent; needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
	@services/ai/.venv/bin/python scripts/supabase/setup_buckets.py

tunnel: ## HTTPS tunnel to the patient app for phone testing (mic needs https); prints the URL
	@bash scripts/tunnel.sh

db-verify: ## Prove RLS is on, audit_log is append-only, and the public anon key reads nothing
	@services/ai/.venv/bin/python scripts/supabase/verify_lockdown.py

db-seed-reference: ## Seed NAMASTE + dictionaries only (no patients) into whatever DATABASE_URL points at
	@bash scripts/supabase/seed-reference.sh

seed-session: ## Create one intake session and print its id + resume token (needs `make dev` running)
	@test -d scripts/demo/.venv || python3 -m venv scripts/demo/.venv
	@scripts/demo/.venv/bin/pip install -q -U pip
	@scripts/demo/.venv/bin/pip install -q -r scripts/demo/requirements.txt
	@scripts/demo/.venv/bin/python3 scripts/demo/seed_session.py

lint: ## Lint everything
	pnpm lint

typecheck: ## Typecheck everything
	pnpm typecheck

test: ## Run all tests
	pnpm test

eval: ## Run the clinical eval harness and print the metrics table
	@test -d eval/.venv || python3 -m venv eval/.venv
	@eval/.venv/bin/pip install -q -U pip
	@eval/.venv/bin/pip install -q -r eval/requirements.txt
	@eval/.venv/bin/python3 eval/run.py

.PHONY: storage-setup db-verify db-seed-reference tunnel help setup py-setup up down reset dev dev-down demo demo-reset seed-session lint typecheck test eval
