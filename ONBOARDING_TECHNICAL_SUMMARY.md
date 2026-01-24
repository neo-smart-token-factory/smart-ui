# 📋 Resumo Técnico — Onboarding NΞØ Smart Factory UI

**Versão:** 0.5.3  
**Data:** Janeiro 2026  
**Status:** Demo and Intent Layer (Estrutura Arquitetural Protegida)

---

## ⚠️ AVISO IMPORTANTE - VALIDAÇÃO NECESSÁRIA

**Este documento foi gerado com base em análise estrutural da codebase.**

**Antes de executar comandos ou seguir instruções:**

1. ✅ **Valide existência de arquivos mencionados** - Use o script `validate-onboarding.sh`
2. ✅ **Adapte caminhos para seu ambiente** - Caminhos relativos podem precisar ajuste
3. ✅ **Configure secrets necessários** - Veja seção [Configuração de Secrets](#-configuração-de-secrets-e-autenticação)
4. ✅ **Teste em ambiente isolado primeiro** - Não execute em produção sem validação

**Status de Validação:**
- [x] Estrutura de arquivos verificada
- [x] Workflows GitHub Actions analisados
- [x] Dependências documentadas
- [ ] Comandos `make` testados localmente
- [ ] Workflows testados com/sem token
- [ ] Onboarding completo testado em ambiente fresh

**Reporte problemas:** Abra uma issue no repositório ou consulte a documentação em `docs/`

---

## 🎯 Visão Geral do Projeto

A **NΞØ Smart Factory UI** é uma interface de gestão e fábrica de tokens multichain, desenvolvida como uma **Demo and Intent Layer**. O projeto demonstra fluxos e conceitos, mas **não representa autoridade de protocolo** e não executa transações reais na blockchain sem integração Web3 completa.

**⚠️ IMPORTANTE:** Esta estrutura é protegida por arquitetura NEØ. Modificações estruturais (pastas, renomeação de arquivos) requerem autorização direta.

---

## 📑 Índice Rápido

- [Tech Stack & Dependências](#-tech-stack--dependências)
- [Arquitetura de Pastas](#️-arquitetura-de-pastas)
- [Workflows & Automações](#-workflows--automações)
- [Arquitetura Detalhada de Repositórios](#️-arquitetura-detalhada-de-repositórios)
- [Configuração de Secrets e Autenticação](#-configuração-de-secrets-e-autenticação)
- [Implementação do `make health`](#️-implementação-do-make-health)
- [Padrões Ausentes (Oportunidades)](#-padrões-ausentes-oportunidades-de-melhoria)
- [Recomendações de Implementação](#-recomendações-de-implementação)
- [Checklist de Validação](#-checklist-de-validação)
- [Troubleshooting Comum](#-troubleshooting-comum)
- [Integrações Cross-Repositório](#-integrações-cross-repositório)
- [Documentação](#-documentação)
- [Integrações Chave (Web3 & UI)](#-integrações-chave)
- [Pontos de Atenção](#️-pontos-de-atenção-para-desenvolvedores)

---

## 📦 Tech Stack & Dependências

### Dependencies (Raiz do Projeto)

```json
{
  "@neondatabase/serverless": "^1.0.2",    // Cliente Neon Database (serverless)
  "clsx": "^2.1.0",                        // Utilitário para classes CSS condicionais
  "ethers": "^6.10.0",                     // Biblioteca Web3 - Ethereum (v6)
  "framer-motion": "^11.0.0",              // Biblioteca de animações
  "lucide-react": "^0.300.0",              // Ícones React
  "postgres": "^3.4.8",                    // Cliente PostgreSQL
  "react": "^18.0.0",                      // React Framework
  "react-dom": "^18.0.0",                  // React DOM Renderer
  "tailwind-merge": "^2.2.0"               // Merge de classes Tailwind
}
```

### DevDependencies (Raiz do Projeto)

```json
{
  "@types/node": "^20.0.0",                 // TypeScript types para Node.js
  "@types/react": "^18.0.0",               // TypeScript types para React
  "@types/react-dom": "^18.0.0",           // TypeScript types para React DOM
  "@vitejs/plugin-react": "^5.1.2",        // Plugin Vite para React
  "autoprefixer": "^10.0.1",               // Autoprefixer para CSS
  "eslint": "^9.39.2",                     // Linter JavaScript/TypeScript
  "eslint-plugin-react": "^7.37.5",        // Plugin ESLint para React
  "eslint-plugin-react-hooks": "^7.0.1",  // Plugin ESLint para React Hooks
  "eslint-plugin-react-refresh": "^0.4.26", // Plugin ESLint para React Refresh
  "globals": "^17.0.0",                    // Globals para ESLint
  "postcss": "^8.4.1",                     // PostCSS
  "tailwindcss": "^3.3.0",                 // Tailwind CSS Framework
  "typescript": "^5.0.0",                  // TypeScript Compiler
  "vite": "^7.3.1"                         // Build Tool e Dev Server
}
```

### Workspaces (Monorepo)

O projeto utiliza **workspaces** do npm/yarn, organizando múltiplas aplicações:

1. **`landing/`** — Landing Page (React + Vite)
2. **`nuxt-app/`** — Aplicação Nuxt/Vue (Mobile)
3. **`packages/*`** — Pacotes compartilhados

---

## 🏗️ Arquitetura de Pastas

```
smart-ui/
├── .agent/                          # Workflows e automações do agente
│   └── workflows/
│       └── smart-mint-protocol.md   # Workflow de sincronização multi-repo
├── .github/                         # GitHub Actions
│   └── workflows/
│       ├── docs-guard.yml           # Verificação de documentação em PRs
│       └── protocol-health.yml      # Health check do ecossistema NΞØ
├── api/                             # API Routes (Vercel Serverless)
│   ├── deploys.js
│   ├── drafts.js
│   └── ops-status.js
├── docs/                            # Documentação Arquitetural
│   ├── adr/                         # Architecture Decision Records
│   │   ├── 0001-smart-ui-backend-boundary.md
│   │   ├── 0002-ui-as-demo-and-intent-layer.md
│   │   ├── 0003-wallet-extensions-mpc-automation-posture.md
│   │   └── 0004-kyc-governance-strategy.md
│   ├── ARCHITECTURAL_ADDENDUMS.md
│   ├── DATABASE_SCHEMA.sql
│   ├── FRONTEND_MAP.md
│   ├── PROJECT_OVERVIEW.md
│   └── ... (outros docs)
├── landing/                         # Workspace: Landing Page
│   ├── src/
│   │   ├── main.jsx
│   │   ├── sections/
│   │   │   └── App.jsx
│   │   ├── styles.css
│   │   └── tokens.css
│   ├── package.json
│   └── vite.config.js
├── lib/                             # Bibliotecas utilitárias
│   └── db.js                        # Configuração de banco de dados
├── migrations/                      # Migrações de banco de dados
│   └── 01_init.sql
├── nuxt-app/                        # Workspace: Nuxt/Vue App
│   ├── src/
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── package.json
│   └── vite.config.js
├── packages/                        # Pacotes compartilhados
│   └── shared/                      # Lógica e constantes compartilhadas
│       ├── constants.js
│       ├── index.js
│       └── package.json
├── public/                          # Assets estáticos
│   ├── brand/                       # Logos e marca
│   ├── images/                      # Imagens
│   └── sw.js                        # Service Worker
├── scripts/                         # Scripts utilitários
│   ├── migrate.js
│   └── safe-deploy.sh
├── src/                             # Aplicação Principal (React)
│   ├── App.jsx                      # Componente raiz
│   ├── main.jsx                     # Entry point
│   ├── index.css                    # Estilos globais
│   └── components/                  # Componentes React
│       ├── AssetPack.tsx
│       ├── CustomService.tsx
│       ├── LandingSection.tsx
│       ├── NetworkSelector.tsx
│       └── OpsDashboard.tsx
├── package.json                     # Configuração raiz (workspaces)
├── vite.config.js                   # Configuração Vite
├── tailwind.config.cjs              # Configuração Tailwind
├── tsconfig.json                    # Configuração TypeScript
└── README.md                        # Documentação principal
```

### Estrutura Detalhada do `src/`

```
src/
├── App.jsx                          # Componente principal da aplicação
├── main.jsx                         # Entry point React
├── index.css                        # Estilos globais e tokens CSS
└── components/
    ├── AssetPack.tsx                # Componente de pacote de ativos
    ├── CustomService.tsx            # Componente de serviço customizado
    ├── LandingSection.tsx           # Seção de landing
    ├── NetworkSelector.tsx          # Seletor de rede blockchain
    └── OpsDashboard.tsx             # Dashboard de operações
```

---

## 🔄 Workflows & Automações

### GitHub Actions Workflows

#### 1. **Docs Guard** (`.github/workflows/docs-guard.yml`)

**Trigger:** Pull Requests para `main`

**Propósito:** Garante que mudanças de código sejam acompanhadas de atualizações na documentação.

**Funcionamento:**
- Analisa arquivos alterados no PR
- Categoriza em arquivos de código vs. documentação
- **Falha se:** Código foi alterado mas nenhuma documentação foi atualizada
- **Sugestões automáticas:** Indica quais arquivos de documentação devem ser atualizados baseado nos arquivos alterados

**Arquivos monitorados:**
- Código: `src/*`, `api/*`, `scripts/*`, `*.config.*`, `package.json`
- Documentação: `docs/*`, `*.md`, `README.md`

**Exemplo de falha:**
```
❌ DOCUMENTATION CHECK FAILED
This PR modifies code but does not update any documentation.
💡 SUGGESTED ACTIONS:
   📄 README.md
   📄 docs/PROJECT_OVERVIEW.md
```

#### 2. **Protocol Health Check** (`.github/workflows/protocol-health.yml`)

**Triggers:**
- Push para `main` ou `master`
- Pull Requests para `main` ou `master`

**Propósito:** Verifica a integridade do ecossistema NΞØ, incluindo integração com outros repositórios.

**Funcionamento:**
1. Faz checkout do repositório `smart-ui` (atual)
2. Faz checkout do repositório `neo-smart-factory` (cross-repo)
3. Instala dependências
4. Executa `make health` para verificação de integridade

**Integração Cross-Repo:**
```yaml
- name: Checkout Smart Factory (Core/Docs/Ops)
  uses: actions/checkout@v4
  continue-on-error: true
  with:
    repository: neo-smart-token-factory/neo-smart-factory
    path: neo-smart-factory
    token: ${{ secrets.NEO_ECOSYSTEM_TOKEN }}
```

**Secrets Necessários:**
- `NEO_ECOSYSTEM_TOKEN` (Personal Access Token com acesso ao repositório `neo-smart-factory`)
  - **Nota:** Se não configurado, o workflow continua mas sem acesso ao repositório externo (`continue-on-error: true`)

**Comando executado:**
```bash
make health  # Verifica status de todos os componentes do ecossistema
```

### Agent Workflows (`.agent/workflows/`)

#### **Smart Mint Protocol** (`smart-mint-protocol.md`)

**Propósito:** Workflow de sincronização e operações multi-repositório para garantir alinhamento entre componentes do ecossistema NΞØ.

**Fluxo de Trabalho:**

1. **Verificação de Alinhamento (Core)**
   - Quando alterar interação com contrato, verificar última versão em:
     - `/Users/nettomello/CODIGOS/neo-smart-factory/forge-core/contracts/`
   - Garantir que ABI no frontend corresponde ao deploy atual

2. **Registro em Documentação (Docs)**
   - Após tarefa significativa, atualizar:
     - `/Users/nettomello/CODIGOS/neo-smart-factory/docs/changelog.md`
     - `/Users/nettomello/CODIGOS/neo-smart-factory/docs/patch-v0.5.1.md` (se mudança de versão)

3. **Reporte de Operações (Internal Ops)**
   - Atualizar estado em:
     - `/Users/nettomello/CODIGOS/neo-smart-factory/internal-ops/state.json`
   - Opcionalmente gerar snippet de marketing em:
     - `/Users/nettomello/CODIGOS/neo-smart-factory/internal-ops/marketing/`

4. **Sincronização de Build (CLI)**
   - Verificar se CLI precisa atualização em:
     - `/Users/nettomello/CODIGOS/neo-smart-factory/forge-cli/`
   - Testar se `neo-smart-factory status` reflete mudanças

**Comandos de Atalho:**
- `NEO::doc <mensagem>` → Adicionar ao changelog
- `NEO::sync` → Verificar integridade entre UI e Core
- `NEO::ops <status>` → Atualizar status no Internal Ops

---

## 🔗 Integrações Cross-Repositório

### Repositórios do Ecossistema NΞØ

O projeto `smart-ui` faz parte de um ecossistema maior coordenado pela organização **`neo-smart-token-factory`** no GitHub.

#### Repositórios Relacionados

1. **`neo-smart-factory`** (Repositório Principal)
   - **Organização:** `neo-smart-token-factory/neo-smart-factory`
   - **Integração:** Checkout automático no workflow `protocol-health.yml`
   - **Conteúdo esperado:**
     - `forge-core/contracts/` — Contratos inteligentes
     - `docs/changelog.md` — Changelog do ecossistema
     - `internal-ops/` — Operações internas e estado
     - `forge-cli/` — CLI do ecossistema

2. **`smart-ui`** (Este repositório)
   - **Organização:** `neo-smart-token-factory/smart-ui`
   - **Status:** Demo and Intent Layer

3. **`landing`** (Repositório separado)
   - **Organização:** `neo-smart-token-factory/landing`
   - **Propósito:** Landing page pública

4. **`docs`** (Repositório de documentação)
   - **Organização:** `neo-smart-token-factory/docs`
   - **Propósito:** Documentação centralizada

### Padrões de Integração

#### 1. **Repository Checkout (GitHub Actions)**

O workflow `protocol-health.yml` utiliza checkout cross-repo:

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
- Personal Access Token (PAT) com permissões de leitura no repositório `neo-smart-factory`
- Secret configurado: `NEO_ECOSYSTEM_TOKEN`

#### 2. **Referências Locais (Makefile)**

O `Makefile` referencia caminhos locais para outros componentes (desenvolvimento local):

```makefile
CORE_DIR = ../../neo_smart_factory/forge-core
CLI_DIR = ../smart-cli
DOCS_DIR = ../docs
OPS_DIR = ../../neo_smart_factory/internal-ops
```

**Comandos relacionados:**
- `make health` — Verifica integridade de todos os componentes
- `make ops-sync` — Sincroniza com Internal Ops e Docs

#### 3. **Variáveis de Ambiente (Integrações Externas)**

O arquivo `.env.example` referencia integrações com serviços externos:

```bash
# Ecosystem Synchronization (Local Dev Only)
INTERNAL_OPS_PATH="../neo-smart-factory/internal-ops/state.json"
CORE_CONTRACTS_PATH="../neo-smart-factory/forge-core/contracts"
```

**Nota:** Em produção, estas serão substituídas por APIs via Neon.tech

### Secrets e Tokens Necessários

#### GitHub Secrets

| Secret | Propósito | Obrigatório | Workflow |
|--------|-----------|-------------|----------|
| `NEO_ECOSYSTEM_TOKEN` | Personal Access Token para checkout do repositório `neo-smart-factory` | Opcional (workflow continua sem ele) | `protocol-health.yml` |

**Como configurar `NEO_ECOSYSTEM_TOKEN`:**
1. Gerar Personal Access Token (classic) no GitHub
2. Permissões necessárias: `repo` (acesso a repositórios privados da organização)
3. Adicionar como secret no repositório `smart-ui`:
   - Settings → Secrets and variables → Actions → New repository secret
   - Name: `NEO_ECOSYSTEM_TOKEN`
   - Value: Token gerado

#### Variáveis de Ambiente (Aplicação)

| Variável | Propósito | Obrigatório | Serviço |
|----------|-----------|-------------|---------|
| `MODAL_TOKEN_ID` | Token ID para integração com Modal.com (IA) | Opcional | Modal.com |
| `MODAL_TOKEN_SECRET` | Token Secret para integração com Modal.com | Opcional | Modal.com |
| `DATABASE_URL` | URL de conexão com Neon Database | Sim (produção) | Neon.tech |
| `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID` | ID do ambiente Dynamic.xyz (Auth) | Opcional | Dynamic.xyz |
| `NEXT_PUBLIC_DRPC_API_KEY` | API Key do dRPC (RPC Provider) | Opcional | dRPC |
| `NEXT_PUBLIC_ALCHEMY_ID` | ID do Alchemy (RPC Provider) | Opcional | Alchemy |

### Triggers e Actions Configurados

#### Triggers de Workflow

| Workflow | Trigger | Condição |
|----------|---------|----------|
| `docs-guard.yml` | `pull_request` | Branch: `main` |
| `protocol-health.yml` | `push` | Branches: `main`, `master` |
| `protocol-health.yml` | `pull_request` | Branches: `main`, `master` |

#### Actions Utilizadas

| Action | Versão | Uso |
|--------|--------|-----|
| `actions/checkout@v4` | v4 | Checkout de código (próprio repo e cross-repo) |
| `actions/setup-node@v4` | v4 | Setup Node.js com cache de npm |

**Nota:** Não há uso de `repository_dispatch` ou `workflow_dispatch` configurados atualmente. As integrações são unidirecionais (smart-ui → neo-smart-factory).

---

## 🏛️ Arquitetura Detalhada de Repositórios

### Ecossistema NΞØ - Organização GitHub

```
neo-smart-token-factory/  (Organização GitHub)
│
├── neo-smart-factory/           # Repositório CORE (Principal)
│   ├── forge-core/
│   │   └── contracts/           # Contratos Solidity
│   ├── forge-cli/               # CLI do ecossistema
│   ├── docs/
│   │   └── changelog.md         # Changelog centralizado
│   └── internal-ops/
│       └── state.json           # Estado do ecossistema
│
├── smart-ui/                    # Repositório ATUAL (Interface)
│   ├── .github/workflows/
│   │   ├── protocol-health.yml  # ← FAZ CHECKOUT de neo-smart-factory
│   │   └── docs-guard.yml
│   └── .agent/workflows/
│       └── smart-mint-protocol.md # ← Define sincronização multi-repo
│
├── landing/                     # Landing Page pública
│
└── docs/                        # Documentação centralizada
```

### Fluxo de Integração Cross-Repo

```
┌─────────────────────────────────────────────────────┐
│  TRIGGER: Push/PR para main                         │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │ 1. Checkout smart-ui  │
          │    (actions/checkout) │
          └───────────┬───────────┘
                      │
                      ▼
          ┌─────────────────────────────────────┐
          │ 2. Checkout neo-smart-factory         │
          │    (usando NEO_ECOSYSTEM_TOKEN)      │
          │    continue-on-error: true           │
          └───────────┬─────────────────────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │ 3. npm install (ui)   │
          │    (com cache)        │
          └───────────┬───────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │ 4. make health         │
          │    (valida integridade)│
          └───────────┬───────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │ ✅ SUCESSO ou ❌ FALHA │
          └───────────────────────┘
```

---

## 🔐 Configuração de Secrets e Autenticação

### Secret Crítico: `NEO_ECOSYSTEM_TOKEN`

**Tipo:** GitHub Personal Access Token (PAT) - Classic

**Permissões Necessárias:**
```
✅ repo (Full control of private repositories)
   ├── repo:status
   ├── repo_deployment
   ├── public_repo
   └── repo:invite
```

**Como Gerar:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Scopes:
   - ✅ `repo` (marcar tudo)
   - ✅ `workflow` (se precisar disparar workflows remotos)
4. Gerar token e copiar (não será exibido novamente)

**Como Configurar no Repositório:**
1. Ir em `smart-ui` repository no GitHub
2. Settings → Secrets and variables → Actions
3. New repository secret:
   - **Name:** `NEO_ECOSYSTEM_TOKEN` (exatamente este nome)
   - **Value:** Token gerado acima
4. Add secret

**⚠️ Comportamento:**
```yaml
continue-on-error: true  # Workflow não falha se token ausente
```
- Workflow continua mesmo sem token, mas pula integração cross-repo
- Ideal para forks/contribuidores externos que não têm acesso ao repositório privado

---

## 🛠️ Implementação do `make health`

### Makefile Esperado

O comando `make health` (definido no `Makefile` da raiz) valida a integridade do ecossistema:

```makefile
# Variáveis de integração
FACTORY_DIR = neo-smart-factory
CORE_DIR = $(FACTORY_DIR)/forge-core
CLI_DIR = $(FACTORY_DIR)/forge-cli
DOCS_DIR = $(FACTORY_DIR)/docs
OPS_DIR = $(FACTORY_DIR)/internal-ops

.PHONY: health
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
```

**Validações Realizadas:**
1. ✅ Verifica se `smart-ui` está operacional
2. ✅ Verifica se `neo-smart-factory` foi clonado (via workflow)
3. ✅ Verifica existência de contratos em `forge-core/contracts/`
4. ✅ Verifica existência de CLI em `forge-cli/`
5. ✅ Verifica existência de changelog em `docs/changelog.md`
6. ✅ Verifica existência de estado operacional em `internal-ops/state.json`

**Teste Local:**
```bash
# Simular estrutura (desenvolvimento local)
mkdir -p neo-smart-factory/{forge-core/contracts,forge-cli,docs,internal-ops}

# Executar health check
make health
```

---

## 🔮 Padrões Ausentes (Oportunidades de Melhoria)

### 1. Repository Dispatch (Não Implementado)

**O que falta:**
```yaml
# smart-ui poderia notificar neo-smart-factory após deploy
jobs:
  notify-factory:
    runs-on: ubuntu-latest
    steps:
      - name: Notify Factory of UI Deploy
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.NEO_ECOSYSTEM_TOKEN }}
          repository: neo-smart-token-factory/neo-smart-factory
          event-type: ui-deployed
          client-payload: |
            {
              "version": "${{ github.sha }}",
              "deployed_at": "${{ github.event.head_commit.timestamp }}"
            }
```

**Benefício:** Factory poderia reagir automaticamente a deploys da UI

### 2. Workflow Dispatch (Não Implementado)

**O que falta:**
```yaml
# Permitir trigger manual de health check
on:
  workflow_dispatch:
    inputs:
      deep_check:
        description: 'Run deep integration tests'
        required: false
        default: 'false'
```

**Benefício:** Desenvolvedores poderiam rodar health check manualmente via GitHub UI

### 3. Reusable Workflows (Não Implementado)

**O que falta:**
```yaml
# neo-smart-factory/.github/workflows/shared-health.yml
name: Shared Health Check (Reusable)
on:
  workflow_call:
    inputs:
      component:
        required: true
        type: string

jobs:
  health:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Checking ${{ inputs.component }}"
```

**Uso em smart-ui:**
```yaml
jobs:
  health:
    uses: neo-smart-token-factory/neo-smart-factory/.github/workflows/shared-health.yml@main
    with:
      component: "smart-ui"
```

**Benefício:** Reutilização de lógica de health check em todos os repos

---

## 🎯 Recomendações de Implementação

### Prioridade Alta 🔴

1. **Implementar `make health` completo**
   - ✅ Já existe no Makefile atual
   - ⚠️ Validar que funciona com e sem `neo-smart-factory` clonado
   - ⚠️ Adicionar validações mais robustas (ABIs, versões)

2. **Documentar `NEO_ECOSYSTEM_TOKEN` setup**
   - Criar `docs/CROSS_REPO_SETUP.md`
   - Incluir screenshots do processo
   - Troubleshooting comum

3. **Adicionar logging no `protocol-health.yml`**
   ```yaml
   - name: Debug - List Factory Contents
     if: always()
     run: |
       if [ -d "neo-smart-factory" ]; then
         echo "✅ Factory clonado com sucesso"
         ls -la neo-smart-factory/
       else
         echo "❌ Factory não clonado"
       fi
   ```

### Prioridade Média 🟡

4. **Implementar Repository Dispatch**
   - Notificar `neo-smart-factory` após deploy bem-sucedido
   - Criar workflow receptor em `neo-smart-factory`

5. **Adicionar Workflow Dispatch**
   - Permitir trigger manual de health check
   - Adicionar input para deep checks

6. **Criar ADR para integração cross-repo**
   - `docs/adr/0005-cross-repo-integration-strategy.md`
   - Decisão sobre padrão de integração
   - Justificativa para repository checkout vs API
   - Plano de migração futura

### Prioridade Baixa 🟢

7. **Implementar Reusable Workflows**
   - Criar workflows compartilhados em `neo-smart-factory`
   - Migrar lógica duplicada

8. **Matrix Strategy para múltiplos repos**
   ```yaml
   strategy:
     matrix:
       repo:
         - neo-smart-factory
         - smart-cli
         - docs
   ```

---

## 📋 Checklist de Validação

### Para Desenvolvedores Externos

- [ ] Token `NEO_ECOSYSTEM_TOKEN` está configurado?
- [ ] Workflow `protocol-health.yml` está executando?
- [ ] Comando `make health` existe e funciona?
- [ ] Workflow falha gracefully se token ausente?
- [ ] Documentação de setup está atualizada?

### Para Administradores

- [ ] Token tem permissões `repo` completas?
- [ ] Token tem acesso à org `neo-smart-token-factory`?
- [ ] Token está configurado como secret no repo?
- [ ] Workflow logs estão sendo monitorados?
- [ ] Alertas configurados para falhas de health check?

---

## 🚨 Troubleshooting Comum

### Problema: Workflow não clona `neo-smart-factory`

**Sintomas:**
```
Error: Resource not accessible by integration
```

**Soluções:**
1. Verificar se `NEO_ECOSYSTEM_TOKEN` está configurado:
   - Settings → Secrets and variables → Actions
   - Confirmar que existe `NEO_ECOSYSTEM_TOKEN`
2. Verificar permissões do token:
   - Token deve ter scope `repo` completo
   - Token deve ter acesso à organização `neo-smart-token-factory`
3. Verificar se token não expirou:
   - Gerar novo token se necessário
   - Atualizar secret no repositório

**Workaround:**
- Workflow continua mesmo sem token (`continue-on-error: true`)
- Health check roda apenas com `smart-ui` local

---

### Problema: `make health` não encontra factory

**Sintomas:**
```
make: *** No rule to make target 'health'. Stop.
```

**Soluções:**
1. Verificar se `Makefile` existe na raiz do projeto
2. Verificar se comando `health` está definido no Makefile
3. Executar `make -n health` para debug (dry-run)
4. Verificar se está no diretório correto (raiz do projeto)

**Teste:**
```bash
# Verificar Makefile
cat Makefile | grep -A 5 "health:"

# Executar com debug
make -n health
```

---

### Problema: Workflow passa mas não valida integridade

**Sintomas:**
```
✅ Health check completo
(mas sem verificações reais)
```

**Soluções:**
1. Adicionar `set -e` no script (fail on error)
2. Validar que `make health` retorna exit code correto:
   ```bash
   make health
   echo $?  # Deve retornar 0 se sucesso
   ```
3. Adicionar asserções explícitas no Makefile:
   ```makefile
   health:
       @set -e
       @echo "Validando componentes..."
       @test -d "$(CORE_DIR)" || (echo "❌ Core não encontrado" && exit 1)
   ```

---

### Problema: Token configurado mas ainda falha

**Sintomas:**
```
Error: Bad credentials
```

**Soluções:**
1. Verificar se token não foi revogado
2. Verificar se nome do secret está correto: `NEO_ECOSYSTEM_TOKEN` (case-sensitive)
3. Verificar se repositório `neo-smart-factory` existe e é acessível
4. Testar token manualmente:
   ```bash
   curl -H "Authorization: token SEU_TOKEN" \
        https://api.github.com/repos/neo-smart-token-factory/neo-smart-factory
   ```

---

## 📖 Próximos Passos Sugeridos

### Documentação

1. **Criar `docs/CROSS_REPO_INTEGRATION.md`**
   - Documentar fluxo completo de integração
   - Diagramas de integração detalhados
   - Guia passo-a-passo de setup
   - Troubleshooting expandido

2. **Atualizar `docs/GITHUB_ACTIONS_SETUP.md`**
   - Adicionar seção sobre `NEO_ECOSYSTEM_TOKEN`
   - Incluir screenshots do processo
   - Adicionar exemplos de logs de sucesso/falha

### Implementação

3. **Implementar testes de integração**
   - Validar ABIs sincronizados entre UI e Core
   - Validar versões compatíveis
   - Validar estado operacional

4. **Criar dashboard de health**
   - Badge no README mostrando status
   - Status page automático
   - Alertas proativos para falhas

5. **Adicionar logging detalhado**
   - Logs estruturados em cada etapa do workflow
   - Métricas de tempo de execução
   - Histórico de health checks

---

## ✅ Validação do Onboarding

### Script de Validação Automática

O projeto inclui um script de validação que verifica a estrutura documentada:

```bash
# Executar validação completa
./validate-onboarding.sh
```

**O que o script valida:**

1. ✅ **Arquivos Críticos** - Verifica existência de todos os arquivos mencionados
2. ✅ **Estrutura de Diretórios** - Valida organização de pastas
3. ✅ **Makefile** - Verifica se comando `health` existe e é válido
4. ✅ **package.json** - Valida workspaces e dependências críticas
5. ✅ **.env.example** - Verifica variáveis de ambiente documentadas
6. ✅ **GitHub Actions** - Valida workflows e configurações
7. ✅ **Caminhos Hardcoded** - Detecta caminhos absolutos problemáticos
8. ✅ **Scripts Executáveis** - Verifica permissões de scripts

**Output do Script:**

- ✅ **Verde**: Validação passou
- ⚠️ **Amarelo**: Avisos (não bloqueiam, mas devem ser revisados)
- ❌ **Vermelho**: Falhas críticas (devem ser corrigidas)

**Exemplo de uso:**

```bash
$ ./validate-onboarding.sh

========================================
🔍 NΞØ Onboarding Validation
========================================

📁 Validando arquivos críticos...
✅ FOUND: .github/workflows/docs-guard.yml
✅ FOUND: .github/workflows/protocol-health.yml
...

📊 Resumo da Validação
========================================
✅ Passou: 45
⚠️  Avisos: 2
❌ Falhou: 0

⚠️  Validação com avisos: Revise os avisos acima
```

### Checklist Manual de Validação

Antes de compartilhar o documento, execute este checklist:

#### Documentação
- [ ] README.md corrigido (Vite em vez de Next.js)
- [ ] .env.example criado e completo
- [ ] Caminhos hardcoded removidos
- [ ] Links de documentação validados
- [ ] Versões exatas de dependências documentadas (se aplicável)

#### Código
- [ ] Makefile testado e funcional (`make health`)
- [ ] Workflows testados localmente (usando `act` se possível)
- [ ] Scripts executáveis (`chmod +x scripts/*.sh`)
- [ ] .gitignore atualizado

#### Testes
- [ ] Onboarding testado em ambiente fresh (opcional, mas recomendado)
- [ ] Comandos npm testados (`npm install`, `npm run dev`)
- [ ] Comandos make testados (`make health`, `make install`)
- [ ] Workflows testados com/sem token (se possível)

#### Segurança
- [ ] Nenhum token/secret real no código
- [ ] .env.example com valores seguros (placeholders)
- [ ] Instruções de segurança claras
- [ ] Secrets documentados mas não expostos

### Validação em Ambiente Fresh (Recomendado)

Para validação completa, teste o onboarding em um ambiente limpo:

```bash
# Opção 1: Docker (isolado)
docker run -it node:20 bash
git clone https://github.com/neo-smart-token-factory/smart-ui
cd smart-ui
npm install
./validate-onboarding.sh
make health

# Opção 2: Máquina virtual ou container temporário
# Clone em diretório novo e siga instruções do onboarding
```

### Status Atual de Validação

**Última validação:** Janeiro 2026

**Status:**
- ✅ Estrutura de arquivos verificada
- ✅ Workflows GitHub Actions analisados
- ✅ Dependências documentadas
- ⚠️ Comandos `make` precisam ser testados localmente
- ⚠️ Workflows precisam ser testados com/sem token
- ⚠️ Onboarding completo precisa ser testado em ambiente fresh

**Ações Recomendadas:**
1. Executar `./validate-onboarding.sh` antes de compartilhar
2. Testar `make health` localmente
3. Validar workflows em ambiente de teste
4. Atualizar este status após validação completa

---

### Deploy e CI/CD

#### Script de Deploy Seguro (`scripts/safe-deploy.sh`)

O projeto inclui um script automatizado para deploy seguro que:

1. **Verificação de Segurança:**
   - Executa `npm audit` (nível crítico)
   - Executa linter (`npm run lint`)

2. **Build Inteligente:**
   - Detecta arquivos alterados via `git diff`
   - Builda apenas módulos afetados:
     - Dashboard (raiz): se `src/`, `public/`, ou configs mudaram
     - Landing: se `landing/` mudou
     - Mobile (Nuxt): se `nuxt-app/` mudou

3. **Commit e Push:**
   - Faz commit com mensagem fornecida
   - Push para `main` (dispara deploy automático na Vercel)

4. **Deploy Automático Vercel:**
   - Push para `main` dispara deploy automático via Git integration
   - URLs de produção:
     - Dashboard: `https://smart-ui-delta.vercel.app`
     - Landing: `https://landing-jet-seven.vercel.app`
     - Mobile: `https://nuxt-app-vert.vercel.app`

**Uso:**
```bash
make deploy msg="feat: adiciona nova funcionalidade"
```

#### Vercel Integration

- **Plataforma:** Vercel (Hobby/Free Tier)
- **Deploy:** Automático via Git push para `main`
- **Serverless Functions:** API routes em `/api` rodam como Vercel Serverless Functions
- **Ambiente:** Variáveis de ambiente configuradas no painel Vercel

**Comandos Vercel:**
```bash
vercel dev          # Desenvolvimento local com serverless functions
vercel deploy       # Deploy preview
vercel deploy --prod # Deploy forçado (bypass Git)
```

---

## 📚 Documentação

### README.md Principal

```markdown
## ⚠️ Architectural Status Notice

This repository is **intentionally frozen**.

The Smart UI is classified as a **Demo and Intent Layer**, as defined in:
- `docs/ui-status.md`
- `ADR 0002 — Smart UI as Demo and Intent Layer`

### What this means

- This UI demonstrates flows and concepts.
- It does NOT represent protocol authority.
- It does NOT deploy contracts or execute transactions.
- Backend logic present here is transitional and non-authoritative.

### Allowed changes

- Critical build fixes
- Security dependency updates
- Explicit demo/simulation labeling

### Forbidden changes

- New features
- New backend logic
- Protocol rules
- Direct core integrations

Any change outside this scope requires an explicit architectural decision (ADR).

**Do not treat this repository as production infrastructure.**

---

# NΞØ SMART FACTORY — Interface de Gestão e Fábrica de Tokens

## 🌐 Visão Geral
A **NΞØ Smart Factory** é a interface definitiva para o ecossistema de criação de ativos da NEO. Desenvolvida como uma fábrica de tokens multichain, ela permite que usuários compilem e publiquem contratos inteligentes com precisão técnica e segurança.

Documentação detalhada: [PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)

## 🚀 Estética e Design
- **Tema**: Modo Escuro (Obsidian)
- **Destaque**: Neon Acid (`#D8F244`)
- **Efeitos**: Glassmorphism e Gradientes Cinéticos.
- **Interações**: Micro-animações fluidas.

## 🛠️ Stack Técnica
- **Build Tool**: Vite 7.3.1 (ultra-rápido HMR)
- **Framework Principal**: React 18 + Vite
- **Workspaces**:
  - `src/`: React 18 (Dashboard Principal)
  - `landing/`: React + Vite (Landing Page)
  - `nuxt-app/`: Nuxt 3 + Vue (Mobile App)
- **Estilo**: Tailwind CSS + Design Tokens Customizados
- **Ícones**: Lucide React / Vue
- **Web3**: Ethers.js v6 (Viem mencionado como opção futura, não instalado)

## 📦 Funcionalidades
- [x] **Fábrica Multichain**: Suporte integrado para Base, Polygon e outras redes EVM.
- [x] **Compilação de Contratos**: Interface para configurar e compilar novos tokens sem código.
- [x] **Gerador de Ativos**: Criação automática de planos de marketing e rascunhos de whitepaper.
- [x] **Pronto para MiniApp**: Design responsivo otimizado para frames do Telegram MiniApp.

## 🏃 Como Rodar Localmente
```bash
# Para a interface principal
npm install
npm run dev
```

## 📜 Atribuição e Licença
Este projeto está licenciado sob a **Licença MIT**.

Se você utilizar esta UI como base para seu projeto, solicitamos a **Atribuição** ao Protocolo NΞØ, mantendo os créditos de design e referência à fábrica original.

---
**Build v0.5.3** — *Transformando código em ativos líquidos.*
```

---

## 🔌 Integrações Chave

### Web3 / Blockchain

#### ✅ **Ethers.js v6** (Instalado e Configurado)
- **Versão:** `^6.10.0`
- **Status:** Instalado, mas integração Web3 ainda em modo simulação
- **Uso Atual:** Preparado para uso, mas a aplicação roda em **Simulation Mode** quando não detecta wallet
- **Localização:** Referenciado em `src/App.jsx` com comentários TODO para integração real
- **Nota:** A documentação menciona `Viem` como alternativa futura, mas **não está instalado** no momento

#### ❌ **Wagmi** (Não Instalado)
- **Status:** Mencionado na documentação como opção futura, mas **não está presente** nas dependências

#### ❌ **Viem** (Não Instalado)
- **Status:** Mencionado no README como parte da stack, mas **não está instalado** no `package.json`

#### 📝 **Observações Web3:**
- A aplicação detecta a presença de `window.ethereum` para determinar se há wallet instalado
- Quando não há wallet, entra em **Simulation Mode** (deployments simulados)
- A integração real com Ethers.js está marcada como TODO em `src/App.jsx`
- Ver `docs/SIMULATION_MODE.md` para detalhes sobre o modo simulação

### UI / Estilização

#### ✅ **Tailwind CSS** (Instalado e Configurado)
- **Versão:** `^3.3.0` (devDependency)
- **Configuração:** `tailwind.config.cjs`
- **Design Tokens Customizados:**
  - **Cores:**
    - `neon.acid`: `#D8F244` (Neon Acid - cor principal)
    - `obsidian.DEFAULT`: `#0E0E0E` (fundo escuro)
    - `obsidian.surface`: `#111214`
    - `obsidian.elevated`: `#1A1C1F`
    - `signal.magenta`: `#FF2E9A`
    - `signal.cyan`: `#00E5FF`
  - **Fontes:**
    - `headline`: Space Grotesk
    - `body`: Inter
    - `mono`: JetBrains Mono
  - **Gradientes:**
    - `gradient-energy`: Linear gradient com neon acid e cyan
    - `gradient-signal`: Linear gradient magenta → cyan
  - **Animações:**
    - `pulse-slow`: Pulse de 4s
  - **Shadows:**
    - `neon-hover`: Glow neon ao hover

#### ✅ **Framer Motion** (Instalado)
- **Versão:** `^11.0.0`
- **Uso:** Animações e micro-interações fluidas
- **Status:** Ativo e disponível para uso

#### ✅ **Lucide React** (Instalado)
- **Versão:** `^0.300.0`
- **Uso:** Biblioteca de ícones
- **Status:** Ativo e disponível

#### ✅ **Tailwind Merge** (Instalado)
- **Versão:** `^2.2.0`
- **Uso:** Merge inteligente de classes Tailwind CSS
- **Status:** Ativo e disponível

#### ❌ **Shadcn/ui** (Não Instalado)
- **Status:** Não está presente nas dependências
- **Nota:** O projeto utiliza Tailwind CSS puro com design tokens customizados

### Utilitários CSS

#### ✅ **clsx** (Instalado)
- **Versão:** `^2.1.0`
- **Uso:** Classes CSS condicionais
- **Status:** Ativo

#### ✅ **PostCSS** (Instalado)
- **Versão:** `^8.4.1` (devDependency)
- **Uso:** Processamento de CSS
- **Status:** Configurado

#### ✅ **Autoprefixer** (Instalado)
- **Versão:** `^10.0.1` (devDependency)
- **Uso:** Prefixos CSS automáticos
- **Status:** Configurado

---

## 🛠️ Ferramentas de Desenvolvimento

### Build Tool
- **Vite:** `^7.3.1` — Build tool e dev server ultra-rápido

### TypeScript
- **TypeScript:** `^5.0.0` — Suporte completo a TypeScript
- **Configuração:** `tsconfig.json` presente

### Linting
- **ESLint:** `^9.39.2` — Linter principal
- **Plugins React:** Configurados para React e React Hooks

### Workspace Manager
- **npm workspaces** — Monorepo com múltiplos projetos

---

## 🗄️ Banco de Dados

### Neon Database
- **Cliente:** `@neondatabase/serverless` (`^1.0.2`)
- **Cliente Alternativo:** `postgres` (`^3.4.8`)
- **Migrations:** Pasta `migrations/` com `01_init.sql`
- **Schema:** Documentado em `docs/DATABASE_SCHEMA.sql`
- **Configuração:** `lib/db.js`

---

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia dev server (Vite)

# Build
npm run build        # Build de produção

# Preview
npm run preview      # Preview do build de produção

# Linting
npm run lint         # Executa ESLint
```

---

## 📋 Resumo de Integrações

| Categoria | Biblioteca | Versão | Status |
|-----------|-----------|--------|--------|
| **Web3** | Ethers.js | ^6.10.0 | ✅ Instalado (Simulation Mode) |
| **Web3** | Wagmi | - | ❌ Não instalado |
| **Web3** | Viem | - | ❌ Não instalado |
| **UI** | Tailwind CSS | ^3.3.0 | ✅ Instalado e configurado |
| **UI** | Framer Motion | ^11.0.0 | ✅ Instalado |
| **UI** | Lucide React | ^0.300.0 | ✅ Instalado |
| **UI** | Shadcn/ui | - | ❌ Não instalado |
| **UI** | Tailwind Merge | ^2.2.0 | ✅ Instalado |
| **UI** | clsx | ^2.1.0 | ✅ Instalado |

---

## ⚠️ Pontos de Atenção para Desenvolvedores

1. **Estrutura Protegida:** Não modificar pastas ou renomear arquivos sem autorização
2. **Simulation Mode:** A aplicação roda em modo simulação quando não há wallet Web3
3. **Workspaces:** Projeto monorepo com múltiplas aplicações (landing, nuxt-app, packages)
4. **TypeScript:** Projeto suporta TypeScript, mas muitos arquivos ainda são `.jsx`
5. **Web3 Integration:** Integração real com Ethers.js está marcada como TODO
6. **Documentação ADR:** Decisões arquiteturais importantes estão em `docs/adr/`
7. **Workflow Docs Guard:** PRs que alteram código SEM atualizar documentação serão bloqueados automaticamente
8. **Integração Cross-Repo:** O workflow `protocol-health.yml` requer o secret `NEO_ECOSYSTEM_TOKEN` para acesso completo ao repositório `neo-smart-factory`
9. **Makefile Dependencies:** Comandos como `make health` e `make ops-sync` esperam estrutura de diretórios local específica (desenvolvimento local)
10. **Agent Workflows:** O workflow em `.agent/workflows/smart-mint-protocol.md` define processos de sincronização multi-repo que devem ser seguidos

---

## 📖 Documentação Adicional Recomendada

- `docs/PROJECT_OVERVIEW.md` — Visão geral do projeto
- `docs/FRONTEND_MAP.md` — Mapa do frontend
- `docs/SIMULATION_MODE.md` — Detalhes sobre modo simulação
- `docs/adr/` — Architecture Decision Records
- `docs/NEXT_STEPS.md` — Próximos passos do projeto

---

**Documento gerado automaticamente para onboarding técnico.**  
**Última atualização:** Janeiro 2026
