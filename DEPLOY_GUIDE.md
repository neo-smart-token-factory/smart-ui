# 🚀 Guia de Deploy - NΞØ Smart Factory UI

**Status:** ✅ Código validado e pronto para deploy  
**Última validação:** Janeiro 2026

---

## 🎯 Deploy do Dashboard (este repositório)

**Este repo contém apenas o Dashboard.** Landing e Mobile estão em repositórios separados.

- **📖 Guia completo:** [docs/DEPLOY_DASHBOARD.md](./docs/DEPLOY_DASHBOARD.md) — Neon, Vercel, migrations, simulation mode.
- **Resumo:** Neon (DB) → `make migratedb` → Vercel (1 projeto, Root = `.`) → configurar `DATABASE_URL` + `VITE_*`.

---

## ✅ Validação Pré-Deploy

### Status Atual do Código

- ✅ **npm install**: Sucesso (0 vulnerabilidades)
- ✅ **npm run lint**: Sem erros
- ✅ **npm run build**: Build bem-sucedido
- ⚠️ **Warning**: Chunk size > 500KB (normal, pode otimizar depois)

### Resultado do Build

```
dist/index.html                   0.74 kB
dist/assets/index-f42zm4N9.css   25.48 kB
dist/assets/index-DT_V6AYQ.js   548.53 kB
```

**Build completo em 1.44s** ✅

---

## 📋 Checklist de Deploy

### Fase 1: Preparação Local ✅

- [x] Código compila (`make build`)
- [x] Lint passa (`make lint`)
- [x] Dependências instaladas (`make install`)
- [ ] Teste local (`make dev`) - **Teste agora**

**Comandos Makefile disponíveis:**
```bash
make dev              # Dashboard (porta 3000)
make dev-landing      # Landing Page (porta 3001)
make dev-mobile      # Mobile App (porta 3002)
make dev-all         # Todos simultaneamente
```

### Fase 2: Configuração de Infraestrutura

#### 2.1 Neon Database

- [ ] Criar conta em [Neon.tech](https://neon.tech)
- [ ] Criar novo projeto
- [ ] Copiar `DATABASE_URL`
- [ ] Executar migrations (ver seção abaixo)

#### 2.2 Vercel

- [ ] Criar conta em [Vercel](https://vercel.com) (se não tiver)
- [ ] Instalar Vercel CLI: `npm i -g vercel`
- [ ] Fazer login: `vercel login`

### Fase 3: Deploy Dashboard Principal

#### 3.1 Conectar Repositório

**⚠️ IMPORTANTE:** Este é um monorepo. Você precisa criar **3 projetos separados** no Vercel.

**Opção A: Via Dashboard (Recomendado para primeira vez)**

1. Acesse [vercel.com](https://vercel.com)
2. **Add New** → **Project**
3. Importe `neo-smart-token-factory/smart-ui`
4. Configure **Root Directory** conforme o projeto:
   - **Dashboard:** `.` (raiz)
   - **Landing:** `landing`
   - **Mobile:** `nuxt-app`

**Opção B: Via CLI**

```bash
# No diretório do projeto
cd /Users/nettomello/CODIGOS/NEO\ SMART\ TOKEN/smart-ui

# Conectar ao Vercel (Dashboard - raiz)
vercel link
```

**Perguntas do Vercel (Dashboard):**
- **Set up and deploy?** → `Y`
- **Which scope?** → Seu usuário/org
- **Link to existing project?** → `N` (primeira vez)
- **Project name?** → `smart-ui-dashboard`
- **Directory?** → `.` (raiz - deixe vazio ou coloque ".")
- **Override settings?** → `N`

**Para Landing e Mobile, repita o processo em seus diretórios:**
```bash
cd landing && vercel link  # Projeto: smart-ui-landing
cd ../nuxt-app && vercel link  # Projeto: smart-ui-mobile
```

**📖 Veja [VERCEL_SETUP.md](./VERCEL_SETUP.md) para guia completo.**

#### 3.2 Configurar Variáveis de Ambiente

```bash
# Database (OBRIGATÓRIO)
vercel env add DATABASE_URL production
# Cole a DATABASE_URL do Neon.tech

# Chain ID (Base Mainnet)
vercel env add VITE_CHAIN_ID production
# Valor: 8453

# RPC URL
vercel env add VITE_RPC_URL production
# Valor: https://mainnet.base.org

# App Version
vercel env add NEXT_PUBLIC_APP_VERSION production
# Valor: 0.5.3

# Feature Flags
vercel env add VITE_ENABLE_WEB3 production
# Valor: false (simulation mode)

vercel env add VITE_DEBUG_MODE production
# Valor: false (produção)
```

**Variáveis Opcionais (configurar depois se necessário):**

```bash
# Alchemy (se tiver)
vercel env add NEXT_PUBLIC_ALCHEMY_ID production

# dRPC (se tiver)
vercel env add NEXT_PUBLIC_DRPC_API_KEY production

# Dynamic.xyz (se tiver)
vercel env add NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID production

# Modal.com (se tiver)
vercel env add MODAL_TOKEN_ID production
vercel env add MODAL_TOKEN_SECRET production
```

#### 3.3 Executar Migrations no Neon

```bash
# Opção 1: Via Neon Console (Recomendado)
# 1. Acesse https://console.neon.tech
# 2. Abra o SQL Editor
# 3. Cole o conteúdo de migrations/01_init.sql
# 4. Execute

# Opção 2: Via Script (se tiver DATABASE_URL configurada)
# node scripts/migrate.js
```

**Conteúdo de `migrations/01_init.sql`:**

```sql
-- Tabela de Deploys (Histórico de Tokens Criados)
CREATE TABLE IF NOT EXISTS deploys (
    id SERIAL PRIMARY KEY,
    contract_address TEXT NOT NULL,
    owner_address TEXT NOT NULL,
    network TEXT NOT NULL,
    tx_hash TEXT,
    token_name TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    token_config JSONB NOT NULL,
    deployed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para rascunhos de tokens (Persistência Cross-device)
CREATE TABLE IF NOT EXISTS drafts (
    id SERIAL PRIMARY KEY,
    user_address TEXT NOT NULL,
    token_config JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_deploys_owner ON deploys(owner_address);
CREATE INDEX IF NOT EXISTS idx_deploys_date ON deploys(deployed_at DESC);
```

#### 3.4 Deploy

```bash
# Opção 1: Via Makefile (recomendado)
make deploy msg="feat: initial deploy"

# Opção 2: Deploy direto
vercel --prod

# Opção 3: Via Git (recomendado para CI/CD)
git push origin main  # Dispara deploy automático
```

### Fase 4: Deploy Landing Page

```bash
cd landing

# Conectar ao Vercel
vercel link
# Escolher projeto existente ou criar novo: landing

# Deploy
vercel --prod
```

**Ou via Makefile:**
```bash
make build-landing
cd landing && vercel --prod
```

### Fase 5: Deploy Mobile App

```bash
cd nuxt-app

# Conectar ao Vercel
vercel link
# Escolher projeto existente ou criar novo: nuxt-app

# Deploy
vercel --prod
```

**Ou via Makefile:**
```bash
make build-mobile
cd nuxt-app && vercel --prod
```

**Nota:** Mobile App usa porta 3002 (corrigido conflito com Landing)

---

## 🧪 Testes Pós-Deploy

### Dashboard Principal

- [ ] URL acessível: `https://[seu-projeto].vercel.app`
- [ ] UI carrega sem erros no console
- [ ] Simulation mode ativo (sem wallet)
- [ ] Formulário de criação de token funciona
- [ ] Deploy simulado funciona
- [ ] Histórico de deploys carrega (se houver dados)

### API Routes

- [ ] `/api/deploys` retorna JSON (GET)
- [ ] `/api/drafts` retorna JSON (GET)
- [ ] `/api/ops-status` retorna status

### Database

- [ ] Conexão com Neon funciona
- [ ] Tabelas `deploys` e `drafts` existem
- [ ] Migrations executadas com sucesso

---

## 🔧 Troubleshooting

### Erro: "Cannot find module"

```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Erro: "Database connection failed"

1. Verificar `DATABASE_URL` no Vercel
2. Verificar se database está ativo no Neon
3. Verificar se migrations foram executadas
4. Testar conexão manualmente:

```bash
# Instalar cliente postgres
npm install -g postgres

# Testar conexão
psql $DATABASE_URL -c "SELECT 1;"
```

### Erro: "Build failed"

1. Verificar logs no Vercel Dashboard
2. Testar build local: `npm run build`
3. Verificar variáveis de ambiente
4. Verificar se todos os arquivos estão commitados

### Erro: "API routes not working"

1. Verificar se arquivos em `/api` estão na raiz
2. Verificar se Vercel detectou como Serverless Functions
3. Verificar logs em Vercel Dashboard → Functions

---

## 📊 URLs de Produção Esperadas

Após deploy, você terá URLs como:

- **Dashboard**: `https://smart-ui-[hash].vercel.app`
- **Landing**: `https://landing-[hash].vercel.app`
- **Mobile**: `https://nuxt-app-[hash].vercel.app`

**Nota:** URLs mencionadas no documento (`smart-ui-delta.vercel.app`) são exemplos. Suas URLs serão diferentes.

---

## 🎯 Deploy Mínimo Viável (MVA)

Se quiser apenas o essencial funcionando:

### 1. Dashboard Principal (30-45 min)

```bash
# 1. Configurar Neon (10min)
# - Criar database
# - Copiar DATABASE_URL
# - Executar migrations

# 2. Deploy Vercel (15min)
vercel link
vercel env add DATABASE_URL production
vercel env add VITE_CHAIN_ID production
vercel env add VITE_RPC_URL production
vercel --prod

# 3. Testar (10min)
# - Acessar URL
# - Verificar UI
# - Testar simulation mode
```

**Resultado:** Dashboard funcional no ar ✅

### 2. Landing Page (20 min) - Opcional

```bash
cd landing
vercel link
vercel --prod
```

### 3. Mobile App (30 min) - Opcional

```bash
cd nuxt-app
vercel link
vercel --prod
```

---

## 📝 Variáveis de Ambiente Mínimas

Para o sistema funcionar, você precisa APENAS de:

1. ✅ `DATABASE_URL` - Neon database
2. ✅ `VITE_CHAIN_ID` - 8453 (Base Mainnet)
3. ✅ `VITE_RPC_URL` - https://mainnet.base.org
4. ✅ `NEXT_PUBLIC_APP_VERSION` - 0.5.3
5. ✅ `VITE_ENABLE_WEB3` - false (simulation mode)

**Todas as outras são opcionais** e podem ser configuradas depois.

---

## 🚨 Checklist Final Antes de Deploy

- [ ] Código compila localmente (`npm run build`)
- [ ] Lint passa (`npm run lint`)
- [ ] Database criada no Neon
- [ ] Migrations executadas
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Vercel CLI instalado e logado
- [ ] Repositório conectado ao Vercel

---

## 🎬 Próximos Passos Imediatos

1. **Teste local primeiro:**
   ```bash
   npm run dev
   # Acesse http://localhost:3000
   # Verifique se UI carrega
   ```

2. **Configure Neon:**
   - Crie conta e database
   - Execute migrations

3. **Deploy no Vercel:**
   - Siga seção "Fase 3" acima

4. **Teste em produção:**
   - Acesse URL do Vercel
   - Valide funcionalidades

---

## 💡 Dicas

- **Primeira vez?** Comece apenas com Dashboard
- **Teste local primeiro** antes de deploy
- **Use simulation mode** inicialmente (VITE_ENABLE_WEB3=false)
- **Monitore logs** no Vercel Dashboard
- **Valide database** antes de deploy

---

**Última atualização:** Janeiro 2026  
**Status:** Pronto para deploy ✅
