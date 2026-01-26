# 🚀 Deploy do Dashboard (smart-ui)

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Guia  
**Audiência:** DevOps

Guia para colocar o **Dashboard** no ar com Neon (DB), Vercel e API routes + simulation mode.

---

## 📋 Visão Geral

| Item | Descrição |
|------|------------|
| **Repo** | `neo-smart-token-factory/smart-ui` |
| **Stack** | React 18 + Vite + API routes (Vercel Serverless) |
| **DB** | Neon (Serverless Postgres) |
| **Deploy** | Vercel (1 projeto, Root = `.`) |

**Simulation mode:** `VITE_ENABLE_WEB3=false` — UI funciona sem wallet/contratos reais. API routes (deploys, drafts) dependem do DB.

---

## ✅ Checklist Rápido

### 1. Neon (Database)

- [ ] Conta em [Neon.tech](https://console.neon.tech)
- [ ] Novo projeto → copiar **Connection string**
- [ ] `DATABASE_URL` salva (ex.: `.env` local)

### 2. Migrations

- [ ] `.env` existe com `DATABASE_URL`
- [ ] `make migratedb` executado com sucesso
- [ ] Tabelas `deploys` e `drafts` criadas

### 3. Vercel

- [ ] Projeto conectado a `smart-ui` (Root Directory = `.`)
- [ ] Variáveis de ambiente configuradas (veja abaixo)
- [ ] Deploy em produção OK

### 4. Pós-deploy

- [ ] URL do Dashboard abre sem erro
- [ ] Simulation mode ativo (Deploy funciona sem wallet)
- [ ] `/api/deploys` e `/api/drafts` respondem (com DB configurado)

---

## 1️⃣ Neon — Database

### 1.1 Criar projeto

1. Acesse [console.neon.tech](https://console.neon.tech) e faça login.
2. **New Project** → nome (ex.: `smart-ui-dashboard`).
3. Região: escolha a mais próxima (ex.: `us-east-2`).
4. **Create project**.

### 1.2 Obter `DATABASE_URL`

1. No projeto, abra **Connection details**.
2. **Connection string** → **URI**.
3. Copie a URL no formato:
   ```text
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. Use como `DATABASE_URL` no `.env` e no Vercel.

### 1.3 Executar migrations

**Local (com `.env`):**

```bash
# Garantir que .env existe
cp .env.example .env
# Editar .env e colar DATABASE_URL

# Rodar migrações
make migratedb
```

**Ou direto com variável:**

```bash
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require" npm run migrate
```

**Sucesso esperado:**

```text
✅ Tabelas "deploys" e "drafts" criadas ou já existem.
📊 Status: 0 deploy(s) registrado(s).
```

---

## 2️⃣ Variáveis de Ambiente

### Obrigatórias para produção

| Variável | Onde usar | Descrição |
|----------|-----------|-----------|
| `DATABASE_URL` | Vercel (Serverless) | Connection string do Neon |

### Recomendadas (frontend + simulação)

| Variável | Valor sugerido | Descrição |
|----------|----------------|-----------|
| `VITE_CHAIN_ID` | `8453` | Base Mainnet |
| `VITE_RPC_URL` | `https://mainnet.base.org` | RPC Base |
| `VITE_ENABLE_WEB3` | `false` | Simulation mode (sem wallet real) |

### Opcionais

| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_APP_VERSION` | Ex.: `0.5.3` |
| `NEXT_PUBLIC_APP_CODENAME` | Ex.: `MULTICHAIN FOUNDATION` |
| `MODAL_API_URL`, `MODAL_TOKEN_*` | AI/Modal (se usar) |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry (se usar) |

Ref.: `.env.example` no repositório.

---

## 3️⃣ Vercel — Deploy do Dashboard

### 3.1 Conectar repositório

1. [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Importar `neo-smart-token-factory/smart-ui`.
3. **Root Directory:** `.` (raiz) — não preencher subpasta.
4. **Framework Preset:** Vite (detecção automática).
5. **Build Command / Output Directory / Install Command:** deixar em branco (padrão).

### 3.2 Variáveis de ambiente

**Settings** → **Environment Variables**:

1. **`DATABASE_URL`**
   - Value: connection string do Neon.
   - Environments: **Production**, **Preview** (e **Development** se usar Vercel Dev).

2. **`VITE_ENABLE_WEB3`**
   - Value: `false`
   - Environments: Production, Preview (e Development se quiser).

3. **`VITE_CHAIN_ID`**
   - Value: `8453`
   - Environments: Production, Preview.

4. **`VITE_RPC_URL`**
   - Value: `https://mainnet.base.org`
   - Environments: Production, Preview.

Salvar e fazer **Redeploy** se o projeto já existia.

### 3.3 Deploy

- **Deploy automático:** push na `main` dispara build.
- **Deploy manual:** **Deployments** → **Redeploy** (ou `vercel --prod` na raiz do repo).

### 3.4 URLs esperadas

- Produção: `https://<seu-projeto>.vercel.app`
- Preview: `https://<seu-projeto>-<branch>-<sua-org>.vercel.app`

---

## 4️⃣ API Routes e Simulation Mode

### API Routes (Vercel Serverless)

| Rota | Método | Uso |
|------|--------|-----|
| `/api/deploys` | GET | Listar últimos deploys |
| `/api/deploys` | POST | Registrar novo deploy |
| `/api/drafts` | GET | Buscar draft por `?address=...` |
| `/api/drafts` | POST | Salvar draft |
| `/api/ops-status` | GET | Status operacional (versão, etc.) |

Funcionam **apenas** em runtime Vercel (`vercel dev` local ou deploy). Com `vite dev` puro, não há `/api/*`.

### Simulation mode

- `VITE_ENABLE_WEB3=false`: Deploy usa fluxo simulado (sem wallet/blockchain real).
- UI funciona normalmente; deploys e drafts são persistidos via API + Neon quando `DATABASE_URL` está configurado.

### Garantir API + DB em produção

1. `DATABASE_URL` configurada no Vercel.
2. Migrations rodadas no Neon (`make migratedb` ou `npm run migrate`).
3. Redeploy após alterar env vars.

---

## 5️⃣ Validação Pós-Deploy

### No browser

1. Abrir a URL do Dashboard.
2. Verificar que a interface carrega sem erro.
3. **Deploy (simulation):** preencher formulário e clicar em deploy → deve completar o fluxo simulado.
4. **Deploy history:** deve carregar (vazio ou com itens) sem erro no console.
5. **Drafts:** salvar e recarregar → draft deve persistir (com DB + API OK).

### APIs (opcional)

```bash
# Trocar pela URL real do deploy
BASE=https://seu-dashboard.vercel.app

# ops-status (não depende de DB)
curl -s "$BASE/api/ops-status" | jq .

# deploys (depende de DB)
curl -s "$BASE/api/deploys" | jq .
```

---

## 6️⃣ Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `make install` | Instalar dependências |
| `make build` | Build do Dashboard |
| `make dev` | Dev só frontend (sem API) |
| `make dev-vercel` | Dev com API (Vercel Dev) |
| `make migratedb` | Rodar migrations (exige `.env` com `DATABASE_URL`) |
| `make lint` | Linter |
| `make deploy` | Safe commit + push (dispara deploy na Vercel) |

---

## 7️⃣ Troubleshooting

### "Database connection not authenticated"

- `DATABASE_URL` ausente ou inválida no Vercel.
- Conferir em **Settings** → **Environment Variables** e fazer **Redeploy**.

### "API routes return 404"

- Local: usar `make dev-vercel` (não `make dev`).
- Produção: garantir que o deploy é do projeto Vercel ligado a `smart-ui` (raiz).

### Migrations falham

- `DATABASE_URL` correta no `.env` (local) ou no comando.
- Neon: projeto ativo e connection string com `?sslmode=require`.
- Rodar: `make migratedb` ou `DATABASE_URL="..." npm run migrate`.

### Build falha na Vercel

- **Root Directory** = `.`.
- **Build Command** em branco (usa `npm run build`).
- Logs em **Deployments** → último deploy → **Building**.

---

## 8️⃣ Resumo de Arquivos Relevantes

| Arquivo | Função |
|---------|--------|
| `.env.example` | Modelo de variáveis |
| `lib/db.js` | Cliente Neon (Serverless) |
| `api/*.js` | Vercel Serverless Functions |
| `migrations/01_init.sql` | Schema inicial |
| `scripts/migrate.js` | Script de migrations |
| `Makefile` | `migratedb`, `dev`, `build`, etc. |

---

**Última atualização:** Janeiro 2026  
**Status:** Focado apenas no Dashboard (smart-ui) pós-migração para multi-repos.
