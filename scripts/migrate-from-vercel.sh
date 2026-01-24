#!/bin/bash

# Script para executar migrations usando DATABASE_URL do Vercel
# Uso: ./scripts/migrate-from-vercel.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Buscando DATABASE_URL do Vercel...${NC}"

# Verificar se está linkado ao Vercel
if [ ! -f ".vercel/project.json" ]; then
  echo -e "${YELLOW}⚠️  Projeto não está linkado ao Vercel.${NC}"
  echo -e "${YELLOW}   Executando: vercel link${NC}"
  vercel link
fi

# Tentar obter DATABASE_URL do Vercel
echo -e "${BLUE}📥 Baixando variáveis de ambiente do Vercel...${NC}"

# Criar .env temporário com variáveis do Vercel
vercel env pull .env.vercel --yes 2>/dev/null || {
  echo -e "${RED}❌ Erro ao baixar variáveis do Vercel.${NC}"
  echo -e "${YELLOW}💡 Alternativa: Execute manualmente:${NC}"
  echo -e "   ${GREEN}DATABASE_URL=\"sua-url-aqui\" npm run migrate${NC}"
  exit 1
}

# Carregar DATABASE_URL do .env.vercel
if [ -f ".env.vercel" ]; then
  export $(grep DATABASE_URL .env.vercel | xargs)
  echo -e "${GREEN}✅ DATABASE_URL carregada do Vercel${NC}"
else
  echo -e "${RED}❌ .env.vercel não foi criado${NC}"
  exit 1
fi

# Verificar se DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ DATABASE_URL não encontrada nas variáveis do Vercel${NC}"
  echo -e "${YELLOW}💡 Verifique em: https://vercel.com → Seu projeto → Settings → Environment Variables${NC}"
  rm -f .env.vercel
  exit 1
fi

echo -e "${BLUE}🚀 Executando migrations...${NC}"
echo ""

# Executar migrations
npm run migrate

# Limpar arquivo temporário
rm -f .env.vercel

echo ""
echo -e "${GREEN}✅ Migrations concluídas!${NC}"
