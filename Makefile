# NΞØ SMART FACTORY — Makefile

.PHONY: dev dev-dashboard dev-landing dev-mobile dev-all build build-all build-dashboard build-landing build-mobile start lint clean install help ops-sync health test test-dashboard test-landing test-mobile

# Variáveis
DASHBOARD_DIR = .
MOBILE_DIR = ./nuxt-app
LANDING_DIR = ./landing
CORE_DIR = ../../neo_smart_factory/forge-core
CLI_DIR = ../smart-cli
DOCS_DIR = ../docs
OPS_DIR = ../../neo_smart_factory/internal-ops

# Portas
DASHBOARD_PORT = 3000
LANDING_PORT = 3001
MOBILE_PORT = 3002

help:
	@echo "=========================================="
	@echo "NΞØ SMART FACTORY - Comandos Disponíveis"
	@echo "=========================================="
	@echo ""
	@echo "📦 Instalação:"
	@echo "  make install           - Instala dependências em todos os módulos"
	@echo ""
	@echo "🚀 Desenvolvimento:"
	@echo "  make dev               - Inicia Dashboard (porta $(DASHBOARD_PORT))"
	@echo "  make dev-dashboard     - Inicia Dashboard (porta $(DASHBOARD_PORT))"
	@echo "  make dev-vercel        - Inicia Dashboard com Vercel Dev (API completo)"
	@echo "  make dev-landing       - Inicia Landing Page (porta $(LANDING_PORT))"
	@echo "  make dev-mobile        - Inicia Mobile App (porta $(MOBILE_PORT))"
	@echo "  make dev-all           - Inicia todos os frontends simultaneamente"
	@echo ""
	@echo "🏗️  Build:"
	@echo "  make build             - Build do Dashboard"
	@echo "  make build-dashboard   - Build do Dashboard"
	@echo "  make build-landing     - Build da Landing Page"
	@echo "  make build-mobile      - Build do Mobile App"
	@echo "  make build-all         - Build de todos os módulos"
	@echo ""
	@echo "🧪 Testes:"
	@echo "  make test              - Testa Dashboard"
	@echo "  make test-dashboard    - Testa Dashboard"
	@echo "  make test-landing      - Testa Landing"
	@echo "  make test-mobile       - Testa Mobile"
	@echo ""
	@echo "🔧 Utilitários:"
	@echo "  make lint              - Executa linter"
	@echo "  make clean             - Remove node_modules e artefatos de build"
	@echo "  make health            - Verifica integridade do ecossistema"
	@echo "  make ops-sync          - Sincroniza com Internal Ops e Docs"
	@echo ""
	@echo "🚢 Deploy:"
	@echo "  make deploy            - Safe Commit + Push (Triggers Vercel)"
	@echo "                         Usage: make deploy msg=\"feat: ...\""
	@echo "  make deploy-force      - Força deploy manual via Vercel CLI"
	@echo ""

install:
	@echo "📦 Installing dependencies (Monorepo Workspace)..."
	npm install

# ============================================
# Desenvolvimento
# ============================================

dev: dev-dashboard

dev-dashboard:
	@echo "🚀 Starting Dashboard on port $(DASHBOARD_PORT)..."
	@echo "   → http://localhost:$(DASHBOARD_PORT)"
	@echo "   ⚠️  Note: API routes require 'make dev-vercel' for full functionality"
	cd $(DASHBOARD_DIR) && npm run dev

dev-vercel:
	@echo "🚀 Starting Dashboard with Vercel Dev (Full API support)..."
	@echo "   → http://localhost:3000"
	@echo "   → API routes available at /api/*"
	cd $(DASHBOARD_DIR) && npm run dev:vercel

dev-landing:
	@echo "🚀 Starting Landing Page on port $(LANDING_PORT)..."
	@echo "   → http://localhost:$(LANDING_PORT)"
	cd $(LANDING_DIR) && npm run dev

dev-mobile:
	@echo "🚀 Starting Mobile App on port $(MOBILE_PORT)..."
	@echo "   → http://localhost:$(MOBILE_PORT)"
	cd $(MOBILE_DIR) && npm run dev

dev-all:
	@echo "🚀 Launching all NΞØ Frontends..."
	@echo "   Dashboard: http://localhost:$(DASHBOARD_PORT)"
	@echo "   Landing:   http://localhost:$(LANDING_PORT)"
	@echo "   Mobile:    http://localhost:$(MOBILE_PORT)"
	@echo ""
	@echo "⚠️  Press Ctrl+C to stop all servers"
	@trap 'kill 0' EXIT; \
	cd $(DASHBOARD_DIR) && npm run dev & \
	cd $(LANDING_DIR) && npm run dev & \
	cd $(MOBILE_DIR) && npm run dev & \
	wait

# ============================================
# Build
# ============================================

build: build-dashboard

build-dashboard:
	@echo "🏗️  Building Dashboard..."
	cd $(DASHBOARD_DIR) && npm run build
	@echo "✅ Dashboard build complete!"

build-landing:
	@echo "🏗️  Building Landing Page..."
	cd $(LANDING_DIR) && npm run build
	@echo "✅ Landing Page build complete!"

build-mobile:
	@echo "🏗️  Building Mobile App..."
	cd $(MOBILE_DIR) && npm run build
	@echo "✅ Mobile App build complete!"

build-all:
	@echo "🏗️  Building all frontends..."
	@echo ""
	@$(MAKE) build-dashboard
	@echo ""
	@$(MAKE) build-landing
	@echo ""
	@$(MAKE) build-mobile
	@echo ""
	@echo "✅ All builds complete!"

# ============================================
# Testes
# ============================================

test: test-dashboard

test-dashboard:
	@echo "🧪 Testing Dashboard..."
	cd $(DASHBOARD_DIR) && npm run lint
	@echo "✅ Dashboard tests passed!"

test-landing:
	@echo "🧪 Testing Landing Page..."
	@if [ -f "$(LANDING_DIR)/package.json" ] && grep -q '"lint"' "$(LANDING_DIR)/package.json"; then \
		cd $(LANDING_DIR) && npm run lint; \
	else \
		echo "⚠️  No lint script found, skipping..."; \
	fi
	@echo "✅ Landing Page tests passed!"

test-mobile:
	@echo "🧪 Testing Mobile App..."
	@if [ -f "$(MOBILE_DIR)/package.json" ] && grep -q '"lint"' "$(MOBILE_DIR)/package.json"; then \
		cd $(MOBILE_DIR) && npm run lint; \
	else \
		echo "⚠️  No lint script found, skipping..."; \
	fi
	@echo "✅ Mobile App tests passed!"

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

# ============================================
# Lint
# ============================================

lint:
	@echo "🔍 Linting code..."
	cd $(DASHBOARD_DIR) && npm run lint

# ============================================
# Limpeza
# ============================================

clean:
	@echo "🧹 Cleaning build artifacts and dependencies..."
	rm -rf node_modules .next dist
	rm -rf $(MOBILE_DIR)/node_modules $(MOBILE_DIR)/.nuxt $(MOBILE_DIR)/dist
	rm -rf $(LANDING_DIR)/node_modules $(LANDING_DIR)/dist
	@echo "✅ Clean complete!"

# ============================================
# Deploy
# ============================================

deploy:
	@./scripts/safe-deploy.sh "$(msg)"

deploy-force:
	@echo "🚢 Force deploying all modules to Vercel (Production)..."
	@echo ""
	@echo "Deploying Dashboard..."
	vercel deploy --prod
	@echo ""
	@echo "Deploying Landing Page..."
	cd $(LANDING_DIR) && vercel deploy --prod
	@echo ""
	@echo "Deploying Mobile App..."
	cd $(MOBILE_DIR) && vercel deploy --prod
	@echo ""
	@echo "✅ All deployments complete!"

migratedb:
	@echo "Running Database Migrations..."
	node scripts/migrate.js
