.DEFAULT_GOAL := help
SHELL := /bin/bash

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

setup: ## First-time setup: env file, node deps, python venvs
	@test -f .env || (cp .env.example .env && echo "→ created .env, fill it in (see docs/API_KEYS.md)")
	pnpm install
	@echo "→ node workspace ready. Python services: make py-setup"

py-setup: ## Create venvs for the Python services
	@for s in ai docai terminology; do \
		if [ -d services/$$s ]; then \
			python3 -m venv services/$$s/.venv && \
			services/$$s/.venv/bin/pip install -q -U pip && \
			services/$$s/.venv/bin/pip install -q -r services/$$s/requirements.txt && \
			echo "→ services/$$s venv ready"; \
		fi; \
	done

up: ## Start postgres, redis, minio, hapi-fhir
	docker compose up -d
	@echo "→ postgres:5432  redis:6379  minio:9000 (console 9001)  fhir:8090"

down: ## Stop infra
	docker compose down

reset: ## Wipe all local data and restart infra
	docker compose down -v && docker compose up -d

dev: ## Run all apps and services in watch mode
	pnpm dev

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

.PHONY: help setup py-setup up down reset dev lint typecheck test eval
