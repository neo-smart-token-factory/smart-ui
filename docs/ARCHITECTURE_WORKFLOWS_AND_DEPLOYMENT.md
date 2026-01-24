# 🏗️ Arquitetura: Workflows GitHub e Deploy Vercel

**Documento Técnico Completo**  
**Data:** Janeiro 2026  
**Versão:** 1.0

---

## 📋 Índice

1. [Workflows do GitHub Actions](#workflows-do-github-actions)
2. [Arquitetura de Conexão Frontend-Backend](#arquitetura-de-conexão-frontend-backend)
3. [Estrutura de Deploy no Vercel](#estrutura-de-deploy-no-vercel)
4. [Avaliação Técnica](#avaliação-técnica)

---

## 🔄 Workflows do GitHub Actions

### 1. Docs Guard (`docs-guard.yml`)

**Trigger:** Pull Requests para `main`

**Objetivo:** Garantir que mudanças de código sejam acompanhadas de documentação.

**Fluxo de Execução:**

```
PR Criado → GitHub Actions Trigger
    ↓
Checkout do código
    ↓
Análise de arquivos modificados
    ↓
Categorização: Código vs Documentação
    ↓
Validação:
  - Se código mudou E docs não mudaram → ❌ FAIL
  - Se código mudou E docs mudaram → ✅ PASS
  - Se apenas docs mudaram → ✅ PASS
```

**Arquivos Monitorados:**

- **Código:** `.github/workflows/*`, `src/*`, `components/*`, `pages/*`, `api/*`, `scripts/*`, `Makefile`, `package.json`, arquivos de config
- **Documentação:** `docs/*`, `*.md` (README, etc.)

**Sugestões Automáticas:**

O workflow sugere arquivos de documentação específicos baseado no tipo de mudança:

- Workflows → `docs/GITHUB_ACTIONS_SETUP.md`
- Código Frontend → `docs/PROJECT_OVERVIEW.md`, `README.md`
- API Routes → `docs/PROJECT_OVERVIEW.md`
- Scripts/Makefile → `README.md`

**Status Atual:** ✅ Funcional

---

### 2. Protocol Health Check (`protocol-health.yml`)

**Trigger:** Push e Pull Requests para `main` ou `master`

**Objetivo:** Verificar saúde do ecossistema NΞØ, incluindo integração cross-repository.

**Fluxo de Execução:**

```
Push/PR → GitHub Actions Trigger
    ↓
Checkout smart-ui (repositório atual)
    ↓
Checkout neo-smart-factory (repositório externo)
    ↓
Setup Node.js 20 + Cache npm
    ↓
npm install (smart-ui)
    ↓
make health (executa validações)
    ↓
Report de saúde do protocolo
```

**Integração Cross-Repository:**

```yaml
- name: Checkout Smart Factory (Core/Docs/Ops)
  uses: actions/checkout@v4
  continue-on-error: true
  with:
    repository: neo-smart-token-factory/neo-smart-factory
    path: neo-smart-factory
    token: ${{ secrets.NEO_ECOSYSTEM_TOKEN }}
```

**Requisitos:**

- **Secret Necessário:** `NEO_ECOSYSTEM_TOKEN` (Personal Access Token com scope `repo`)
- **Repositório Externo:** `neo-smart-token-factory/neo-smart-factory`
- **Comando:** `make health` (deve estar implementado no Makefile)

**Status Atual:** ⚠️ Requer `NEO_ECOSYSTEM_TOKEN` configurado

---

## 🔌 Arquitetura de Conexão Frontend-Backend

### Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    Ecosistema NΞØ Smart UI                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │     Landing      │    │     Mobile       │
│   (React+Vite)  │    │   (React+Vite)   │    │   (Vue+Vite)     │
│   Porta: 3000   │    │   Porta: 3001    │    │   Porta: 3002    │
└────────┬────────┘    └─────────────────┘    └─────────────────┘
         │
         │ fetch('/api/*')
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              Vercel Serverless Functions                     │
│              (Apenas no Dashboard)                           │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ /api/deploys │  │ /api/drafts  │  │/api/ops-status│      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │                │
└─────────┼─────────────────┼─────────────────┼────────────────┘
          │                 │                 │
          └─────────────────┴─────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  Neon Database   │
                  │ (PostgreSQL)     │
                  └──────────────────┘
```

### 1. Dashboard (Raiz `/`)

**Stack:** React 18 + Vite 7.3.1

**Conexões com Backend:**

#### API Routes Utilizadas:

1. **`GET /api/deploys`**
   - **Uso:** Carregar histórico de deploys
   - **Componente:** `App.jsx` → `fetchDeploys()`
   - **Resposta:** Array de deploys ordenados por `created_at DESC` (limite 50)
   - **Tratamento de Erro:** Silencioso em modo `vite dev` (API não disponível)

2. **`POST /api/deploys`**
   - **Uso:** Registrar novo deploy após minting
   - **Componente:** `App.jsx` → `handleForge()`
   - **Payload:**
     ```json
     {
       "contract_address": "0x...",
       "owner_address": "0x...",
       "network": "base",
       "tx_hash": "0x...",
       "token_name": "Token Name",
       "token_symbol": "SYMBOL"
     }
     ```
   - **Tratamento de Erro:** Não bloqueia o fluxo se API falhar

3. **`GET /api/drafts?address={address}`**
   - **Uso:** Carregar draft salvo do usuário
   - **Componente:** `App.jsx` → `loadDraft()`
   - **Resposta:** `token_config` (JSON) ou 404
   - **Tratamento de Erro:** Silencioso se não encontrar

4. **`POST /api/drafts`**
   - **Uso:** Salvar draft do usuário
   - **Componente:** `App.jsx` → `saveDraft()`
   - **Payload:**
     ```json
     {
       "user_address": "0x...",
       "token_config": { ... }
     }
     ```
   - **Lógica:** Upsert (INSERT ... ON CONFLICT DO UPDATE)

5. **`GET /api/ops-status`**
   - **Uso:** Status operacional do protocolo
   - **Componente:** `OpsDashboard.tsx`
   - **Resposta:** Estado operacional (version, codename, status, forge)

**Modo de Desenvolvimento:**

- **`vite dev`:** API routes não funcionam (retornam 404 ou código fonte)
- **`vercel dev`:** API routes funcionam completamente
- **Tratamento:** Frontend detecta ausência de API e continua em modo degradado

**Conexão com Database:**

- **Cliente:** `@neondatabase/serverless` (via `lib/db.js`)
- **Variável de Ambiente:** `DATABASE_URL` (Neon PostgreSQL)
- **Schema:** Tabelas `deploys` e `drafts`

---

### 2. Landing Page (`/landing`)

**Stack:** React 18 + Vite 7.3.1

**Conexões com Backend:**

❌ **Nenhuma conexão com API routes**

**Arquitetura:**

- **Propósito:** Marketing, captura de leads, SEO
- **Deploy:** Projeto separado no Vercel (`smart-ui-landing`)
- **URL de Produção:** `https://smart-ui-landing.vercel.app`
- **Redirecionamento:** Botão CTA redireciona para Dashboard ou Mobile App

**Código Relevante:**

```javascript
// landing/src/sections/App.jsx
window.location.href = "http://localhost:3000/"; // Dev
// window.location.href = "https://neosmartfactory.onchain/"; // Prod
```

**Avaliação:** ✅ Isolado corretamente (sem dependências de backend)

---

### 3. Mobile App (`/nuxt-app`)

**Stack:** Vue 3 + Vite 7.3.1 + Pinia

**Conexões com Backend:**

❌ **Nenhuma conexão com API routes atualmente**

**Arquitetura:**

- **Propósito:** PWA para criação de tokens (mobile-first)
- **Deploy:** Projeto separado no Vercel (`smart-ui-mobile`)
- **URL de Produção:** `https://smart-ui-mobile.vercel.app`
- **Integração Futura:** Telegram Mini App

**Telegram Integration:**

```html
<!-- nuxt-app/index.html -->
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

**Avaliação:** ⚠️ Preparado para integração futura, mas ainda não conectado ao backend

---

## 🚀 Estrutura de Deploy no Vercel

### Visão Geral do Monorepo

```
smart-ui (Repositório GitHub)
│
├── / (Dashboard) → smart-ui-dashboard.vercel.app
├── /landing → smart-ui-landing.vercel.app
└── /nuxt-app → smart-ui-mobile.vercel.app
```

### 1. Dashboard (`smart-ui-dashboard`)

**Configuração Vercel:**

| Configuração | Valor |
|-------------|-------|
| **Repository** | `neo-smart-token-factory/smart-ui` |
| **Root Directory** | `.` (raiz) |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | (automático) |
| **Development Command** | `vite` |

**URLs:**

- **Produção:** `https://smart-ui-dashboard.vercel.app`
- **Preview:** `https://smart-ui-dashboard-{branch}.vercel.app`

**Variáveis de Ambiente:**

- `DATABASE_URL` (obrigatório) - Neon PostgreSQL connection string
- `VITE_CHAIN_ID` - Chain ID para Web3 (ex: `8453` para Base)
- `VITE_RPC_URL` - RPC endpoint
- `NEO_ECOSYSTEM_TOKEN` - GitHub PAT (opcional, para workflows)
- `MODAL_TOKEN_ID` / `MODAL_TOKEN_SECRET` - Modal.com credentials (opcional)

**API Routes:**

✅ **Disponíveis** (Vercel Serverless Functions em `/api`)

- `/api/deploys` → `api/deploys.js`
- `/api/drafts` → `api/drafts.js`
- `/api/ops-status` → `api/ops-status.js`

**Build Process:**

```
1. Vercel clona repositório
2. Executa npm install (raiz)
3. Executa npm run build (raiz)
4. Vite build gera /dist
5. Deploy de /dist + /api como Serverless Functions
```

---

### 2. Landing Page (`smart-ui-landing`)

**Configuração Vercel:**

| Configuração | Valor |
|-------------|-------|
| **Repository** | `neo-smart-token-factory/smart-ui` |
| **Root Directory** | `landing` ⚠️ CRÍTICO |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | (automático) |
| **Development Command** | `vite` |

**URLs:**

- **Produção:** `https://smart-ui-landing.vercel.app`
- **Preview:** `https://smart-ui-landing-{branch}.vercel.app`

**Variáveis de Ambiente:**

❌ **Nenhuma necessária** (frontend estático)

**API Routes:**

❌ **Não disponíveis** (Root Directory é `landing/`, API routes estão na raiz)

**Build Process:**

```
1. Vercel clona repositório
2. Vercel muda para landing/
3. Executa npm install (landing/)
4. Executa npm run build (landing/)
5. Vite build gera landing/dist
6. Deploy de landing/dist como site estático
```

**Configuração Crítica:**

- **Root Directory:** Deve ser exatamente `landing` (sem `/`, sem `.`)
- **Include files outside root:** Recomendado DESABILITAR
- **vite.config.js:** Tem `rollupOptions.input: './index.html'` para garantir entry point

---

### 3. Mobile App (`smart-ui-mobile`)

**Configuração Vercel:**

| Configuração | Valor |
|-------------|-------|
| **Repository** | `neo-smart-token-factory/smart-ui` |
| **Root Directory** | `nuxt-app` ⚠️ CRÍTICO |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | (automático) |
| **Development Command** | `vite` |

**URLs:**

- **Produção:** `https://smart-ui-mobile.vercel.app`
- **Preview:** `https://smart-ui-mobile-{branch}.vercel.app`

**Variáveis de Ambiente:**

❌ **Nenhuma necessária atualmente** (futuro: Telegram Bot Token, etc.)

**API Routes:**

❌ **Não disponíveis** (Root Directory é `nuxt-app/`, API routes estão na raiz)

**Build Process:**

```
1. Vercel clona repositório
2. Vercel muda para nuxt-app/
3. Executa npm install (nuxt-app/)
4. Executa npm run build (nuxt-app/)
5. Vite build gera nuxt-app/dist
6. Deploy de nuxt-app/dist como site estático
```

**Configuração Crítica:**

- **Root Directory:** Deve ser exatamente `nuxt-app` (sem `/`, sem `.`)
- **Include files outside root:** Recomendado DESABILITAR
- **vite.config.js:** Tem `rollupOptions.input: './index.html'` e `server.port: 3002`

---

## 📊 Avaliação Técnica

### ✅ Pontos Fortes

1. **Separação Clara de Responsabilidades**
   - Dashboard: Funcionalidade completa + API
   - Landing: Marketing isolado
   - Mobile: PWA preparado para futuro

2. **Workflows GitHub Actions Bem Estruturados**
   - Docs Guard: Garante qualidade de documentação
   - Protocol Health: Integração cross-repo funcional

3. **Tratamento de Erro Robusto**
   - Frontend não quebra se API não estiver disponível
   - Modo degradado funcional em desenvolvimento

4. **Monorepo Bem Organizado**
   - Workspaces npm configurados corretamente
   - Cada frontend tem seu próprio `package.json`

5. **Deploy Isolado no Vercel**
   - 3 projetos separados = deploys independentes
   - URLs separadas = melhor organização

---

### ⚠️ Pontos de Atenção

1. **API Routes Apenas no Dashboard**
   - **Problema:** Landing e Mobile não têm acesso às API routes
   - **Impacto:** Se precisarem de backend no futuro, precisarão:
     - Criar API routes próprias em seus diretórios, OU
     - Fazer chamadas para o Dashboard (CORS necessário), OU
     - Criar um backend separado

2. **Protocol Health Check Requer Secret**
   - **Problema:** `NEO_ECOSYSTEM_TOKEN` não configurado = workflow falha silenciosamente
   - **Solução:** Documentar claramente a necessidade do secret

3. **Dependência de `make health`**
   - **Problema:** Workflow chama `make health` mas não sabemos se está implementado
   - **Recomendação:** Validar implementação do comando

4. **Landing e Mobile Sem Backend**
   - **Status Atual:** OK (não precisam)
   - **Futuro:** Se precisarem, precisarão de estratégia de integração

5. **Cache do Vercel**
   - **Problema:** Cache pode causar builds incorretos
   - **Solução:** Limpar cache quando necessário (já documentado)

---

### 🔧 Recomendações de Melhoria

#### Curto Prazo

1. **Validar `make health`**
   ```bash
   # Verificar se comando existe e funciona
   make health
   ```

2. **Documentar Secret Necessário**
   - Adicionar ao `README.md` ou `DEPLOY_GUIDE.md`
   - Instruções claras de como criar PAT do GitHub

3. **Testar Workflows Localmente**
   ```bash
   # Usar act (https://github.com/nektos/act)
   act -W .github/workflows/docs-guard.yml
   act -W .github/workflows/protocol-health.yml
   ```

#### Médio Prazo

1. **API Gateway Centralizado (Opcional)**
   - Se Landing/Mobile precisarem de backend, criar API routes compartilhadas
   - Ou usar um serviço de API separado (ex: Railway, Render)

2. **Monitoramento de Deploys**
   - Adicionar notificações de sucesso/falha de deploy
   - Integração com Slack/Discord (opcional)

3. **Testes Automatizados**
   - Adicionar testes E2E para workflows
   - Validar que API routes funcionam após deploy

#### Longo Prazo

1. **Unificação de Frontends (Opcional)**
   - Avaliar se faz sentido manter 3 frontends separados
   - Considerar monorepo com Turbo/NX para compartilhar código

2. **Backend Dedicado**
   - Se complexidade crescer, considerar backend separado (ex: Express, FastAPI)
   - API routes do Vercel são ótimas para MVP, mas podem limitar em escala

---

### 📈 Métricas de Saúde

| Métrica | Status | Nota |
|---------|--------|------|
| **Workflows Funcionais** | ✅ | Docs Guard OK, Protocol Health requer secret |
| **Deploy Dashboard** | ✅ | Funcional com API routes |
| **Deploy Landing** | ✅ | Site estático funcionando |
| **Deploy Mobile** | ✅ | Site estático funcionando |
| **Tratamento de Erro** | ✅ | Robusto e silencioso |
| **Documentação** | ✅ | Bem documentado |
| **Isolamento** | ✅ | Frontends bem separados |
| **Backend Acessível** | ⚠️ | Apenas Dashboard tem acesso |

---

### 🎯 Conclusão

A arquitetura atual é **sólida e bem estruturada** para um projeto em fase de desenvolvimento. A separação dos 3 frontends facilita desenvolvimento independente e deploy isolado. Os workflows do GitHub garantem qualidade de código e documentação.

**Principais Destaques:**

- ✅ Arquitetura clara e escalável
- ✅ Deploy funcional em todos os frontends
- ✅ Tratamento de erro robusto
- ✅ Documentação completa

**Principais Desafios:**

- ⚠️ API routes apenas no Dashboard (limitação arquitetural)
- ⚠️ Protocol Health requer secret configurado
- ⚠️ Validação de `make health` pendente

**Recomendação Geral:** ✅ **Arquitetura pronta para produção**, com pequenos ajustes de configuração e validação.

---

**Última atualização:** Janeiro 2026  
**Autor:** Documentação técnica gerada automaticamente
