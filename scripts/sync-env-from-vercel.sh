#!/bin/bash

# Script para sincronizar TODAS as variáveis de ambiente do Vercel para .env local
# Uso: ./scripts/sync-env-from-vercel.sh
# Ou: make sync-env

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}🔍 Sincronizando variáveis de ambiente do Vercel...${NC}"
echo ""

# Verificar se está linkado ao Vercel
if [ ! -f ".vercel/project.json" ]; then
  echo -e "${YELLOW}⚠️  Projeto não está linkado ao Vercel.${NC}"
  echo -e "${YELLOW}   Executando: vercel link${NC}"
  vercel link
fi

# Ler nome do projeto do Vercel
PROJECT_NAME=$(cat .vercel/project.json | grep -o '"name":"[^"]*' | cut -d'"' -f4)
echo -e "${CYAN}📦 Projeto Vercel: ${PROJECT_NAME}${NC}"
echo ""

# Baixar variáveis do Vercel
echo -e "${BLUE}📥 Baixando variáveis de ambiente do Vercel...${NC}"

# Criar .env.vercel temporário com variáveis do Vercel
vercel env pull .env.vercel --yes 2>/dev/null || {
  echo -e "${RED}❌ Erro ao baixar variáveis do Vercel.${NC}"
  echo -e "${YELLOW}💡 Verifique se você está autenticado: vercel login${NC}"
  exit 1
}

# Verificar se o arquivo foi criado
if [ ! -f ".env.vercel" ]; then
  echo -e "${RED}❌ .env.vercel não foi criado${NC}"
  exit 1
fi

# Contar variáveis encontradas
VAR_COUNT=$(grep -v '^#' .env.vercel | grep -v '^$' | wc -l | tr -d ' ')
echo -e "${GREEN}✅ ${VAR_COUNT} variável(is) encontrada(s) no Vercel${NC}"
echo ""

# Mostrar preview das variáveis (sem valores sensíveis)
echo -e "${CYAN}📋 Variáveis encontradas:${NC}"
grep -v '^#' .env.vercel | grep -v '^$' | cut -d'=' -f1 | while read var; do
  if [ -n "$var" ]; then
    echo -e "   ${GREEN}✓${NC} $var"
  fi
done
echo ""

# Perguntar se deseja sobrescrever .env existente
if [ -f ".env" ]; then
  echo -e "${YELLOW}⚠️  Arquivo .env já existe.${NC}"
  echo -e "${YELLOW}   Deseja sobrescrever? (s/N)${NC}"
  read -r response
  if [[ ! "$response" =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}❌ Operação cancelada.${NC}"
    rm -f .env.vercel
    exit 0
  fi
fi

# Criar .env com header e variáveis do Vercel
echo -e "${BLUE}📝 Criando arquivo .env...${NC}"

# Criar header do .env
cat > .env << 'EOF'
# ============================================
# NΞØ SMART FACTORY — Interface Configuration
# Variáveis sincronizadas do Vercel
# Gerado automaticamente por: scripts/sync-env-from-vercel.sh
# ============================================
# 
# IMPORTANTE: Este arquivo contém valores reais
# NUNCA commite este arquivo no Git!

EOF

# Adicionar variáveis do Vercel (preservando comentários do .env.example quando possível)
if [ -f ".env.example" ]; then
  # Primeiro, adicionar variáveis do Vercel
  cat .env.vercel >> .env
  
  # Adicionar separador
  echo "" >> .env
  echo "# ============================================" >> .env
  echo "# Variáveis não encontradas no Vercel (opcionais)" >> .env
  echo "# ============================================" >> .env
  echo "" >> .env
  
  # Adicionar variáveis do .env.example que não estão no Vercel (com comentários)
  while IFS= read -r line; do
    # Se é comentário ou linha vazia, adicionar
    if [[ "$line" =~ ^[[:space:]]*# ]] || [[ -z "$line" ]]; then
      echo "$line" >> .env
    # Se é variável, verificar se já existe no .env.vercel
    elif [[ "$line" =~ ^[[:space:]]*([A-Z_]+)= ]]; then
      VAR_NAME="${BASH_REMATCH[1]}"
      if ! grep -q "^${VAR_NAME}=" .env.vercel; then
        echo "$line" >> .env
      fi
    fi
  done < .env.example
else
  # Se não tem .env.example, apenas copiar variáveis do Vercel
  cat .env.vercel >> .env
fi

# Limpar arquivo temporário
rm -f .env.vercel

echo ""
echo -e "${GREEN}✅ Arquivo .env criado com sucesso!${NC}"
echo ""
echo -e "${CYAN}📝 Próximos passos:${NC}"
echo -e "   1. Revise o arquivo .env: ${YELLOW}cat .env${NC}"
echo -e "   2. Adicione variáveis faltantes manualmente se necessário"
echo -e "   3. Execute migrations: ${YELLOW}make migratedb${NC}"
echo ""
