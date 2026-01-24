# ✅ Checklist de Consistência entre Repositórios

**Objetivo:** Garantir que `smart-ui-landing` e `smart-ui-mobile` mantenham o mesmo padrão de `smart-ui` (Dashboard).

---

## 📋 Checklist para `smart-ui-landing`

### Estrutura de Arquivos

- [ ] `package.json` na raiz (não em subpasta)
- [ ] `README.md` na raiz com descrição do projeto
- [ ] `.gitignore` configurado (node_modules, dist, .env, etc.)
- [ ] `vite.config.js` na raiz
- [ ] `vercel.json` na raiz (pode ser `{}` vazio para auto-detect)
- [ ] `index.html` na raiz
- [ ] `src/` com código fonte
- [ ] **NÃO** tem pasta `landing/` (tudo na raiz)

### Configuração

- [ ] `package.json` **NÃO** tem campo `workspaces`
- [ ] `package.json` tem scripts: `dev`, `build`, `preview`
- [ ] `vercel.json` é `{}` (vazio) ou tem apenas configurações específicas
- [ ] **NÃO** tem `ignoreCommand` (não é mais monorepo)

### Workflows GitHub

- [ ] `.github/workflows/docs-guard.yml` existe (mesmo padrão do Dashboard)
- [ ] `.github/workflows/protocol-health.yml` existe (se aplicável)
- [ ] Workflows não mencionam `landing/` ou `nuxt-app/`

### Documentação

- [ ] `README.md` menciona que é parte do ecossistema NEØ
- [ ] `README.md` tem link para Dashboard: `smart-ui`
- [ ] `README.md` tem link para Mobile: `smart-ui-mobile`
- [ ] **NÃO** tem documentos sobre monorepo ou Root Directory

### Scripts

- [ ] `Makefile` (se existir) não menciona `landing/` ou outros workspaces
- [ ] Scripts `.sh` (se existirem) não mencionam monorepo

---

## 📋 Checklist para `smart-ui-mobile`

### Estrutura de Arquivos

- [ ] `package.json` na raiz (não em subpasta)
- [ ] `README.md` na raiz com descrição do projeto
- [ ] `.gitignore` configurado (node_modules, dist, .env, etc.)
- [ ] `vite.config.js` na raiz
- [ ] `vercel.json` na raiz (pode ser `{}` vazio para auto-detect)
- [ ] `index.html` na raiz
- [ ] `src/` com código fonte
- [ ] **NÃO** tem pasta `nuxt-app/` (tudo na raiz)

### Configuração

- [ ] `package.json` **NÃO** tem campo `workspaces`
- [ ] `package.json` tem scripts: `dev`, `build`, `preview`
- [ ] `vercel.json` é `{}` (vazio) ou tem apenas configurações específicas
- [ ] **NÃO** tem `ignoreCommand` (não é mais monorepo)

### Workflows GitHub

- [ ] `.github/workflows/docs-guard.yml` existe (mesmo padrão do Dashboard)
- [ ] `.github/workflows/protocol-health.yml` existe (se aplicável)
- [ ] Workflows não mencionam `landing/` ou `nuxt-app/`

### Documentação

- [ ] `README.md` menciona que é parte do ecossistema NEØ
- [ ] `README.md` tem link para Dashboard: `smart-ui`
- [ ] `README.md` tem link para Landing: `smart-ui-landing`
- [ ] **NÃO** tem documentos sobre monorepo ou Root Directory

### Scripts

- [ ] `Makefile` (se existir) não menciona `nuxt-app/` ou outros workspaces
- [ ] Scripts `.sh` (se existirem) não mencionam monorepo

---

## 🔍 Comandos de Verificação

### Para Landing

```bash
cd smart-ui-landing

# Verificar estrutura
ls -la | grep -E "package.json|README.md|vite.config|vercel.json|index.html"

# Verificar package.json
cat package.json | grep -E "workspaces|scripts"

# Verificar vercel.json
cat vercel.json

# Buscar referências obsoletas
grep -r "landing/" . --exclude-dir=node_modules
grep -r "monorepo" . --exclude-dir=node_modules
grep -r "workspace" . --exclude-dir=node_modules
```

### Para Mobile

```bash
cd smart-ui-mobile

# Verificar estrutura
ls -la | grep -E "package.json|README.md|vite.config|vercel.json|index.html"

# Verificar package.json
cat package.json | grep -E "workspaces|scripts"

# Verificar vercel.json
cat vercel.json

# Buscar referências obsoletas
grep -r "nuxt-app/" . --exclude-dir=node_modules
grep -r "monorepo" . --exclude-dir=node_modules
grep -r "workspace" . --exclude-dir=node_modules
```

---

## 🎯 Padrão Esperado

### Estrutura de Repositório

```
smart-ui-landing/          (ou smart-ui-mobile/)
├── package.json           (raiz, sem workspaces)
├── README.md              (raiz)
├── .gitignore
├── vercel.json            ({})
├── vite.config.js
├── index.html
├── src/
│   └── ...
└── .github/
    └── workflows/
        ├── docs-guard.yml
        └── protocol-health.yml (opcional)
```

### vercel.json

```json
{}
```

**Ou** configurações específicas (sem `ignoreCommand`):

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### package.json

```json
{
  "name": "neo-smart-factory-landing",
  "version": "0.5.1",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": { ... },
  "devDependencies": { ... }
  // SEM campo "workspaces"
}
```

---

## ✅ Resultado Esperado

Após validação, cada repositório deve:

- ✅ Ser **independente** (não menciona outros workspaces)
- ✅ Ter **estrutura limpa** (tudo na raiz, sem subpastas de workspace)
- ✅ Ter **vercel.json simples** (sem `ignoreCommand` de monorepo)
- ✅ Ter **workflows consistentes** (mesmo padrão do Dashboard)
- ✅ Ter **documentação atualizada** (links para outros repos, não monorepo)

---

**Última atualização:** Janeiro 2026 (pós-migração multi-repos)
