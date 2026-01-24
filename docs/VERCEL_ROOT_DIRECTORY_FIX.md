# 🔧 Correção: Vercel Root Directory e vercel.json

**Problema:** Vercel não encontra `package.json` mesmo com Root Directory configurado corretamente.

---

## 🐛 Problema Identificado

**Erro:**
```
npm error path /vercel/path1/package.json
npm error enoent Could not read package.json
```

**Causa:**
Quando você define `buildCommand`, `outputDirectory` ou `installCommand` no `vercel.json`, o Vercel pode **ignorar** o Root Directory e tentar executar comandos na raiz do repositório.

---

## ✅ Solução: Simplificar vercel.json

### Regra de Ouro

**Quando você usa Root Directory diferente da raiz, o `vercel.json` deve conter APENAS `ignoreCommand`.**

O Vercel detecta automaticamente:
- Framework (Vite, Next.js, etc.)
- Build command (`npm run build`)
- Output directory (`dist`)
- Install command (`npm install`)

---

## 📝 Configuração Correta

### 1. Landing (`landing/vercel.json`)

**✅ CORRETO:**
```json
{
  "ignoreCommand": "git rev-parse HEAD~1 >/dev/null 2>&1 && (git diff --quiet HEAD~1 HEAD -- landing/ || exit 1; exit 0) || exit 1"
}
```

**❌ ERRADO:**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "ignoreCommand": "..."
}
```

**Por quê?**
- Com `buildCommand` definido, Vercel pode executar na raiz
- Sem `buildCommand`, Vercel detecta automaticamente e executa no Root Directory

---

### 2. Mobile (`nuxt-app/vercel.json`)

**✅ CORRETO:**
```json
{
  "ignoreCommand": "git rev-parse HEAD~1 >/dev/null 2>&1 && (git diff --quiet HEAD~1 HEAD -- nuxt-app/ || exit 1; exit 0) || exit 1"
}
```

**❌ ERRADO:**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "ignoreCommand": "..."
}
```

---

### 3. Dashboard (`vercel.json` na raiz)

**✅ CORRETO:**
```json
{
  "ignoreCommand": "git rev-parse HEAD~1 >/dev/null 2>&1 && (bash -c '[ -n \"$(git diff --name-only HEAD~1 HEAD | grep -v \"^landing/\\|^nuxt-app/\")\" ]') || exit 1"
}
```

**Nota:** Dashboard pode ter `buildCommand` se necessário, pois Root Directory é a raiz.

---

## 🔍 Como o Vercel Funciona com Root Directory

### Com `buildCommand` no vercel.json (PROBLEMA):

```
1. Vercel clona repositório
2. Lê vercel.json (com buildCommand)
3. Vê buildCommand definido
4. IGNORA Root Directory
5. Executa npm install na raiz ❌
6. Erro: package.json não encontrado
```

### Sem `buildCommand` no vercel.json (SOLUÇÃO):

```
1. Vercel clona repositório
2. Muda para Root Directory (landing/ ou nuxt-app/)
3. Detecta package.json no diretório atual
4. Detecta framework (Vite) automaticamente
5. Executa npm install no Root Directory ✅
6. Executa npm run build no Root Directory ✅
7. Build funciona!
```

---

## ⚙️ Configuração no Vercel UI

### Para `smart-ui-landing`:

**Settings → Build & Development Settings:**

- ✅ **Root Directory:** `landing`
- ✅ **Framework Preset:** Vite (ou auto-detect)
- ❌ **Build Command:** DEIXAR VAZIO (ou remover override)
- ❌ **Output Directory:** DEIXAR VAZIO (Vite usa `dist` por padrão)
- ❌ **Install Command:** DEIXAR VAZIO (usa `npm install` automático)

### Para `smart-ui-mobile`:

**Settings → Build & Development Settings:**

- ✅ **Root Directory:** `nuxt-app`
- ✅ **Framework Preset:** Vite (ou auto-detect)
- ❌ **Build Command:** DEIXAR VAZIO
- ❌ **Output Directory:** DEIXAR VAZIO
- ❌ **Install Command:** DEIXAR VAZIO

---

## 🧪 Teste Após Correção

**Log esperado no Vercel:**

```
✅ smart-ui-landing:
Cloning completed
Root Directory: landing
Detected framework: Vite
Running "npm install" (dentro de /landing/)
found 123 packages
Running "npm run build" (dentro de /landing/)
vite build
dist/index.html created
Build completed ✅
```

---

## 🚨 Se Ainda Não Funcionar

### Opção 1: Limpar Cache

1. Vercel Dashboard → Projeto
2. **Deployments** → Último deployment
3. **⋯ (três pontos)** → **Redeploy**
4. ✅ **Clear build cache**
5. **Redeploy**

### Opção 2: Verificar Root Directory no UI

1. Vercel Dashboard → Projeto → **Settings** → **General**
2. Verificar **Root Directory** está exatamente:
   - `landing` (sem `/`, sem `.`)
   - `nuxt-app` (sem `/`, sem `.`)

### Opção 3: Workaround com Variáveis de Ambiente (Último Recurso)

Se nada funcionar, use comandos explícitos com `$VERCEL_PROJECT_REPO_ROOT`:

**`landing/vercel.json`:**
```json
{
  "installCommand": "cd $VERCEL_PROJECT_REPO_ROOT/landing && npm install",
  "buildCommand": "cd $VERCEL_PROJECT_REPO_ROOT/landing && npm run build",
  "outputDirectory": "landing/dist",
  "ignoreCommand": "git rev-parse HEAD~1 >/dev/null 2>&1 && (git diff --quiet HEAD~1 HEAD -- landing/ || exit 1; exit 0) || exit 1"
}
```

**Mas isso é workaround.** O ideal é que funcione sem esses comandos.

---

## 📋 Checklist de Validação

- [x] `landing/vercel.json` contém APENAS `ignoreCommand`
- [x] `nuxt-app/vercel.json` contém APENAS `ignoreCommand`
- [ ] Vercel UI → Root Directory está correto (`landing` e `nuxt-app`)
- [ ] Vercel UI → Build/Install Commands estão VAZIOS (sem override)
- [ ] Commit e push feitos
- [ ] Cache limpo no Vercel (se necessário)
- [ ] Deploy testado e funcionando

---

## 🎯 Resultado Esperado

Após essa correção:

1. ✅ Vercel respeita Root Directory
2. ✅ `npm install` executa no diretório correto
3. ✅ `npm run build` executa no diretório correto
4. ✅ Build completa com sucesso
5. ✅ IgnoreCommand funciona corretamente

---

**Última atualização:** Janeiro 2026  
**Status:** ✅ Solução implementada
