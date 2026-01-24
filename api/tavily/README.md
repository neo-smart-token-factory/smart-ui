# Tavily API Routes

Rotas de API para integração com Tavily AI Search & Research.

## Rotas Disponíveis

### 1. `POST /api/tavily/validate-token-name`

Valida nome e símbolo de token verificando conflitos.

**Request:**
```json
{
  "tokenName": "MyToken",
  "symbol": "MTK"
}
```

**Response:**
```json
{
  "valid": false,
  "conflicts": [
    {
      "title": "MyToken - Cryptocurrency",
      "url": "https://example.com",
      "score": 0.95
    }
  ],
  "suggestions": ["MyToken Pro", "MyToken X", "Super MyToken"],
  "totalResults": 10
}
```

---

### 2. `POST /api/tavily/market-research`

Pesquisa de mercado e tendências.

**Request:**
```json
{
  "category": "DeFi",
  "keywords": "lending protocol"
}
```

**Response:**
```json
{
  "trends": ["DeFi lending is growing...", "..."],
  "competitors": [
    {
      "name": "Competitor Token",
      "url": "https://example.com",
      "relevance": 0.88,
      "snippet": "..."
    }
  ],
  "marketGaps": ["Lack of mobile-first solutions..."],
  "summary": "Market analysis summary...",
  "totalResults": 15
}
```

---

### 3. `POST /api/tavily/generate-whitepaper-base`

Gera base de conteúdo para whitepaper (Premium Feature).

**Request:**
```json
{
  "tokenName": "MyToken",
  "category": "DeFi",
  "useCase": "Lending protocol",
  "targetAudience": "Institutional investors"
}
```

**Response:**
```json
{
  "introduction": "Introduction text...",
  "tokenomics": "Tokenomics information...",
  "useCase": "Use case details...",
  "marketAnalysis": "Market analysis...",
  "references": [
    {
      "title": "Reference Title",
      "url": "https://example.com",
      "section": "tokenomics",
      "relevance": 0.92
    }
  ],
  "generatedAt": "2026-01-24T12:00:00.000Z"
}
```

---

### 4. `POST /api/tavily/marketing-suggestions`

Sugestões de marketing e campanhas (Premium Feature).

**Request:**
```json
{
  "tokenName": "MyToken",
  "category": "DeFi",
  "launchDate": "2026-02-01"
}
```

**Response:**
```json
{
  "socialMedia": [
    {
      "platform": "twitter",
      "strategy": "Engage with crypto community..."
    }
  ],
  "contentIdeas": [
    {
      "title": "Whitepaper Release",
      "type": "announcement",
      "suggestion": "Anunciar MyToken com whitepaper completo"
    }
  ],
  "timing": {
    "suggestedDay": "Segunda-feira",
    "reasoning": "...",
    "launchDate": "2026-02-01"
  },
  "channels": [
    {
      "channel": "twitter",
      "relevance": 0.95
    }
  ],
  "messaging": [
    {
      "theme": "community",
      "example": "Mensagens focadas em community..."
    }
  ],
  "summary": "Marketing summary...",
  "totalResults": 20
}
```

---

## Tratamento de Erros

Todas as rotas retornam `fallback: true` quando a API da Tavily está indisponível, permitindo que o frontend continue funcionando.

**Exemplo de erro:**
```json
{
  "error": "TAVILY_API_KEY não configurada",
  "fallback": true
}
```

---

## Configuração

Certifique-se de que `TAVILY_API_KEY` está configurada nas variáveis de ambiente do Vercel.

---

## Documentação Completa

Veja [docs/guides/TAVILY_INTEGRATION.md](../../docs/guides/TAVILY_INTEGRATION.md) para documentação completa e exemplos de uso.
