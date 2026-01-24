# 🚫 Ignored Build Step - Otimização de Deploys

**Problema Resolvido:** Rebuilds desnecessários quando apenas 1 frontend é alterado.

---

## 🐛 Problema Original

Quando você faz commit em qualquer arquivo, **todos os 3 projetos** no Vercel tentam fazer rebuild, mesmo que apenas 1 frontend tenha sido alterado.

**Exemplo:**
```bash
# Você altera apenas landing/src/App.jsx
git commit -m "fix: corrige botão CTA na landing"
git push

# Resultado indesejado:
✅ Dashboard rebuilda (desnecessário) 
✅ Landing rebuilda (correto)
✅ Mobile rebuilda (desnecessário)
```

**Consequências:**
- ⏱️ Tempo de deploy desperdiçado (3x mais lento)
- 💰 Build minutes consumidos desnecessariamente (Vercel tem limite)
- 🐛 Possibilidade de quebrar deploys que não deveriam rodar
- 😤 Frustração do desenvolvedor

---

## ✅ Solução Implementada

### Ignored Build Step (Vercel Native)

Cada projeto Vercel agora verifica se há mudanças relevantes antes de fazer rebuild.

**Como Funciona:**

1. Vercel executa o `ignoreCommand` antes do build
2. Se o script retorna **exit 0** → **Skip build** (não faz rebuild)
3. Se o script retorna **exit 1** → **Faz build** (rebuild necessário)

---

## 📝 Scripts Criados

### 1. `scripts/check-dashboard-changes.sh`

**Verifica mudanças no Dashboard (raiz):**

```bash
#!/bin/bash
# Exit 1 = build SHOULD run
# Exit 0 = skip build
```

**Arquivos monitorados:**
- `src/`
- `public/`
- `api/`
- `lib/`
- `index.html`
- `vite.config.js`
- `tailwind.config.cjs`
- `postcss.config.cjs`
- `tsconfig.json`
- `package.json`
- `eslint.config.js`
- `.vercelignore`

**Lógica:**
- Se detecta mudanças em qualquer arquivo do Dashboard → **Exit 1** (rebuild)
- Se apenas `landing/` ou `nuxt-app/` mudaram → **Exit 0** (skip)
- Se outras mudanças (scripts, docs, etc.) → **Exit 1** (rebuild por segurança)

---

### 2. `scripts/check-landing-changes.sh`

**Verifica mudanças na Landing Page:**

```bash
#!/bin/bash
# Exit 1 = build SHOULD run
# Exit 0 = skip build
```

**Arquivos monitorados:**
- `landing/` (qualquer arquivo dentro)

**Lógica:**
- Se detecta mudanças em `landing/` → **Exit 1** (rebuild)
- Caso contrário → **Exit 0** (skip)

---

### 3. `scripts/check-mobile-changes.sh`

**Verifica mudanças no Mobile App:**

```bash
#!/bin/bash
# Exit 1 = build SHOULD run
# Exit 0 = skip build
```

**Arquivos monitorados:**
- `nuxt-app/` (qualquer arquivo dentro)

**Lógica:**
- Se detecta mudanças em `nuxt-app/` → **Exit 1** (rebuild)
- Caso contrário → **Exit 0** (skip)

---

## 🔧 Configuração nos vercel.json

### Dashboard (`vercel.json` na raiz)

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "ignoreCommand": "bash scripts/check-dashboard-changes.sh"
}
```

### Landing (`landing/vercel.json`)

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "ignoreCommand": "bash scripts/check-landing-changes.sh"
}
```

### Mobile (`nuxt-app/vercel.json`)

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "ignoreCommand": "bash scripts/check-mobile-changes.sh"
}
```

---

## 🧪 Como Testar

### Teste 1: Mudança apenas na Landing

```bash
# Fazer mudança na landing
echo "// test" >> landing/src/App.jsx
git add landing/src/App.jsx
git commit -m "test: landing change"
git push

# Resultado esperado:
✅ Dashboard: Skip build (exit 0)
✅ Landing: Rebuild (exit 1)
✅ Mobile: Skip build (exit 0)
```

### Teste 2: Mudança apenas no Dashboard

```bash
# Fazer mudança no dashboard
echo "// test" >> src/App.jsx
git add src/App.jsx
git commit -m "test: dashboard change"
git push

# Resultado esperado:
✅ Dashboard: Rebuild (exit 1)
✅ Landing: Skip build (exit 0)
✅ Mobile: Skip build (exit 0)
```

### Teste 3: Mudança apenas no Mobile

```bash
# Fazer mudança no mobile
echo "// test" >> nuxt-app/src/App.vue
git add nuxt-app/src/App.vue
git commit -m "test: mobile change"
git push

# Resultado esperado:
✅ Dashboard: Skip build (exit 0)
✅ Landing: Skip build (exit 0)
✅ Mobile: Rebuild (exit 1)
```

### Teste 4: Mudança em múltiplos frontends

```bash
# Fazer mudanças em múltiplos lugares
echo "// test" >> src/App.jsx
echo "// test" >> landing/src/App.jsx
git add .
git commit -m "test: multiple changes"
git push

# Resultado esperado:
✅ Dashboard: Rebuild (exit 1)
✅ Landing: Rebuild (exit 1)
✅ Mobile: Skip build (exit 0)
```

---

## 📊 Benefícios

### Antes (Sem Ignored Build Step)

```
Commit em landing/src/App.jsx:
- Dashboard: 45s de build (desnecessário)
- Landing: 30s de build (correto)
- Mobile: 35s de build (desnecessário)
Total: 110s + 3x build minutes consumidos
```

### Depois (Com Ignored Build Step)

```
Commit em landing/src/App.jsx:
- Dashboard: Skip (0s)
- Landing: 30s de build (correto)
- Mobile: Skip (0s)
Total: 30s + 1x build minute consumido
```

**Economia:** 73% mais rápido, 66% menos build minutes! 🎉

---

## ⚠️ Pontos de Atenção

### 1. Primeiro Commit

No primeiro deploy de cada projeto, o Vercel **sempre faz build**, mesmo que o `ignoreCommand` retorne exit 0. Isso é esperado.

### 2. Mudanças em Arquivos Compartilhados

Se você alterar arquivos que afetam múltiplos frontends (ex: `package.json` na raiz), o Dashboard pode fazer rebuild mesmo que você não tenha alterado `src/`. Isso é por design (segurança).

### 3. Scripts Precisam Estar Executáveis

Os scripts foram criados com `chmod +x`, mas se você clonar o repo em outra máquina, pode precisar executar:

```bash
chmod +x scripts/check-*.sh
```

### 4. Git History Necessário

Os scripts usam `git diff HEAD~1 HEAD`, então precisam de pelo menos 1 commit anterior. No primeiro commit do projeto, isso pode não funcionar, mas o Vercel faz build de qualquer forma.

---

## 🔍 Debugging

### Ver Logs do Ignore Command

No Vercel Dashboard, ao fazer deploy, você verá logs como:

```
Running "ignoreCommand" command: `bash scripts/check-dashboard-changes.sh`...
✅ Dashboard changes detected in 'src/' - proceeding with build
```

Ou:

```
Running "ignoreCommand" command: `bash scripts/check-landing-changes.sh`...
❌ No landing changes detected - skipping landing build
```

### Testar Scripts Localmente

```bash
# Simular mudança na landing
git diff --name-only HEAD~1 HEAD | grep "^landing/"

# Testar script do dashboard
bash scripts/check-dashboard-changes.sh
echo $?  # Deve ser 0 (skip) se apenas landing mudou

# Testar script da landing
bash scripts/check-landing-changes.sh
echo $?  # Deve ser 1 (rebuild) se landing mudou
```

---

## 📋 Checklist de Validação

- [x] Scripts criados e executáveis
- [x] `vercel.json` atualizados com `ignoreCommand`
- [x] Scripts testados localmente
- [ ] Primeiro deploy após mudanças (validar que funciona)
- [ ] Testar mudança apenas na landing
- [ ] Testar mudança apenas no dashboard
- [ ] Testar mudança apenas no mobile
- [ ] Verificar logs no Vercel Dashboard

---

## 🎯 Resultado Esperado

Após implementação, você deve ver:

1. **Deploys mais rápidos** (apenas projetos alterados fazem rebuild)
2. **Economia de build minutes** (Vercel tem limite mensal)
3. **Menos frustrações** (não precisa esperar builds desnecessários)
4. **Logs claros** no Vercel mostrando por que cada projeto fez ou não rebuild

---

**Última atualização:** Janeiro 2026  
**Status:** ✅ Implementado e pronto para uso
