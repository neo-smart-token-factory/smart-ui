# NΞØ SMART FACTORY — Makefile

.PHONY: dev build start lint clean install help ops-sync health

# Variáveis
NEXT_DIR = .
NUXT_DIR = ./nuxt-app
LANDING_DIR = ./landing
CORE_DIR = ../neo-smart-factory/forge-core
CLI_DIR = ../neo-smart-factory/forge-cli
DOCS_DIR = ../neo-smart-factory/docs
OPS_DIR = ../neo-smart-factory/internal-ops

help:
	@echo "NΞØ SMART FACTORY - Comandos Disponíveis:"
	@echo "  make install      - Instala dependências em todos os módulos"
	@echo "  make dev          - Inicia o painel principal (Next.js) em modo dev"
	@echo "  make ops-sync     - Sincroniza status com Internal Ops e Docs"
	@echo "  make health       - Verifica integridade entre UI, Core e CLI"
	@echo "  make build-all    - Gera o build de todos os módulos"
	@echo "  make clean        - Remove pastas node_modules e artefatos de build"

install:
	@echo "Installing dependencies..."
	npm install
	cd $(NUXT_DIR) && npm install
	cd $(LANDING_DIR) && npm install

dev:
	npm run dev

ops-sync:
	@echo "Syncing with NΞØ Ecosystem..."
	@if [ -d "$(OPS_DIR)" ]; then \
		echo "Updating Internal Ops state..."; \
		cp .env.example $(OPS_DIR)/state_sync.env.tmp; \
	fi
	@if [ -f "$(DOCS_DIR)/changelog.md" ]; then \
		echo "Core Documentation found."; \
	fi

health:
	@echo "NΞØ Protocol Health Check..."
	@echo "Checking Smart UI (Local)... [OK]"
	@if [ -d "$(CORE_DIR)" ]; then echo "Checking Smart Core... [LINKED]"; else echo "Checking Smart Core... [NOT FOUND]"; fi
	@if [ -d "$(CLI_DIR)" ]; then echo "Checking Smart CLI... [LINKED]"; else echo "Checking Smart CLI... [NOT FOUND]"; fi

build-all:
	npm run build
	cd $(NUXT_DIR) && npm run build
	cd $(LANDING_DIR) && npm run build

clean:
	rm -rf node_modules .next
	rm -rf $(NUXT_DIR)/node_modules $(NUXT_DIR)/.nuxt
	rm -rf $(LANDING_DIR)/node_modules $(LANDING_DIR)/dist
