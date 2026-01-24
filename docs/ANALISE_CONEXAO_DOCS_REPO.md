# Análise: Conexão smart-ui ↔ neo-smart-token-factory/docs

**Data:** 2026-01-24  
**Objetivo:** Verificar como o smart-ui se conecta ao repositório `git@github.com:neo-smart-token-factory/docs` e se seguimos os padrões definidos lá.

---

## 1. O smart-ui se conecta ao repositório docs?

**Resposta:** **Não há conexão git** (submodule, clone, checkout). Apenas **referências** em documentação e uso opcional no Makefile para dev local.

### Evidências

| Aspecto | Situação |
|--------|----------|
| **Git submodule** | Não existe `.gitmodules`. Nenhum submodule apontando para `docs`. |
| **Remote** | Único remote: `origin` → `git@github.com:neo-smart-token-factory/smart-ui.git`. |
| **Workflows** | `docs-guard.yml` valida só `docs/*` e `*.md` **locais** do smart-ui. `protocol-health.yml` faz checkout de `neo-smart-factory` (Core/Ops), **não** do repo `docs`. |
| **Makefile** | `DOCS_DIR = ../docs`. Usado em `ops-sync` para checar `$(DOCS_DIR)/changelog.md`. Assume **clone paralelo** em `../docs` (dev local), não dependência de build/CI. |

### Referências ao repositório docs

- **Links:** `docs/README.md`, `docs/ORGANIZATION.md`, `docs/REPOSITORY_VISIBILITY_POLICY.md` linkam para `https://github.com/neo-smart-token-factory/docs`.
- **Autoridade:** `docs/ui-status.md` declara `Authority: docs` — smart-ui não é autoridade; decisões vivem em `smart-core`, `smart-cli`, `docs`.
- **Política:** `REPOSITORY_VISIBILITY_POLICY` trata `docs` como repositório **público** permitido para ADRs, governança e guidelines.

---

## 2. Por que não conectar (submodule/clone) é aceitável?

- **docs** = documentação **centralizada da organização** (manifesto, INDEX, NEOTOKENV2, architecture, ecosystem, etc.).
- **smart-ui** = dashboard; tem **documentação própria** em `docs/` (PROJECT_OVERVIEW, ADRs, frontend, infra).
- A relação pretendida é **referência cruzada** (links) e alinhamento conceitual, não reutilização do mesmo código/docs via git.
- `docs-guard` garante que **mudanças de código** no smart-ui sejam acompanhadas de **atualização da documentação local** (`docs/*`, `*.md`), em linha com “documentação versionada com código”.

Portanto, **não é necessário** conectar ao repo docs via git para o fluxo atual.

---

## 3. Padrões do repositório docs (resumo)

Com base no conteúdo público do `neo-smart-token-factory/docs`:

- **Estrutura:** `architecture/`, `core/`, `ecosystem/`, `operations/`, `registro/`, `strategy/`, etc.
- **Conteúdo:** INDEX, manifesto, GUIA_OPERACIONAL, NEOTOKENV2, MANUAL_BRIDGE, MINIAPP_INTEGRATION, BASE_AGENTKIT_GUIDE, CONTRIBUTING.md.
- **Princípios:** Documentação versionada com o código; contribuições via CONTRIBUTING; licença CC BY 4.0 para docs.

---

## 4. Smart-ui segue esses padrões?

| Padrão | Situação no smart-ui |
|--------|----------------------|
| **Documentação versionada com código** | ✅ `docs-guard` exige atualização de `docs/*` ou `*.md` quando há mudança de código em PRs. |
| **ADRs** | ✅ `docs/adr/` com 0001–0004; formato e numeração consistentes. |
| **Links para o repo docs** | ✅ README, ORGANIZATION, REPOSITORY_VISIBILITY_POLICY referenciam `docs`. |
| **Autoridade em docs** | ✅ `ui-status` declara `Authority: docs`; smart-ui como demo/intent layer. |
| **Estrutura `docs/`** | ✅ `docs/` com PROJECT_OVERVIEW, ADRs, GITHUB_ACTIONS_SETUP, DATABASE_SCHEMA, etc. Escopo **específico do dashboard**; não duplica a estrutura do repo docs (architecture/core/ecosystem), o que faz sentido. |
| **CONTRIBUTING na raiz** | ❌ Repo docs tem `CONTRIBUTING.md`; smart-ui não. Existe “Como Contribuir” em `docs/README.md` e em `ORGANIZATION`, mas não há `CONTRIBUTING.md` na raiz. |
| **Changelog** | ⚠️ Makefile (`ops-sync`) espera `../docs/changelog.md`. Uso **opcional** (dev local com `../docs` clonado). Não bloqueia CI nem deploy. |

---

## 5. Recomendações

1. **Manter** a ausência de submodule/clone do `docs`. A relação atual (referência + docs locais) está alinhada com a organização e com a política de visibilidade.
2. **Não** criar `CONTRIBUTING.md` nem abrir contribuição externa agora; aguardar a etapa correspondente no roadmap.
3. **Manter** `DOCS_DIR` e `ops-sync` como estão: opcionais para quem desenvolve com o repo docs clonado ao lado. Não é necessário alterar para “não conectar” ao docs.
4. **Manter** `docs-guard` e `protocol-health` sem checkout do repo `docs`; eles cobrem documentação local e saúde do ecossistema (smart-ui + neo-smart-factory) conforme desenhado.

---

## 6. Contexto estratégico e materiais complementares

O posicionamento da **NΞØ Smart Factory** como **infraestrutura Web3 industrial** — Core Engine (contratos auditados, Hardhat, OpenZeppelin), automação multichain, vesting, CLI, Internal Ops, governança estruturada (KYC, compliance) e prudência frente a extensões experimentais (MPC, Snaps) — está alinhado com a separação docs (org) vs smart-ui (demo/intent layer) e com a autoridade em `docs` descrita em `ui-status`.

**Materiais em slides** (posicionamento, Core Engine, industrialização de ativos digitais) estão disponíveis em pasta externa, por exemplo:

- `NEO_Smart_Factory.pdf`
- `NSF_Digital_Asset_Industrialization.pdf`

Útil como referência para manter consistência entre documentação, ADRs e narrativa institucional.

---

## 7. Resumo

- **Conexão git:** smart-ui **não** se conecta ao `neo-smart-token-factory/docs` via submodule ou workflows. Só há links e uso opcional do Makefile em dev local.
- **Necessidade:** **Não** é necessário conectar ao docs para o fluxo atual; a separação docs (org) vs docs do smart-ui (repo) é intencional.
- **Padrões:** No geral **sim** — documentação versionada, ADRs, links, autoridade. CONTRIBUTING / contribuição externa **adiado de propósito** para etapa futura do roadmap.

---

**Última atualização:** 2026-01-24
