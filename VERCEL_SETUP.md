# 🚀 Guia Completo de Configuração Vercel - Monorepo NΞØ

## 📋 Visão Geral

O projeto `smart-ui` é um **monorepo** com 3 frontends separados:

- **Dashboard** (raiz `/`) - React + Vite
- **Landing** (`/landing`) - React + Vite  
- **Mobile** (`/nuxt-app`) - Vue + Vite

No Vercel, você precisa criar **3 projetos separados**, cada um apontando para o diretório correto.

---

## 🎯 Estratégia: 3 Projetos no Vercel

### Opção Recomendada: Projetos Separados ⭐

Crie **3 projetos diferentes** no Vercel, cada um configurado para um diretório específico:

1. **smart-ui-dashboard** → Raiz (`/`)
2. **smart-ui-landing** → `/landing`
3. **smart-ui-mobile** → `/nuxt-app`

**Vantagens:**

- ✅ Deploys independentes
- ✅ URLs separadas
- ✅ Variáveis de ambiente isoladas
- ✅ Builds mais rápidos
- ✅ Melhor organização

---

## 🔧 Comandos de Build - Explicação

### Como Funciona

Todos os `package.json` têm o script:
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

**Então:**

- `npm run build` → executa `vite build` internamente
- Ambos funcionam, mas `npm run build` é o padrão recomendado

**No Vercel:**

- Você pode usar: `npm run build` (recomendado)
- Ou diretamente: `vite build` (também funciona)
- O Vercel detecta Vite automaticamente e sugere `npm run build`

**Por que `npm run build`?**

- Usa os scripts definidos no `package.json`
- Mais flexível (pode adicionar pré/post hooks)
- Padrão da comunidade Node.js/npm

---

## 📝 Passo a Passo: Configuração Completa

### Fase 1: Conectar Repositório (Primeira Vez)

#### 1.1 Acessar Vercel Dashboard

1. Acesse [vercel.com](https://vercel.com)
2. Faça login
3. Clique em **"Add New..."** → **"Project"**

#### 1.2 Importar Repositório

1. Selecione o repositório: `neo-smart-token-factory/smart-ui`
2. Clique em **"Import"**

---

### Fase 2: Configurar Dashboard (Projeto 1)

#### 2.1 Criar Projeto Dashboard

**Nome do Projeto:** `smart-ui-dashboard` (ou o nome que preferir)

**Configurações:**

```
Framework Preset: Vite (detecta automaticamente)
Root Directory: . (raiz - deixe vazio ou coloque ".")
Build Command: npm run build (executa "vite build" do package.json)
Output Directory: dist
Install Command: npm install
```

**Nota:** O Vercel detecta automaticamente Vite e usa `npm run build`, que executa `vite build` conforme definido no `package.json`.

#### 2.2 Configurar Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

**Produção:**
```
DATABASE_URL=postgresql://...
VITE_CHAIN_ID=8453
VITE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_APP_VERSION=0.5.3
VITE_ENABLE_WEB3=false
VITE_DEBUG_MODE=false
```

**Preview e Development:**

- Mesmas variáveis (ou valores de teste)

#### 2.3 Configurar Root Directory (IMPORTANTE)

**No Vercel Dashboard:**

1. Vá em **Settings** → **General**
2. Em **Root Directory**, deixe **vazio** ou coloque `.`
3. Isso garante que o build roda na raiz

#### 2.4 Deploy

Clique em **"Deploy"**

**URL resultante:** `https://smart-ui-dashboard.vercel.app`

---

### Fase 3: Configurar Landing (Projeto 2)

#### 3.1 Criar Novo Projeto

1. No Vercel Dashboard, clique em **"Add New..."** → **"Project"**
2. Selecione o **mesmo repositório**: `neo-smart-token-factory/smart-ui`
3. Clique em **"Import"**

#### 3.2 Configurar Projeto Landing

**Nome do Projeto:** `smart-ui-landing`

**Configurações:**

```
Framework Preset: Vite (detecta automaticamente)
Root Directory: landing  ⚠️ IMPORTANTE: Coloque "landing"
Build Command: npm run build (executa "vite build" do package.json)
Output Directory: dist
Install Command: npm install
```

**Nota:** O comando `npm run build` executa `vite build` conforme definido no `landing/package.json`.

#### 3.3 Root Directory (CRÍTICO)

**No Vercel Dashboard:**

1. Vá em **Settings** → **General**
2. Em **Root Directory**, coloque: `landing`
3. Isso diz ao Vercel para rodar tudo dentro da pasta `landing/`

#### 3.4 Variáveis de Ambiente

**Landing não precisa de variáveis** (é apenas frontend estático)

#### 3.5 Deploy

Clique em **"Deploy"**

**URL resultante:** `https://smart-ui-landing.vercel.app`

---

### Fase 4: Configurar Mobile (Projeto 3)

#### 4.1 Criar Novo Projeto

1. No Vercel Dashboard, clique em **"Add New..."** → **"Project"**
2. Selecione o **mesmo repositório**: `neo-smart-token-factory/smart-ui`
3. Clique em **"Import"**

#### 4.2 Configurar Projeto Mobile

**Nome do Projeto:** `smart-ui-mobile`

**Configurações:**

```
Framework Preset: Vite (detecta automaticamente)
Root Directory: nuxt-app  ⚠️ IMPORTANTE: Coloque "nuxt-app"
Build Command: npm run build (executa "vite build" do package.json)
Output Directory: dist
Install Command: npm install
```

**Nota:** O comando `npm run build` executa `vite build` conforme definido no `nuxt-app/package.json`.

#### 4.3 Root Directory (CRÍTICO)

**No Vercel Dashboard:**
1. Vá em **Settings** → **General**
2. Em **Root Directory**, coloque: `nuxt-app`
3. Isso diz ao Vercel para rodar tudo dentro da pasta `nuxt-app/`

#### 4.4 Variáveis de Ambiente

**Mobile pode precisar de variáveis** (dependendo das features)

#### 4.5 Deploy

Clique em **"Deploy"**

**URL resultante:** `https://smart-ui-mobile.vercel.app`

---

## 🔧 Configuração via Vercel CLI (Alternativa)

Se preferir configurar via CLI:

### Dashboard

```bash
cd /Users/nettomello/CODIGOS/NEO\ SMART\ TOKEN/smart-ui

# Conectar ao Vercel
vercel link

# Quando perguntar:
# - Set up and deploy? Y
# - Which scope? [seu usuário/org]
# - Link to existing project? N
# - Project name? smart-ui-dashboard
# - Directory? . (ou deixe vazio)
# - Override settings? N

# Configurar variáveis
vercel env add DATABASE_URL production
vercel env add VITE_CHAIN_ID production
# ... outras variáveis

# Deploy
vercel --prod
```

### Landing

```bash
cd landing

# Conectar ao Vercel
vercel link

# Quando perguntar:
# - Link to existing project? N
# - Project name? smart-ui-landing
# - Directory? . (vai usar landing/ como root automaticamente)
# - Override settings? N

# Deploy
vercel --prod
```

### Mobile

```bash
cd nuxt-app

# Conectar ao Vercel
vercel link

# Quando perguntar:
# - Link to existing project? N
# - Project name? smart-ui-mobile
# - Directory? . (vai usar nuxt-app/ como root automaticamente)
# - Override settings? N

# Deploy
vercel --prod
```

---

## 📊 Estrutura Final no Vercel

Após configuração, você terá:

```
Vercel Dashboard
├── smart-ui-dashboard
│   ├── Repository: neo-smart-token-factory/smart-ui
│   ├── Root Directory: . (raiz)
│   ├── URL: https://smart-ui-dashboard.vercel.app
│   └── Variáveis: DATABASE_URL, VITE_CHAIN_ID, etc.
│
├── smart-ui-landing
│   ├── Repository: neo-smart-token-factory/smart-ui
│   ├── Root Directory: landing
│   ├── URL: https://smart-ui-landing.vercel.app
│   └── Variáveis: (nenhuma necessária)
│
└── smart-ui-mobile
    ├── Repository: neo-smart-token-factory/smart-ui
    ├── Root Directory: nuxt-app
    ├── URL: https://smart-ui-mobile.vercel.app
    └── Variáveis: (opcionais)
```

---

## ⚠️ Pontos Críticos

### 1. Root Directory é OBRIGATÓRIO

**Dashboard:**
- Root Directory: `.` ou vazio (raiz do repo)

**Landing:**
- Root Directory: `landing` (deve ser exatamente isso)

**Mobile:**
- Root Directory: `nuxt-app` (deve ser exatamente isso)

### 2. API Routes Apenas no Dashboard

As rotas `/api/*` estão na raiz do projeto, então:
- ✅ Funcionam no projeto **Dashboard**
- ❌ Não funcionam em Landing ou Mobile

### 3. Workspaces do npm

O Vercel detecta automaticamente workspaces, mas certifique-se de que:
- `package.json` na raiz tem `"workspaces": ["landing", "nuxt-app", "packages/*"]`
- Cada subprojeto tem seu próprio `package.json`

### 4. Variáveis de Ambiente

**Dashboard:**
- `DATABASE_URL` (obrigatório)
- `VITE_CHAIN_ID` (obrigatório)
- Outras variáveis conforme necessário

**Landing e Mobile:**
- Geralmente não precisam de variáveis
- Adicione apenas se necessário

---

## 🔍 Verificação Pós-Deploy

### Dashboard

```bash
# Verificar se API routes funcionam
curl https://smart-ui-dashboard.vercel.app/api/deploys

# Deve retornar JSON (array vazio ou com dados)
```

### Landing

```bash
# Verificar se página carrega
curl -I https://smart-ui-landing.vercel.app

# Deve retornar 200 OK
```

### Mobile

```bash
# Verificar se app carrega
curl -I https://smart-ui-mobile.vercel.app

# Deve retornar 200 OK
```

---

## 🐛 Troubleshooting

### Problema: "Build failed - Cannot find module"

**Causa:** Root Directory não configurado corretamente

**Solução:**
1. Vercel Dashboard → Settings → General
2. Verificar Root Directory
3. Dashboard: `.` ou vazio
4. Landing: `landing`
5. Mobile: `nuxt-app`

### Problema: "API routes return 404"

**Causa:** API routes só funcionam no projeto Dashboard

**Solução:**
- API routes estão em `/api` (raiz)
- Só funcionam no projeto com Root Directory = `.`
- Landing e Mobile não têm acesso às APIs

### Problema: "Environment variables not found"

**Causa:** Variáveis não configuradas no projeto correto

**Solução:**
1. Vercel Dashboard → Settings → Environment Variables
2. Verificar se variáveis estão no projeto **Dashboard**
3. Verificar se estão marcadas para **Production**

### Problema: "Build command failed"

**Causa:** Build command incorreto para o diretório

**Solução:**
- Dashboard: `npm run build` → executa `vite build` (raiz)
- Landing: `npm run build` → executa `vite build` (dentro de `landing/`)
- Mobile: `npm run build` → executa `vite build` (dentro de `nuxt-app/`)

**Como funciona:**
1. Vercel executa `npm run build` **dentro do Root Directory**
2. `npm run build` lê o `package.json` local
3. Executa o script `"build": "vite build"` definido no package.json
4. Vite builda o projeto no diretório correto

**Alternativa:** Você pode usar `vite build` diretamente, mas `npm run build` é recomendado porque usa os scripts do package.json.

---

## 📋 Checklist de Configuração

### Dashboard
- [ ] Projeto criado: `smart-ui-dashboard`
- [ ] Root Directory: `.` (raiz)
- [ ] Framework: Vite
- [ ] Build Command: `npm run build` (executa `vite build`)
- [ ] Output Directory: `dist`
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] API routes funcionando

### Landing
- [ ] Projeto criado: `smart-ui-landing`
- [ ] Root Directory: `landing`
- [ ] Framework: Vite
- [ ] Build Command: `npm run build` (executa `vite build`)
- [ ] Output Directory: `dist`
- [ ] Deploy bem-sucedido
- [ ] Página carrega corretamente

### Mobile
- [ ] Projeto criado: `smart-ui-mobile`
- [ ] Root Directory: `nuxt-app`
- [ ] Framework: Vite
- [ ] Build Command: `npm run build` (executa `vite build`)
- [ ] Output Directory: `dist`
- [ ] Deploy bem-sucedido
- [ ] App carrega corretamente

---

## 🎯 Resumo Rápido

**3 Projetos no Vercel:**
1. **Dashboard** → Root: `.` → URL: `smart-ui-dashboard.vercel.app`
2. **Landing** → Root: `landing` → URL: `smart-ui-landing.vercel.app`
3. **Mobile** → Root: `nuxt-app` → URL: `smart-ui-mobile.vercel.app`

**Todos apontam para o mesmo repositório**, mas cada um com seu **Root Directory** diferente.

---

**Última atualização:** Janeiro 2026
