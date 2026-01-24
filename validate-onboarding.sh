#!/bin/bash

# ============================================
# NΞØ SMART FACTORY — Onboarding Validation Script
# ============================================
# Este script valida a estrutura documentada no ONBOARDING_TECHNICAL_SUMMARY.md
#
# Uso: ./validate-onboarding.sh
# ============================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🔍 NΞØ Onboarding Validation${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# ============================================
# 1. Validar Arquivos Críticos
# ============================================
echo -e "${YELLOW}📁 Validando arquivos críticos...${NC}"
echo ""

FILES=(
  ".github/workflows/docs-guard.yml"
  ".github/workflows/protocol-health.yml"
  ".agent/workflows/smart-mint-protocol.md"
  "Makefile"
  "lib/db.js"
  "migrations/01_init.sql"
  "scripts/safe-deploy.sh"
  "package.json"
  ".env.example"
  "vite.config.js"
  "tailwind.config.cjs"
)

MISSING=()

for file in "${FILES[@]}"; do
  if [ ! -f "$file" ]; then
    MISSING+=("$file")
    echo -e "${RED}❌ MISSING: $file${NC}"
    ((FAILED++))
  else
    echo -e "${GREEN}✅ FOUND: $file${NC}"
    ((PASSED++))
  fi
done

if [ ${#MISSING[@]} -ne 0 ]; then
  echo ""
  echo -e "${RED}⚠️  WARNING: ${#MISSING[@]} documented files are missing!${NC}"
  echo "Update documentation or create missing files before sharing."
  ((WARNINGS++))
else
  echo ""
  echo -e "${GREEN}✅ All documented files exist${NC}"
fi

echo ""

# ============================================
# 2. Validar Estrutura de Diretórios
# ============================================
echo -e "${YELLOW}📂 Validando estrutura de diretórios...${NC}"
echo ""

DIRS=(
  "src"
  "src/components"
  "api"
  "docs"
  "docs/adr"
  "landing"
  "nuxt-app"
  "packages/shared"
  "scripts"
  "migrations"
)

for dir in "${DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    echo -e "${RED}❌ MISSING DIR: $dir${NC}"
    ((FAILED++))
  else
    echo -e "${GREEN}✅ FOUND DIR: $dir${NC}"
    ((PASSED++))
  fi
done

echo ""

# ============================================
# 3. Validar Makefile
# ============================================
echo -e "${YELLOW}🔧 Validando Makefile...${NC}"
echo ""

if [ -f "Makefile" ]; then
  # Verificar se comando health existe
  if grep -q "^health:" Makefile; then
    echo -e "${GREEN}✅ Makefile contém comando 'health'${NC}"
    ((PASSED++))
    
    # Tentar executar make health (dry-run)
    if make -n health > /dev/null 2>&1; then
      echo -e "${GREEN}✅ Comando 'make health' é válido${NC}"
      ((PASSED++))
    else
      echo -e "${YELLOW}⚠️  Comando 'make health' pode ter problemas (teste manualmente)${NC}"
      ((WARNINGS++))
    fi
  else
    echo -e "${RED}❌ Makefile não contém comando 'health'${NC}"
    ((FAILED++))
  fi
else
  echo -e "${RED}❌ Makefile não encontrado${NC}"
  ((FAILED++))
fi

echo ""

# ============================================
# 4. Validar package.json
# ============================================
echo -e "${YELLOW}📦 Validando package.json...${NC}"
echo ""

if [ -f "package.json" ]; then
  # Verificar se é workspace
  if grep -q '"workspaces"' package.json; then
    echo -e "${GREEN}✅ package.json configura workspaces${NC}"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠️  package.json não configura workspaces${NC}"
    ((WARNINGS++))
  fi
  
  # Verificar dependências críticas
  DEPS=("react" "vite" "ethers" "tailwindcss")
  for dep in "${DEPS[@]}"; do
    if grep -q "\"$dep\"" package.json; then
      echo -e "${GREEN}✅ Dependência encontrada: $dep${NC}"
      ((PASSED++))
    else
      echo -e "${YELLOW}⚠️  Dependência não encontrada: $dep${NC}"
      ((WARNINGS++))
    fi
  done
else
  echo -e "${RED}❌ package.json não encontrado${NC}"
  ((FAILED++))
fi

echo ""

# ============================================
# 5. Validar .env.example
# ============================================
echo -e "${YELLOW}🔐 Validando .env.example...${NC}"
echo ""

if [ -f ".env.example" ]; then
  # Verificar variáveis críticas
  VARS=("DATABASE_URL" "VITE_CHAIN_ID" "NEXT_PUBLIC_APP_VERSION")
  for var in "${VARS[@]}"; do
    if grep -q "^$var" .env.example; then
      echo -e "${GREEN}✅ Variável encontrada: $var${NC}"
      ((PASSED++))
    else
      echo -e "${YELLOW}⚠️  Variável não encontrada: $var${NC}"
      ((WARNINGS++))
    fi
  done
else
  echo -e "${RED}❌ .env.example não encontrado${NC}"
  ((FAILED++))
fi

echo ""

# ============================================
# 6. Validar Workflows GitHub Actions
# ============================================
echo -e "${YELLOW}🔄 Validando GitHub Actions workflows...${NC}"
echo ""

if [ -f ".github/workflows/protocol-health.yml" ]; then
  # Verificar se menciona NEO_ECOSYSTEM_TOKEN
  if grep -q "NEO_ECOSYSTEM_TOKEN" .github/workflows/protocol-health.yml; then
    echo -e "${GREEN}✅ Workflow protocol-health.yml menciona NEO_ECOSYSTEM_TOKEN${NC}"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠️  Workflow não menciona NEO_ECOSYSTEM_TOKEN${NC}"
    ((WARNINGS++))
  fi
  
  # Verificar se tem continue-on-error
  if grep -q "continue-on-error" .github/workflows/protocol-health.yml; then
    echo -e "${GREEN}✅ Workflow tem continue-on-error (graceful degradation)${NC}"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠️  Workflow não tem continue-on-error${NC}"
    ((WARNINGS++))
  fi
fi

if [ -f ".github/workflows/docs-guard.yml" ]; then
  echo -e "${GREEN}✅ Workflow docs-guard.yml encontrado${NC}"
  ((PASSED++))
fi

echo ""

# ============================================
# 7. Validar Caminhos Hardcoded
# ============================================
echo -e "${YELLOW}🛣️  Validando caminhos hardcoded...${NC}"
echo ""

# Procurar por caminhos absolutos do usuário
HARDCODED_PATHS=$(grep -r "/Users/" .agent/workflows/ 2>/dev/null || true)

if [ -n "$HARDCODED_PATHS" ]; then
  echo -e "${YELLOW}⚠️  Caminhos hardcoded encontrados:${NC}"
  echo "$HARDCODED_PATHS" | while read -r line; do
    echo -e "${YELLOW}   $line${NC}"
  done
  echo -e "${YELLOW}   Considere usar variáveis de ambiente ou caminhos relativos${NC}"
  ((WARNINGS++))
else
  echo -e "${GREEN}✅ Nenhum caminho hardcoded encontrado${NC}"
  ((PASSED++))
fi

echo ""

# ============================================
# 8. Validar Scripts Executáveis
# ============================================
echo -e "${YELLOW}📜 Validando scripts executáveis...${NC}"
echo ""

if [ -f "scripts/safe-deploy.sh" ]; then
  if [ -x "scripts/safe-deploy.sh" ]; then
    echo -e "${GREEN}✅ scripts/safe-deploy.sh é executável${NC}"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠️  scripts/safe-deploy.sh não é executável (execute: chmod +x scripts/safe-deploy.sh)${NC}"
    ((WARNINGS++))
  fi
fi

echo ""

# ============================================
# Resumo Final
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📊 Resumo da Validação${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}✅ Passou: $PASSED${NC}"
echo -e "${YELLOW}⚠️  Avisos: $WARNINGS${NC}"
echo -e "${RED}❌ Falhou: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}🎉 Validação completa: Tudo OK!${NC}"
  exit 0
elif [ $FAILED -eq 0 ]; then
  echo -e "${YELLOW}⚠️  Validação com avisos: Revise os avisos acima${NC}"
  exit 0
else
  echo -e "${RED}❌ Validação falhou: Corrija os erros acima antes de compartilhar${NC}"
  exit 1
fi
