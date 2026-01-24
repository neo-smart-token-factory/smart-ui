# ✅ Validação dos Novos Repositórios (Landing e Mobile)

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Guia  
**Audiência:** DevOps

Guia prático para validar que `smart-ui-landing` e `smart-ui-mobile` estão consistentes após a migração.

---

## 🚀 Método Rápido (Script Automático)

### 1. Validar Landing

```bash
# Clonar ou navegar para o repo landing
cd /caminho/para/smart-ui-landing

# Copiar script de validação do Dashboard
cp ../smart-ui/scripts/validate-repo-consistency.sh .

# Executar validação
./validate-repo-consistency.sh landing
```

### 2. Validar Mobile

```bash
# Clonar ou navegar para o repo mobile
cd /caminho/para/smart-ui-mobile

# Copiar script de validação do Dashboard
cp ../smart-ui/scripts/validate-repo-consistency.sh .

# Executar validação
./validate-repo-consistency.sh mobile
```

---

## 📋 Método Manual (Checklist Detalhado)

### Para `smart-ui-landing`

#### 1. Estrutura de Arquivos

```bash
cd smart-ui-landing

# Verificar arquivos na raiz
ls -la | grep -E "package.json|README.md|vite.config|vercel.json|index.html"

# Deve mostrar:
# ✅ package.json
# ✅ README.md
# ✅ vite.config.js
# ✅ vercel.json
# ✅ index.html
# ✅ src/ (diretório)
```

**❌ NÃO deve ter:**
- `landing/` (subpasta)
- `nuxt-app/` (subpasta)

#### 2. package.json

```bash
cat package.json
```

**✅ Deve ter:**
- Campo `name` (ex: `"neo-smart-factory-landing"`)
- Scripts: `dev`, `build`, `preview`
- **NÃO** deve ter campo `workspaces`

**Exemplo correto:**
```json
{
  "name": "neo-smart-factory-landing",
  "version": "0.5.1",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### 3. vercel.json

```bash
cat vercel.json
```

**✅ Deve ser:**
- `{}` (vazio) - **IDEAL**
- Ou configurações simples (sem `ignoreCommand`)

**❌ NÃO deve ter:**
- `ignoreCommand` (não é mais monorepo)
- Referências a `landing/` ou `nuxt-app/`

#### 4. Workflows GitHub

```bash
ls -la .github/workflows/
```

**✅ Deve ter:**
- `docs-guard.yml` (mesmo padrão do Dashboard)

**Verificar conteúdo:**
```bash
grep -i "landing\|nuxt-app\|monorepo\|workspace" .github/workflows/*.yml
```

**❌ Não deve encontrar nada** (sem referências ao monorepo)

#### 5. README.md

```bash
cat README.md | head -30
```

**✅ Deve mencionar:**
- Que é parte do ecossistema NEØ
- Links para outros repos:
  - Dashboard: `smart-ui`
  - Mobile: `smart-ui-mobile`

**❌ NÃO deve mencionar:**
- Monorepo
- Workspaces
- Root Directory (no contexto de monorepo)

#### 6. Buscar Referências Obsoletas

```bash
# Buscar referências a landing/ (não deve encontrar nada relevante)
grep -r "landing/" . --exclude-dir=node_modules --exclude-dir=.git

# Buscar referências a monorepo
grep -r "monorepo" . --exclude-dir=node_modules --exclude-dir=.git

# Buscar referências a workspace
grep -r "workspace" . --exclude-dir=node_modules --exclude-dir=.git
```

**✅ Resultado esperado:** Nenhuma referência encontrada (ou apenas em comentários/documentação histórica)

---

### Para `smart-ui-mobile`

**Mesmo processo, mas:**

- Buscar `nuxt-app/` em vez de `landing/`
- Verificar que não tem pasta `nuxt-app/` (tudo na raiz)
- README deve mencionar links para Dashboard e Landing

---

## 🔧 Correções Comuns

### Problema 1: `package.json` ainda tem `workspaces`

**Correção:**
```bash
# Editar package.json e remover:
# "workspaces": ["landing", "nuxt-app"]
```

### Problema 2: `vercel.json` tem `ignoreCommand`

**Correção:**
```bash
# Substituir vercel.json por:
echo '{}' > vercel.json
```

### Problema 3: Falta `docs-guard.yml`

**Correção:**
```bash
# Copiar do Dashboard
cp ../smart-ui/.github/workflows/docs-guard.yml .github/workflows/
```

### Problema 4: README não menciona outros repos

**Correção:**
Adicionar seção no README.md:
```markdown
## 📦 Repositórios Relacionados

Este é o **Landing Page** do ecossistema NEØ Smart Factory.

- **Dashboard**: https://github.com/neo-smart-token-factory/smart-ui
- **Mobile**: https://github.com/neo-smart-token-factory/smart-ui-mobile
```

---

## ✅ Checklist Final

### Landing

- [ ] `package.json` na raiz, sem `workspaces`
- [ ] `vercel.json` é `{}` ou simples (sem `ignoreCommand`)
- [ ] `.github/workflows/docs-guard.yml` existe
- [ ] `README.md` menciona ecossistema e links para outros repos
- [ ] Sem referências a `landing/`, `monorepo`, `workspace`
- [ ] Estrutura limpa (tudo na raiz)

### Mobile

- [ ] `package.json` na raiz, sem `workspaces`
- [ ] `vercel.json` é `{}` ou simples (sem `ignoreCommand`)
- [ ] `.github/workflows/docs-guard.yml` existe
- [ ] `README.md` menciona ecossistema e links para outros repos
- [ ] Sem referências a `nuxt-app/`, `monorepo`, `workspace`
- [ ] Estrutura limpa (tudo na raiz)

---

## 🎯 Resultado Esperado

Após validação e correções:

- ✅ Cada repo é **independente**
- ✅ Cada repo tem **estrutura limpa** (raiz = app)
- ✅ Cada repo tem **vercel.json simples**
- ✅ Cada repo tem **workflows consistentes**
- ✅ Cada repo tem **documentação atualizada**

---

## 📝 Próximos Passos

Após validar e corrigir:

1. **Commit das correções:**
   ```bash
   git add .
   git commit -m "chore: validação pós-migração - remove referências ao monorepo"
   git push
   ```

2. **Validar no Vercel:**
   - Verificar que Root Directory = `.` (raiz)
   - Verificar que build funciona
   - Verificar que deploy é bem-sucedido

3. **Testar localmente:**
   ```bash
   npm install
   npm run build
   npm run dev
   ```

---

**Última atualização:** Janeiro 2026
