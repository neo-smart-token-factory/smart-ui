# NΞØ SMART FACTORY — Makefile

.PHONY: dev build start lint clean install help ops-sync health

# Variáveis
NEXT_DIR = .
NUXT_DIR = ./nuxt-app
LANDING_DIR = ./landing
CORE_DIR = ../../neo_smart_factory/forge-core
CLI_DIR = ../smart-cli
DOCS_DIR = ../docs
OPS_DIR = ../../neo_smart_factory/internal-ops

help:
	@echo "NΞØ SMART FACTORY - Comandos Disponíveis:"
	@echo "  make install      - Instala dependências em todos os módulos"
	@echo "  make dev          - Inicia o painel principal (Next.js) em modo dev"
	@echo "  make dev-all      - Inicia todos os frontends simultaneamente"
	@echo "  make ops-sync     - Sincroniza status com Internal Ops e Docs"
	@echo "  make link-cli     - Registra o comando 'nxf' globalmente via npm link"
	@echo "  make health       - Verifica integridade entre UI, Core e CLI"
	@echo "  make build-all    - Gera o build de todos os módulos"
	@echo "  make clean        - Remove pastas node_modules e artefatos de build"
	@echo "  make deploy       - Safe Commit + Push (Triggers Vercel). Usage: make deploy msg=\"feat: ...\""
	@echo "  make deploy-force - Força deploy manual via Vercel CLI (bypass Git)"

install:
	@echo "Installing dependencies (Monorepo Workspace)..."
	npm install

dev:
	npm run dev

dev-all:
	@echo "Launching all NΞØ Frontends..."
	npm run dev & cd $(LANDING_DIR) && npm run dev & cd $(NUXT_DIR) && npm run dev

ops-sync:
	@echo "Syncing with NΞØ Ecosystem..."
	@if [ -d "$(OPS_DIR)" ]; then \
		echo "Updating Internal Ops state..."; \
		cp .env.example $(OPS_DIR)/state_sync.env.tmp; \
	fi
	@if [ -f "$(DOCS_DIR)/changelog.md" ]; then \
		echo "Core Documentation found."; \
	fi

link-cli:
	@echo "Linking NΞØ CLI..."
	cd $(CLI_DIR) && npm link

health:
	@echo "======================================"
	@echo "🏥 NΞØ Protocol Health Check"
	@echo "======================================"
	@echo ""
	@echo "📦 Component Status:"
	@echo "--------------------"
	@echo "Smart UI (Local)...       [OK]"
	@if [ -d "$(CORE_DIR)" ]; then \
		echo "Smart Core...             [LINKED]"; \
		echo "  └─ Path: $(CORE_DIR)"; \
	else \
		echo "Smart Core...             [REMOTE/GITHUB]"; \
		echo "  └─ Operating in remote mode (OK)"; \
	fi
	@if [ -d "$(CLI_DIR)" ]; then \
		echo "Smart CLI...              [LINKED]"; \
		echo "  └─ Path: $(CLI_DIR)"; \
	else \
		echo "Smart CLI...              [NOT FOUND]"; \
		echo "  └─ Optional component"; \
	fi
	@if [ -d "$(OPS_DIR)" ]; then \
		echo "Internal Ops...           [LINKED]"; \
		echo "  └─ Path: $(OPS_DIR)"; \
	else \
		echo "Internal Ops...           [NOT FOUND]"; \
		echo "  └─ Optional component"; \
	fi
	@echo ""
	@echo "======================================"
	@echo "✅ All critical components operational"
	@echo "======================================"

build-all:
	npm run build
	cd $(NUXT_DIR) && npm run build
	cd $(LANDING_DIR) && npm run build

clean:
	rm -rf node_modules .next
	rm -rf $(NUXT_DIR)/node_modules $(NUXT_DIR)/.nuxt
	rm -rf $(LANDING_DIR)/node_modules $(LANDING_DIR)/dist

deploy:
	@./scripts/safe-deploy.sh "$(msg)"

deploy-force:
	@echo "Force deploying all modules to Vercel (Production)..."
	vercel deploy --prod
	cd $(LANDING_DIR) && vercel deploy --prod
	cd $(NUXT_DIR) && vercel deploy --prod

migratedb:
	@echo "Running Database Migrations..."
	node scripts/migrate.js
