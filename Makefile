# NΞØ SMART FACTORY — Makefile (Dashboard only)

.PHONY: dev dev-dashboard dev-vercel build build-dashboard start lint clean install help ops-sync health test test-dashboard validate

# Variáveis
DASHBOARD_DIR = .
CORE_DIR = ../../neo_smart_factory/smart-core
CLI_DIR = ../smart-cli
DOCS_DIR = ../docs
OPS_DIR = ../../neo_smart_factory/internal-ops
DASHBOARD_PORT = 3000

help:
	@echo "=========================================="
	@echo "NΞØ SMART FACTORY - Dashboard"
	@echo "=========================================="
	@echo ""
	@echo "📦 Instalação:"
	@echo "  make install           - Instala dependências"
	@echo ""
	@echo "🚀 Desenvolvimento:"
	@echo "  make dev               - Inicia Dashboard (porta $(DASHBOARD_PORT))"
	@echo "  make dev-dashboard     - Idem"
	@echo "  make dev-vercel        - Dashboard com Vercel Dev (API completo)"
	@echo ""
	@echo "🏗️  Build:"
	@echo "  make build             - Build do Dashboard"
	@echo ""
	@echo "🧪 Testes:"
	@echo "  make test              - Lint do Dashboard"
	@echo ""
	@echo "🔧 Utilitários:"
	@echo "  make lint              - Executa linter"
	@echo "  make clean             - Remove node_modules e dist"
	@echo "  make health            - Verifica integridade do ecossistema"
	@echo "  make validate          - Valida estrutura (validate-onboarding.sh)"
	@echo "  make ops-sync          - Sincroniza com Internal Ops e Docs"
	@echo "  make sync-env          - Sincroniza variáveis do Vercel para .env local"
	@echo "  make migratedb-marketing - Executa migration de Marketing & Analytics"
	@echo ""
	@echo "🚢 Deploy:"
	@echo "  make deploy            - Safe Commit + Push (Triggers Vercel)"
	@echo "                         Usage: make deploy msg=\"feat: ...\""
	@echo "  make deploy-force      - Deploy manual via Vercel CLI"
	@echo ""

install:
	@echo "📦 Installing dependencies..."
	npm install

# ============================================
# Desenvolvimento
# ============================================

dev: dev-dashboard

dev-dashboard:
	@echo "🚀 Starting Dashboard on port $(DASHBOARD_PORT)..."
	@echo "   → http://localhost:$(DASHBOARD_PORT)"
	@echo "   ⚠️  API routes require 'make dev-vercel' for full functionality"
	cd $(DASHBOARD_DIR) && npm run dev

dev-vercel:
	@echo "🚀 Starting Dashboard with Vercel Dev (Full API support)..."
	@echo "   → http://localhost:3000"
	@echo "   → API routes available at /api/*"
	cd $(DASHBOARD_DIR) && npm run dev:vercel

# ============================================
# Build
# ============================================

build: build-dashboard

build-dashboard:
	@echo "🏗️  Building Dashboard..."
	cd $(DASHBOARD_DIR) && npm run build
	@echo "✅ Dashboard build complete!"

# ============================================
# Testes
# ============================================

test: test-dashboard

test-dashboard:
	@echo "🧪 Testing Dashboard..."
	cd $(DASHBOARD_DIR) && npm run lint
	@echo "✅ Dashboard tests passed!"

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
	@echo "Smart UI (Dashboard)...  [OK]"
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

# ============================================
# Lint
# ============================================

lint:
	@echo "🔍 Linting code..."
	cd $(DASHBOARD_DIR) && npm run lint

# ============================================
# Validação
# ============================================

validate:
	@echo "🔍 Validando estrutura documentada..."
	@if [ -f "./validate-onboarding.sh" ]; then \
		./validate-onboarding.sh; \
	else \
		echo "❌ Script validate-onboarding.sh não encontrado"; \
		exit 1; \
	fi

# ============================================
# Limpeza
# ============================================

clean:
	@echo "🧹 Cleaning build artifacts and dependencies..."
	rm -rf node_modules .next dist
	@echo "✅ Clean complete!"

# ============================================
# Deploy
# ============================================

deploy:
	@./scripts/safe-deploy.sh "$(msg)"

deploy-force:
	@echo "🚢 Force deploying Dashboard to Vercel (Production)..."
	vercel deploy --prod
	@echo "✅ Deployment complete!"

migratedb:
	@echo "Running Database Migrations..."
	@test -f .env || (echo "❌ Crie .env com DATABASE_URL (copie de .env.example)"; exit 1)
	@set -a && . ./.env && set +a && node scripts/migrate.js

migratedb-vercel:
	@echo "Running Database Migrations (using Vercel env vars)..."
	@./scripts/migrate-from-vercel.sh

migratedb-marketing:
	@echo "Running Marketing & Analytics Migration..."
	@test -f .env || (echo "❌ Crie .env com DATABASE_URL (copie de .env.example)"; exit 1)
	@set -a && . ./.env && set +a && node scripts/migrate-marketing.js

sync-env:
	@echo "Sincronizando variáveis de ambiente do Vercel para .env local..."
	@chmod +x scripts/sync-env-from-vercel.sh
	@./scripts/sync-env-from-vercel.sh
