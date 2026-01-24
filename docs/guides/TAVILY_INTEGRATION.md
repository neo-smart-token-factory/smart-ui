# 🔍 Tavily AI Integration — Guia de Implementação

**Data:** 2026-01-24  
**Status:** Proposta  
**Categoria:** Guia  
**Audiência:** Desenvolvedores

> **Serviço:** [Tavily API](https://tavily.com/) — AI Search & Research API  
> **Uso:** Validação, pesquisa e geração de conteúdo para Smart Mint

---

## 📋 Visão Geral

A **Tavily API** será integrada ao NΞØ Smart Factory para fornecer capacidades de **pesquisa inteligente** e **validação de mercado** que complementam os upsells premium do funil Smart Mint.

### Casos de Uso Principais

1. **Validação de Nomes/Símbolos** — Verificar disponibilidade e conflitos
2. **Pesquisa de Mercado** — Análise de tendências e competidores
3. **Geração de Conteúdo** — Base para whitepapers e documentação
4. **Marketing Intelligence** — Sugestões de campanhas baseadas em dados

---

## 🎯 Casos de Uso Detalhados

### 1. Validação de Nomes e Símbolos de Tokens

**Contexto:** Quando o usuário está criando um novo token, validar se o nome/símbolo já existe ou tem conflitos potenciais.

**Implementação:**

```javascript
// api/tavily/validate-token-name.js
export default async function handler(req, res) {
  const { tokenName, symbol } = req.body;
  
  if (!process.env.TAVILY_API_KEY) {
    return res.status(500).json({ error: 'TAVILY_API_KEY não configurada' });
  }

  const query = `token ${tokenName} ${symbol} cryptocurrency blockchain`;
  
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: 'basic',
      include_answer: true,
      include_raw_content: false,
      max_results: 10,
    }),
  });

  const data = await response.json();
  
  // Analisar resultados para detectar conflitos
  const conflicts = data.results.filter(result => 
    result.title.toLowerCase().includes(tokenName.toLowerCase()) ||
    result.title.toLowerCase().includes(symbol.toLowerCase())
  );

  return res.json({
    valid: conflicts.length === 0,
    conflicts: conflicts.map(c => ({
      title: c.title,
      url: c.url,
      score: c.score,
    })),
    suggestions: conflicts.length > 0 ? generateSuggestions(tokenName, symbol) : [],
  });
}
```

**Uso no Frontend:**

```javascript
// src/components/TokenForm.jsx
const validateTokenName = async (name, symbol) => {
  const response = await fetch('/api/tavily/validate-token-name', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenName: name, symbol }),
  });
  
  const { valid, conflicts, suggestions } = await response.json();
  
  if (!valid) {
    setValidationError(`Nome/símbolo pode ter conflitos: ${conflicts.length} resultados encontrados`);
    setSuggestions(suggestions);
  }
};
```

---

### 2. Pesquisa de Mercado e Tendências

**Contexto:** Fornecer insights de mercado quando o usuário está configurando seu token, ajudando a posicionar o projeto.

**Implementação:**

```javascript
// api/tavily/market-research.js
export default async function handler(req, res) {
  const { category, keywords } = req.body;
  
  const query = `${category} ${keywords} token launch trends 2026`;
  
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: 'advanced',
      include_answer: true,
      include_raw_content: true,
      max_results: 15,
    }),
  });

  const data = await response.json();
  
  // Extrair insights relevantes
  const insights = {
    trends: extractTrends(data.answer),
    competitors: data.results.slice(0, 5).map(r => ({
      name: r.title,
      url: r.url,
      relevance: r.score,
    })),
    marketGaps: identifyMarketGaps(data.answer),
  };

  return res.json(insights);
}
```

**Uso no Frontend:**

```javascript
// Exibir insights de mercado no dashboard
const MarketInsights = ({ category, keywords }) => {
  const [insights, setInsights] = useState(null);
  
  useEffect(() => {
    fetch('/api/tavily/market-research', {
      method: 'POST',
      body: JSON.stringify({ category, keywords }),
    })
      .then(res => res.json())
      .then(setInsights);
  }, [category, keywords]);
  
  return (
    <div className="market-insights">
      <h3>📊 Insights de Mercado</h3>
      {insights?.trends && (
        <div>
          <h4>Tendências:</h4>
          <ul>{insights.trends.map(t => <li key={t}>{t}</li>)}</ul>
        </div>
      )}
    </div>
  );
};
```

---

### 3. Geração de Conteúdo para Whitepaper

**Contexto:** Upsell premium — Gerar base de conteúdo para whitepaper editável usando pesquisa inteligente.

**Implementação:**

```javascript
// api/tavily/generate-whitepaper-base.js
export default async function handler(req, res) {
  const { tokenName, category, useCase, targetAudience } = req.body;
  
  // Pesquisa multi-query para diferentes seções
  const queries = [
    `${tokenName} ${category} tokenomics model`,
    `${useCase} blockchain implementation`,
    `${targetAudience} cryptocurrency adoption`,
  ];
  
  const researchPromises = queries.map(query =>
    fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: 'advanced',
        include_answer: true,
        include_raw_content: true,
        max_results: 10,
      }),
    }).then(res => res.json())
  );
  
  const researchResults = await Promise.all(researchPromises);
  
  // Estruturar base do whitepaper
  const whitepaperBase = {
    introduction: researchResults[0].answer,
    tokenomics: extractTokenomics(researchResults[0].answer),
    useCase: researchResults[1].answer,
    marketAnalysis: researchResults[2].answer,
    references: researchResults.flatMap(r => 
      r.results.map(ref => ({ title: ref.title, url: ref.url }))
    ),
  };
  
  return res.json(whitepaperBase);
}
```

**Uso no Frontend:**

```javascript
// Componente de geração de whitepaper (upsell premium)
const WhitepaperGenerator = ({ tokenConfig }) => {
  const [whitepaper, setWhitepaper] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const generateBase = async () => {
    setLoading(true);
    const response = await fetch('/api/tavily/generate-whitepaper-base', {
      method: 'POST',
      body: JSON.stringify({
        tokenName: tokenConfig.name,
        category: tokenConfig.category,
        useCase: tokenConfig.useCase,
        targetAudience: tokenConfig.audience,
      }),
    });
    
    const base = await response.json();
    setWhitepaper(base);
    setLoading(false);
  };
  
  return (
    <div className="whitepaper-generator">
      <button onClick={generateBase} disabled={loading}>
        {loading ? 'Gerando...' : 'Gerar Base de Whitepaper (Premium)'}
      </button>
      {whitepaper && (
        <Editor initialContent={whitepaper} />
      )}
    </div>
  );
};
```

---

### 4. Marketing Intelligence e Sugestões de Campanhas

**Contexto:** Upsell premium — Sugerir estratégias de marketing baseadas em pesquisa de mercado.

**Implementação:**

```javascript
// api/tavily/marketing-suggestions.js
export default async function handler(req, res) {
  const { tokenName, category, launchDate } = req.body;
  
  const query = `${category} token launch marketing strategy social media campaigns 2026`;
  
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: 'advanced',
      include_answer: true,
      include_domains: ['twitter.com', 'reddit.com', 'medium.com', 'coindesk.com'],
      max_results: 20,
    }),
  });

  const data = await response.json();
  
  // Extrair estratégias de marketing
  const marketingSuggestions = {
    socialMedia: extractSocialMediaStrategies(data.answer),
    contentIdeas: generateContentIdeas(data.results),
    timing: suggestOptimalTiming(data.answer, launchDate),
    channels: identifyBestChannels(data.results),
    messaging: extractMessagingPatterns(data.answer),
  };
  
  return res.json(marketingSuggestions);
}
```

**Integração com API de Marketing:**

```javascript
// Integrar com api/events.js para tracking
const trackMarketingSuggestion = async (suggestion, userId) => {
  await fetch('/api/events', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      event_type: 'marketing_suggestion_viewed',
      metadata: { suggestion_type: suggestion.type },
    }),
  });
};
```

---

## 🔧 Configuração e Setup

### 1. Variável de Ambiente

A variável `TAVILY_API_KEY` já está configurada no `.env`:

```bash
TAVILY_API_KEY="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"
```

### 2. Estrutura de Pastas Recomendada

```
api/
  tavily/
    validate-token-name.js
    market-research.js
    generate-whitepaper-base.js
    marketing-suggestions.js
    utils.js  # Funções auxiliares compartilhadas
```

### 3. Utilitários Compartilhados

```javascript
// api/tavily/utils.js
export async function searchTavily(query, options = {}) {
  const {
    search_depth = 'basic',
    include_answer = true,
    max_results = 10,
    include_domains = [],
  } = options;

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth,
      include_answer,
      include_raw_content: false,
      max_results,
      include_domains: include_domains.length > 0 ? include_domains : undefined,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily API error: ${response.statusText}`);
  }

  return response.json();
}

export function extractTrends(answer) {
  // Extrair tendências do texto de resposta
  const trendKeywords = ['trending', 'growing', 'increasing', 'popular', 'emerging'];
  return answer
    .split('.')
    .filter(sentence => trendKeywords.some(keyword => sentence.toLowerCase().includes(keyword)))
    .slice(0, 5);
}

export function identifyMarketGaps(answer) {
  // Identificar gaps de mercado mencionados
  const gapIndicators = ['lack of', 'missing', 'opportunity', 'gap', 'unmet'];
  return answer
    .split('.')
    .filter(sentence => gapIndicators.some(indicator => sentence.toLowerCase().includes(indicator)))
    .slice(0, 3);
}
```

---

## 📊 Integração com Features Existentes

### Conexão com API de Marketing

As sugestões de marketing podem ser integradas com as rotas existentes:

```javascript
// api/tavily/marketing-suggestions.js
import { createEvent } from '../events.js';

export default async function handler(req, res) {
  // ... lógica de pesquisa ...
  
  // Registrar evento de uso
  await createEvent({
    user_id: req.headers['x-user-id'],
    event_type: 'tavily_marketing_suggestion_generated',
    metadata: { token_name: req.body.tokenName },
  });
  
  return res.json(marketingSuggestions);
}
```

### Conexão com Sistema de Drafts

Salvar pesquisas como parte do draft do token:

```javascript
// api/drafts.js (atualização)
const saveDraftWithResearch = async (userAddress, tokenConfig, researchData) => {
  const draft = {
    user_address: userAddress,
    token_config: {
      ...tokenConfig,
      research: {
        validation: researchData.validation,
        marketInsights: researchData.insights,
        generatedAt: new Date().toISOString(),
      },
    },
    updated_at: new Date().toISOString(),
  };
  
  // ... salvar no banco ...
};
```

---

## 🚀 Roadmap de Implementação

### Phase 1: Validação Básica (Beta Launch)
- [ ] Implementar `/api/tavily/validate-token-name`
- [ ] Integrar validação no formulário de criação de token
- [ ] Testes com casos reais

### Phase 2: Pesquisa de Mercado
- [ ] Implementar `/api/tavily/market-research`
- [ ] Componente de insights no dashboard
- [ ] Cache de pesquisas para otimização

### Phase 3: Upsells Premium
- [ ] Whitepaper Generator (Premium)
- [ ] Marketing Intelligence (Premium)
- [ ] Integração com sistema de pagamento

### Phase 4: Otimizações
- [ ] Rate limiting e cache
- [ ] Análise de custos de API
- [ ] Monitoramento de uso

---

## 💡 Boas Práticas

### 1. Rate Limiting

```javascript
// Implementar rate limiting para evitar custos excessivos
import rateLimit from 'express-rate-limit';

const tavilyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 requisições por usuário
  message: 'Muitas requisições. Tente novamente em alguns minutos.',
});
```

### 2. Cache de Resultados

```javascript
// Cache de pesquisas similares
import { sql } from '../lib/db.js';

const getCachedResearch = async (queryHash) => {
  const result = await sql`
    SELECT data, created_at 
    FROM tavily_cache 
    WHERE query_hash = ${queryHash}
    AND created_at > NOW() - INTERVAL '24 hours'
  `;
  return result[0]?.data;
};
```

### 3. Tratamento de Erros

```javascript
// Tratamento robusto de erros
try {
  const data = await searchTavily(query);
  return res.json(data);
} catch (error) {
  console.error('Tavily API error:', error);
  
  // Fallback para não quebrar a UX
  return res.status(500).json({
    error: 'Serviço de pesquisa temporariamente indisponível',
    fallback: true,
  });
}
```

---

## 📈 Métricas e Monitoramento

### Eventos para Tracking

- `tavily_validation_requested` — Validação de nome solicitada
- `tavily_market_research_viewed` — Pesquisa de mercado visualizada
- `tavily_whitepaper_generated` — Whitepaper gerado (premium)
- `tavily_marketing_suggestions_viewed` — Sugestões de marketing visualizadas

### Integração com Analytics

```javascript
// api/tavily/utils.js
export async function trackTavilyUsage(eventType, metadata) {
  await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_type: `tavily_${eventType}`,
      metadata,
    }),
  });
}
```

---

## 🔐 Segurança

### Validação de Input

```javascript
// Validar inputs antes de fazer requisições
const validateTokenNameInput = (tokenName, symbol) => {
  if (!tokenName || tokenName.length < 2 || tokenName.length > 50) {
    throw new Error('Nome do token inválido');
  }
  if (!symbol || symbol.length < 2 || symbol.length > 10) {
    throw new Error('Símbolo inválido');
  }
  return true;
};
```

### Proteção da API Key

- ✅ API key armazenada apenas em variáveis de ambiente
- ✅ Nunca expor no frontend
- ✅ Usar apenas em API routes do Vercel (serverless)

---

## 📚 Referências

- [Tavily API Documentation](https://docs.tavily.com/)
- [Tavily Pricing](https://tavily.com/pricing)
- [NΞØ Smart Factory — Upsells Premium](./PROJECT_OVERVIEW.md#upsells-premium)

---

**Status:** Proposta para Beta Launch  
**Prioridade:** Phase 3 (Q2 2026) — AI & Automation  
**Dependências:** Tavily API Key configurada ✅
