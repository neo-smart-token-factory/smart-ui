#!/bin/bash

# NΞØ Smart Factory — Script de Teste de APIs
# Testa todas as rotas de API disponíveis
# Uso: ./scripts/test-apis.sh [base_url]
# Exemplo: ./scripts/test-apis.sh http://localhost:3000

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Base URL (default: localhost:3000)
BASE_URL="${1:-http://localhost:3000}"

echo -e "${BLUE}🧪 NΞØ Smart Factory — Teste de APIs${NC}"
echo -e "${CYAN}Base URL: ${BASE_URL}${NC}"
echo ""

# Contadores
PASSED=0
FAILED=0

# Função para testar endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}Testing: ${description}${NC}"
    echo -e "  ${CYAN}${method} ${endpoint}${NC}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "${BASE_URL}${endpoint}" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "${BASE_URL}${endpoint}" 2>&1)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "  ${GREEN}✅ PASS${NC} (HTTP $http_code)"
        echo -e "  ${CYAN}Response:${NC} $(echo "$body" | head -c 200)..."
        ((PASSED++))
    elif [ "$http_code" -eq 404 ]; then
        echo -e "  ${YELLOW}⚠️  404 (API route not found - using vite dev?)${NC}"
        echo -e "  ${YELLOW}   Use 'make dev-vercel' for API support${NC}"
        ((FAILED++))
    else
        echo -e "  ${RED}❌ FAIL${NC} (HTTP $http_code)"
        echo -e "  ${RED}Response:${NC} $body"
        ((FAILED++))
    fi
    echo ""
}

# ============================================
# 1. Operations Status
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}1. Operations & Status${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_endpoint "GET" "/api/ops-status" "" "Operations Status"

# ============================================
# 2. Deploys
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}2. Deploys${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_endpoint "GET" "/api/deploys" "" "List Deploys"

test_endpoint "POST" "/api/deploys" '{
  "contract_address": "0x1234567890123456789012345678901234567890",
  "owner_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  "network": "base",
  "tx_hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  "token_name": "Test Token",
  "token_symbol": "TEST"
}' "Create Deploy"

# ============================================
# 3. Drafts
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}3. Drafts${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

TEST_ADDRESS="0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"

test_endpoint "GET" "/api/drafts?address=${TEST_ADDRESS}" "" "Get Draft"

test_endpoint "POST" "/api/drafts" "{
  \"user_address\": \"${TEST_ADDRESS}\",
  \"token_config\": {
    \"tokenName\": \"Test Token\",
    \"tokenSymbol\": \"TEST\",
    \"tokenSupply\": \"1000000\",
    \"description\": \"Test description\"
  }
}" "Save Draft"

# ============================================
# 4. Marketing & Analytics
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}4. Marketing & Analytics${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_endpoint "GET" "/api/leads?session_id=test_session_123" "" "Get Lead"

test_endpoint "POST" "/api/leads" '{
  "session_id": "test_session_123",
  "conversion_status": "engaged"
}' "Create Lead"

test_endpoint "GET" "/api/sessions?session_id=test_session_123" "" "Get Session"

test_endpoint "POST" "/api/sessions" '{
  "session_id": "test_session_123",
  "lead_id": "test_lead_123",
  "step_reached": 1
}' "Create Session"

test_endpoint "GET" "/api/events?lead_id=test_lead_123" "" "Get Events"

test_endpoint "POST" "/api/events" '{
  "lead_id": "test_lead_123",
  "session_id": "test_session_123",
  "event_type": "form_start"
}' "Create Event"

test_endpoint "GET" "/api/analytics" "" "Get Analytics"

# ============================================
# 5. Tavily AI Integration
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}5. Tavily AI Integration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_endpoint "POST" "/api/tavily/validate-token-name" '{
  "tokenName": "NeoToken",
  "symbol": "NEO"
}' "Validate Token Name"

test_endpoint "POST" "/api/tavily/market-research" '{
  "category": "DeFi",
  "keywords": "lending protocol"
}' "Market Research"

test_endpoint "POST" "/api/tavily/generate-whitepaper-base" '{
  "tokenName": "NeoToken",
  "category": "DeFi",
  "useCase": "Lending protocol",
  "targetAudience": "Institutional investors"
}' "Generate Whitepaper Base"

test_endpoint "POST" "/api/tavily/marketing-suggestions" '{
  "tokenName": "NeoToken",
  "category": "DeFi",
  "launchDate": "2026-02-01"
}' "Marketing Suggestions"

# ============================================
# Resumo
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Resumo dos Testes${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Passed: ${PASSED}${NC}"
echo -e "${RED}❌ Failed: ${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Todos os testes passaram!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Alguns testes falharam${NC}"
    echo -e "${YELLOW}   Verifique se está usando 'make dev-vercel'${NC}"
    exit 1
fi
