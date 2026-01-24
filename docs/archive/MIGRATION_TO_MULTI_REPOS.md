# 🚀 Migração: Monorepo → 3 Repositórios Separados

**Objetivo:** Separar `smart-ui` em 3 repositórios independentes para simplificar deploy e eliminar problemas de Root Directory / ignoreCommand no Vercel.

**✅ Status:** Migração concluída. Landing e Mobile extraídos para repos independentes; Dashboard limpo.

---

## 📋 Índice

1. [Por que separar?](#-por-que-separar)
2. [Repositórios finais](#-repositórios-finais)
3. [Fase 1: Extrair Landing e Mobile](#-fase-1-extrair-landing-e-mobile)
4. [Fase 2: Configurar Vercel](#-fase-2-configurar-vercel)
5. [Fase 3: Limpar Dashboard (smart-ui)](#-fase-3-limpar-dashboard-smart-ui)
6. [Checklist pós-migração](#-checklist-pós-migração)

---

## 🎯 Por que separar?

| Critério | Monorepo atual | Multi-repos |
|----------|----------------|-------------|
| **Código compartilhado** | Quase nenhum (apenas `packages/shared` mínimo) | N/A |
| **Ciclos de deploy** | Dashboard ≠ Landing ≠ Mobile | Independentes |
| **Config Vercel** | Root Directory, ignoreCommand, .vercelignore | Root = `.` em todos |
| **Onboarding** | Explicar workspaces, 3 frontends, pastas | 1 repo = 1 app |
| **Build minutes** | 3 builds por push (ou lógica de skip) | 1 build por push por repo |

**Recomendação:** Separar em 3 repositórios.

---

## 📦 Repositórios finais

| Repo | Conteúdo | URL |
| **smart-ui** (Dashboard) | React + Vite + API routes, `src/`, `api/`, `lib/` | `github.com/neo-smart-token-factory/smart-ui` |
| **smart-ui-landing** | Landing React + Vite (apenas `landing/`) | `github.com/neo-smart-token-factory/smart-ui-landing` |
| **smart-ui-mobile** | Mobile Vue + Vite (apenas `nuxt-app/`) | `github.com/neo-smart-token-factory/smart-ui-mobile` |

**Repos já criados:**

- `git@github.com:neo-smart-token-factory/smart-ui-landing.git`
- `git@github.com:neo-smart-token-factory/smart-ui-mobile.git`

---

## 🔧 Fase 1: Extrair Landing e Mobile

### Opção A: Script automático (recomendado)

```bash
cd /Users/nettomello/CODIGOS/NEO\ SMART\ TOKEN/smart-ui
chmod +x scripts/migrate-to-multi-repos.sh
./scripts/migrate-to-multi-repos.sh
```

O script:

1. Clona `smart-ui` em `/tmp`, extrai `landing/` com `git filter-branch --subdirectory-filter landing`, faz push para `smart-ui-landing`.
2. Repete o processo para `nuxt-app/` → `smart-ui-mobile`.
3. Simplifica `vercel.json` nos novos repos (remove `ignoreCommand`).

### Opção B: Comandos manuais

#### 1. Extrair Landing → smart-ui-landing

```bash
cd /tmp
rm -rf smart-ui-landing-temp
git clone https://github.com/neo-smart-token-factory/smart-ui.git smart-ui-landing-temp
cd smart-ui-landing-temp
git filter-branch --subdirectory-filter landing -- --all
git remote set-url origin git@github.com:neo-smart-token-factory/smart-ui-landing.git
git push -u origin main --force
cd ..
rm -rf smart-ui-landing-temp
```

#### 2. Extrair Mobile → smart-ui-mobile

```bash
cd /tmp
rm -rf smart-ui-mobile-temp
git clone https://github.com/neo-smart-token-factory/smart-ui.git smart-ui-mobile-temp
cd smart-ui-mobile-temp
git filter-branch --subdirectory-filter nuxt-app -- --all
git remote set-url origin git@github.com:neo-smart-token-factory/smart-ui-mobile.git
git push -u origin main --force
cd ..
rm -rf smart-ui-mobile-temp
```

#### 3. Ajustar vercel.json nos novos repos (obrigatório)

Em **smart-ui-landing** e **smart-ui-mobile**, o `vercel.json` atual tem `ignoreCommand` pensado para o monorepo. Em repo único, não é necessário.

**smart-ui-landing:** remover `ignoreCommand` ou deixar só `{}`.

```bash
git clone git@github.com:neo-smart-token-factory/smart-ui-landing.git /tmp/smart-ui-landing-fix
cd /tmp/smart-ui-landing-fix
echo '{}' > vercel.json
git add vercel.json && git commit -m "chore: remove ignoreCommand (single repo)" && git push
cd .. && rm -rf smart-ui-landing-fix
```

**smart-ui-mobile:** mesmo procedimento.

```bash
git clone git@github.com:neo-smart-token-factory/smart-ui-mobile.git /tmp/smart-ui-mobile-fix
cd /tmp/smart-ui-mobile-fix
echo '{}' > vercel.json
git add vercel.json && git commit -m "chore: remove ignoreCommand (single repo)" && git push
cd .. && rm -rf smart-ui-mobile-fix
```

---

## 🌐 Fase 2: Configurar Vercel

### smart-ui-landing

1. Vercel → **Add New** → **Project**.
2. **Import** `neo-smart-token-factory/smart-ui-landing`.
3. **Root Directory:** `.` (raiz).
4. **Framework Preset:** Vite (auto).
5. **Build Command / Output Directory / Install Command:** vazios (detecção automática).
6. **Deploy**.

### smart-ui-mobile

1. Vercel → **Add New** → **Project**.
2. **Import** `neo-smart-token-factory/smart-ui-mobile`.
3. **Root Directory:** `.` (raiz).
4. **Framework Preset:** Vite (auto).
5. **Build / Output / Install:** vazios.
6. **Deploy**.

### smart-ui (Dashboard)

- Manter o projeto atual (ou reconectar ao mesmo repo).
- **Root Directory:** `.` (raiz).
- API routes continuam em `/api`.

---

## 🧹 Fase 3: Limpar Dashboard (smart-ui)

Depois de confirmar que **smart-ui-landing** e **smart-ui-mobile** estão no ar:

```bash
cd /Users/nettomello/CODIGOS/NEO\ SMART\ TOKEN/smart-ui
git checkout main
git pull
```

Remover pastas e configs do monorepo:

```bash
rm -rf landing/ nuxt-app/
```

Ajustar `package.json`: remover workspaces `landing` e `nuxt-app` (manter `packages/*` se ainda usar).

Exemplo:

```json
{
  "workspaces": ["packages/*"]
}
```

Se não usar `packages/`, remover workspaces por completo.

Ajustar `.vercelignore`: remover `landing/` e `nuxt-app/`.

Ajustar `vercel.json`: remover `ignoreCommand` (dashboard é o único app no repo).

Exemplo:

```json
{}
```

Ou apagar `vercel.json` e deixar o Vercel detectar.

Ajustar **Makefile**: remover ou simplificar targets `dev-landing`, `dev-mobile`, `build-landing`, `build-mobile`, etc., conforme o que ainda fizer sentido para o dashboard.

Commit e push:

```bash
git add -A
git commit -m "refactor: extract landing and mobile to separate repos"
git push origin main
```

---

## ✅ Checklist pós-migração

### smart-ui-landing

- [ ] Repo criado e com histórico de `landing/` apenas.
- [ ] `vercel.json` sem `ignoreCommand` (ou `{}`).
- [ ] Projeto Vercel com Root Directory = `.`.
- [ ] Deploy OK.

### smart-ui-mobile

- [ ] Repo criado e com histórico de `nuxt-app/` apenas.
- [ ] `vercel.json` sem `ignoreCommand` (ou `{}`).
- [ ] Projeto Vercel com Root Directory = `.`.
- [ ] Deploy OK.

### smart-ui (Dashboard)

- [ ] `landing/` e `nuxt-app/` removidos.
- [ ] `package.json` sem workspaces de landing/nuxt-app.
- [ ] `.vercelignore` e `vercel.json` ajustados.
- [ ] Makefile atualizado.
- [ ] Deploy do dashboard OK.
- [ ] Docs (README, DEPLOY_GUIDE, etc.) atualizados para refletir multi-repos.

---

## 🔗 Links rápidos

- **Landing:** `git@github.com:neo-smart-token-factory/smart-ui-landing.git`
- **Mobile:** `git@github.com:neo-smart-token-factory/smart-ui-mobile.git`
- **Dashboard:** `https://github.com/neo-smart-token-factory/smart-ui` (permanece).

---

**Última atualização:** Janeiro 2026
