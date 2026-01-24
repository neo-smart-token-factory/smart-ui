# 🚨 CORREÇÃO URGENTE - Vercel Deploy

## ❌ Problemas Atuais

### 1. Landing: "No Output Directory named 'dist' found"
**Causa:** Root Directory ou Output Directory não configurado corretamente

### 2. Mobile: "Could not read package.json: /vercel/path0/nuxt-app/package.json"
**Causa:** Root Directory não está configurado como `nuxt-app`

---

## ✅ SOLUÇÃO IMEDIATA

### Passo 1: Verificar Root Directory no Vercel Dashboard

**⚠️ CRÍTICO: Faça isso AGORA antes de qualquer re-deploy**

#### Para smart-ui-landing:

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto **smart-ui-landing**
3. Clique em **Settings** (ícone de engrenagem no topo)
4. Clique em **General** (menu lateral esquerdo)
5. Role até encontrar **Root Directory**
6. **DEVE ESTAR EXATAMENTE:** `landing`
   - ❌ NÃO: `./landing`
   - ❌ NÃO: `landing/`
   - ❌ NÃO: vazio
   - ✅ SIM: `landing` (apenas isso)
7. Se estiver diferente:
   - Clique em **Edit** ao lado de Root Directory
   - Digite: `landing`
   - Clique em **Save**
8. Verifique também **Output Directory**:
   - Deve estar: `dist`
   - Se não estiver, configure como `dist`

#### Para smart-ui-mobile:

1. Clique no projeto **smart-ui-mobile**
2. **Settings** → **General**
3. Role até **Root Directory**
4. **DEVE ESTAR EXATAMENTE:** `nuxt-app`
   - ❌ NÃO: `./nuxt-app`
   - ❌ NÃO: `nuxt-app/`
   - ❌ NÃO: vazio
   - ✅ SIM: `nuxt-app` (apenas isso)
5. Se estiver diferente:
   - Clique em **Edit**
   - Digite: `nuxt-app`
   - Clique em **Save**
6. Verifique também **Output Directory**:
   - Deve estar: `dist`
   - Se não estiver, configure como `dist`

---

## 🔍 Como Verificar se Está Correto

### No Vercel Dashboard

**smart-ui-landing:**

``
Settings → General → Root Directory: landing
Settings → General → Output Directory: dist
``

**smart-ui-mobile:**

``
Settings → General → Root Directory: nuxt-app
Settings → General → Output Directory: dist
``

---

## 📝 Configuração Esperada no Vercel

### smart-ui-landing

**Settings → General:**

- Framework Preset: `Vite` (ou detectado automaticamente)
- Root Directory: `landing` ⚠️ CRÍTICO
- Build Command: `npm run build` (ou deixar vazio para auto-detect)
- Output Directory: `dist` ⚠️ CRÍTICO
- Install Command: `npm install` (ou deixar vazio)

### smart-ui-mobile

**Settings → General:**

- Framework Preset: `Vite` (ou detectado automaticamente)
- Root Directory: `nuxt-app` ⚠️ CRÍTICO
- Build Command: `npm run build` (ou deixar vazio para auto-detect)
- Output Directory: `dist` ⚠️ CRÍTICO
- Install Command: `npm install` (ou deixar vazio)

---

## 🚀 Após Corrigir

### Opção 1: Re-deploy Manual (Recomendado)

1. Vercel Dashboard → **Deployments**
2. Para cada projeto:
   - Clique nos 3 pontos (⋯) do último deploy
   - **Redeploy**
3. Aguarde o build completar
4. Verifique os logs

### Opção 2: Aguardar Próximo Push

O próximo push vai triggerar deploy automático, mas **só funcionará se o Root Directory estiver correto**.

---

## 🐛 Se Ainda Não Funcionar

### Landing ainda com erro de Output Directory

1. Verifique se o build está rodando:
   - Vercel Dashboard → Deployments → Clique no deploy
   - Veja os logs de build
   - Procure por "✓ built in X.XXs"

2. Se o build completar mas não encontrar dist:
   - Verifique se **Output Directory** está como `dist` (não `./dist`)
   - Tente remover o `vercel.json` e configurar tudo no Dashboard

### Mobile ainda com erro de package.json:

1. **CONFIRME** que Root Directory está exatamente `nuxt-app`
2. Verifique se `nuxt-app/package.json` está commitado no Git:

   ```bash
   git ls-files nuxt-app/package.json
   ```

3. Se não estiver, adicione e commite:

   ```bash
   git add nuxt-app/package.json
   git commit -m "fix: adiciona package.json do mobile"
   git push
   ```

---

## ✅ Checklist Final

Antes de fazer re-deploy, confirme:

- [ ] Root Directory do Landing = `landing` (exatamente isso)
- [ ] Root Directory do Mobile = `nuxt-app` (exatamente isso)
- [ ] Output Directory de ambos = `dist`
- [ ] Arquivos `package.json` estão commitados no Git
- [ ] Arquivos `index.html` estão commitados no Git

---

**IMPORTANTE:** O problema é 99% de chance de ser Root Directory incorreto no Vercel Dashboard. Verifique isso PRIMEIRO antes de qualquer outra coisa.
