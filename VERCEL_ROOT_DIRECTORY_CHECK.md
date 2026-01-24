# ⚠️ CHECKLIST CRÍTICO: Root Directory no Vercel

## 🔴 AÇÃO IMEDIATA NECESSÁRIA

Antes de fazer qualquer re-deploy, **VERIFIQUE** o Root Directory de cada projeto no Vercel Dashboard.

---

## 📋 Verificação Passo a Passo

### 1. Acessar Vercel Dashboard

1. Vá para [vercel.com/dashboard](https://vercel.com/dashboard)
2. Faça login se necessário

### 2. Verificar smart-ui-dashboard

1. Clique no projeto **smart-ui-dashboard**
2. Vá em **Settings** (ícone de engrenagem)
3. Clique em **General**
4. Role até **Root Directory**
5. **DEVE ESTAR:**
   - `.` (ponto)
   - OU **vazio** (nada)
6. Se estiver diferente, **CLIQUE EM "EDIT"** e corrija
7. **SALVE** as alterações

### 3. Verificar smart-ui-landing

1. Clique no projeto **smart-ui-landing**
2. Vá em **Settings** → **General**
3. Role até **Root Directory**
4. **DEVE ESTAR EXATAMENTE:** `landing`
   - ❌ NÃO pode ser: `./landing`
   - ❌ NÃO pode ser: `landing/`
   - ❌ NÃO pode estar vazio
   - ✅ DEVE SER: `landing` (apenas isso)
5. Se estiver diferente, **CLIQUE EM "EDIT"** e corrija
6. **SALVE** as alterações

### 3. Verificar smart-ui-mobile

1. Clique no projeto **smart-ui-mobile**
2. Vá em **Settings** → **General**
3. Role até **Root Directory**
4. **DEVE ESTAR EXATAMENTE:** `nuxt-app`
   - ❌ NÃO pode ser: `./nuxt-app`
   - ❌ NÃO pode ser: `nuxt-app/`
   - ❌ NÃO pode estar vazio
   - ✅ DEVE SER: `nuxt-app` (apenas isso)
5. Se estiver diferente, **CLIQUE EM "EDIT"** e corrija
6. **SALVE** as alterações

---

## 🎯 Valores Corretos (Resumo)

| Projeto | Root Directory | Status Esperado |
|---------|---------------|-----------------|
| **smart-ui-dashboard** | `.` ou vazio | ✅ Funcionando |
| **smart-ui-landing** | `landing` | ❌ Precisa verificar |
| **smart-ui-mobile** | `nuxt-app` | ❌ Precisa verificar |

---

## ⚠️ Por Que Isso é Crítico?

Quando você define Root Directory como `landing`:

- O Vercel **muda** para dentro da pasta `landing/`
- Executa `npm install` dentro de `landing/`
- Procura `package.json` em `landing/package.json` ✅
- Executa `npm run build` dentro de `landing/`
- Procura `index.html` em `landing/index.html` ✅

Se o Root Directory estiver errado:

- Vercel procura arquivos no lugar errado
- Erro: "Could not read package.json"
- Erro: "Could not resolve entry module index.html"

---

## ✅ Após Corrigir

1. **Salve** as alterações no Vercel
2. Vá em **Deployments**
3. Clique em **Redeploy** no último deploy
4. Ou aguarde o próximo push para trigger automático

---

**IMPORTANTE:** Faça esta verificação ANTES de qualquer re-deploy!
