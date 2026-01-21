# NΞØ SMART FACTORY — Makefile

.PHONY: dev build start lint clean install help

# Variáveis
NEXT_DIR = .
NUXT_DIR = ./nuxt-app
LANDING_DIR = ./landing

help:
	@echo "NΞØ SMART FACTORY - Comandos Disponíveis:"
	@echo "  make install      - Instala dependências em todos os módulos"
	@echo "  make dev          - Inicia o painel principal (Next.js) em modo dev"
	@echo "  make dev-nuxt     - Inicia o motor mobile (Nuxt) em modo dev"
	@echo "  make dev-landing  - Inicia a landing page (Vite) em modo dev"
	@echo "  make build        - Gera o build de produção do Next.js"
	@echo "  make build-all    - Gera o build de todos os módulos"
	@echo "  make clean        - Remove pastas node_modules e artefatos de build"

install:
	@echo "Installing dependencies..."
	npm install
	cd $(NUXT_DIR) && npm install
	cd $(LANDING_DIR) && npm install

dev:
	npm run dev

dev-nuxt:
	cd $(NUXT_DIR) && npm run dev

dev-landing:
	cd $(LANDING_DIR) && npm run dev

build:
	npm run build

build-all:
	npm run build
	cd $(NUXT_DIR) && npm run build
	cd $(LANDING_DIR) && npm run build

lint:
	npm run lint

clean:
	rm -rf node_modules
	rm -rf .next
	rm -rf $(NUXT_DIR)/node_modules
	rm -rf $(NUXT_DIR)/.nuxt
	rm -rf $(LANDING_DIR)/node_modules
	rm -rf $(LANDING_DIR)/dist
