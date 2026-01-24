# 🔧 Correção: Problemas com Workspaces do npm no Vercel

## ✅ Confirmação

**Root Directory está CORRETO:**
- ✅ smart-ui-landing: `landing`
- ✅ smart-ui-mobile: `nuxt-app`

O problema é **outro**!

---

## 🐛 Problemas Reais Identificados

### 1. Mobile: Erro `/vercel/path0/nuxt-app/package.json`

**Análise do Erro:**
```
Error: Could not read package.json: /vercel/path0/nuxt-app/package.json
```

**Causa Provável:**
- O Vercel está tentando instalar dependências na **raiz do monorepo** primeiro (por causa dos workspaces)
- Quando define Root Directory como `nuxt-app`, ele muda para lá, mas o `npm install` pode estar rodando na raiz primeiro
- O erro mostra que está procurando `nuxt-app/package.json` quando já está dentro de `nuxt-app/`

**Solução:**
1. **Limpar Cache** (sua sugestão é correta!)
2. Configurar `installCommand` para ignorar workspaces
3. Ou desabilitar "Include files outside the root directory"

### 2. Landing: "No Output Directory named 'dist' found"

**Causa Provável:**
- Build pode estar falhando silenciosamente
- Ou o `dist` está sendo gerado mas o Vercel não encontra
- Pode ser problema de cache também

---

## ✅ Soluções

### Solução 1: Limpar Cache no Vercel ⭐ (SUA SUGESTÃO)

**Para cada projeto:**

1. Vercel Dashboard → **smart-ui-landing** → **Settings** → **Caches**
2. Clique em **"Clear All Caches"** ou **"Purge Cache"**
3. Repita para **smart-ui-mobile**

**Ou via CLI:**
```bash
# Não há comando direto, mas você pode:
# 1. Fazer um commit vazio para forçar rebuild
# 2. Ou usar a interface do Dashboard
```

### Solução 2: Configurar Install Command para Ignorar Workspaces

**No Vercel Dashboard, para cada projeto:**

**smart-ui-landing:**
- Settings → Build and Deployment
- **Install Command:** `npm install --ignore-scripts` ou `npm ci --ignore-scripts`

**smart-ui-mobile:**
- Settings → Build and Deployment  
- **Install Command:** `npm install --ignore-scripts` ou `npm ci --ignore-scripts`

**Ou adicionar ao vercel.json:**

```json
{
  "installCommand": "npm install --ignore-scripts"
}
```

### Solução 3: Desabilitar "Include files outside the root directory"

**Nas imagens você mostrou que está ENABLED. Tente DESABILITAR:**

1. Vercel Dashboard → Settings → Build and Deployment
2. Role até **Root Directory**
3. **Desabilite** "Include files outside the root directory in the Build Step"
4. Salve

**Por quê?**
- Com workspaces, isso pode estar causando o Vercel a procurar arquivos na raiz
- Desabilitar força o Vercel a trabalhar apenas dentro do Root Directory

### Solução 4: Usar npm ci em vez de npm install

**No vercel.json de cada projeto:**

```json
{
  "installCommand": "npm ci"
}
```

`npm ci` é mais determinístico e não instala workspaces da raiz.

---

## 🔍 Diagnóstico Detalhado

### Por que o erro mostra `/vercel/path0/nuxt-app/package.json`?

Quando Root Directory = `nuxt-app`:
- Vercel muda para `/vercel/path0/nuxt-app/`
- Deveria procurar `package.json` em `/vercel/path0/nuxt-app/package.json` ✅
- Mas o erro mostra que está procurando exatamente isso e não encontra

**Possíveis causas:**
1. **Cache antigo** - Vercel tem cache de estrutura antiga
2. **Workspaces** - `npm install` na raiz instala tudo, depois muda de diretório
3. **Git não tem o arquivo** - Mas já verificamos que está commitado

---

## 🚀 Ações Imediatas (Ordem de Prioridade)

### 1. Limpar Cache (FAÇA PRIMEIRO) ⭐

**Vercel Dashboard:**
1. **smart-ui-landing** → Settings → **Caches** → **Clear All**
2. **smart-ui-mobile** → Settings → **Caches** → **Clear All**

### 2. Desabilitar "Include files outside root directory"

**Para ambos projetos:**
1. Settings → Build and Deployment
2. Root Directory section
3. **Desabilite** "Include files outside the root directory"
4. Salve

### 3. Atualizar Install Command

**Adicionar ao vercel.json:**

**landing/vercel.json:**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci --ignore-scripts"
}
```

**nuxt-app/vercel.json:**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci --ignore-scripts"
}
```

### 4. Re-deploy

Após fazer as mudanças acima:
1. Commit e push das mudanças no vercel.json
2. Ou fazer Redeploy manual no Dashboard

---

## 📋 Checklist de Correção

- [ ] Limpar cache do smart-ui-landing
- [ ] Limpar cache do smart-ui-mobile
- [ ] Desabilitar "Include files outside root directory" (ambos)
- [ ] Atualizar installCommand para `npm ci --ignore-scripts` (ambos)
- [ ] Commit e push das mudanças
- [ ] Re-deploy manual ou aguardar trigger automático

---

## 🔬 Teste Alternativo: Build sem Workspaces

Se ainda não funcionar, podemos criar um `package.json` isolado temporariamente para testar:

**landing/package-lock.json** (se não existir, criar):
```bash
cd landing
npm install  # Gera package-lock.json local
```

Isso força o npm a não usar workspaces da raiz.

---

**Última atualização:** Janeiro 2026
