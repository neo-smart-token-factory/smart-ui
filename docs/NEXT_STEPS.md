# NΞØ Smart Factory — Next Steps & Roadmap 🚀

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Guia  
**Audiência:** Desenvolvedores

> **Current Status:** v0.5.3 (Infrastructure Ready | Demo & Intent Layer)

---

## 📌 Contexto Atual

Este repositório (`smart-ui`) está classificado como **Demo and Intent Layer** (ver `ADR 0002` em `docs/adr/0002-ui-as-demo-and-intent-layer.md`). 

**Status da Migração:**
- ✅ **Multi-repo migration concluída** (2026-01-24)
  - `smart-ui` (Dashboard) — Repositório atual
  - `smart-ui-landing` — Landing Page (repositório separado)
  - `smart-ui-mobile` — Mobile App (repositório separado)

**Limitações Arquiteturais:**
- ⚠️ Operação em **simulation mode** (não executa transações reais)
- ⚠️ Estrutura arquitetural congelada (arquitetura NEØ)
- ⚠️ Não pode adicionar lógica de protocolo (autoridade está no `smart-core`)

---

## 🟢 Phase 1: UI/UX Enhancement (Permitido)
*Focus: Melhorias de interface dentro das limitações arquiteturais.*

- [ ] **Melhorias de UX**:
    - Refinar fluxos de demonstração para melhor clareza
    - Adicionar mais rotulagem explícita de "simulation mode"
    - Melhorar feedback visual durante simulações
- [ ] **Analytics & Tracking**:
    - Expandir tracking de marketing (já implementado)
    - Adicionar métricas de engajamento na demo
- [ ] **Documentação Visual**:
    - Criar guias visuais para novos desenvolvedores
    - Melhorar documentação de componentes UI

## 🔵 Phase 2: Integration Readiness (Preparação)
*Focus: Preparar estrutura para futuras integrações (quando ADR permitir).*

- [ ] **Type Safety**:
    - Garantir tipos consistentes entre Database schema e Frontend
    - Documentar interfaces de dados compartilhadas
- [ ] **API Routes Documentation**:
    - Documentar todas as API routes de demo
    - Criar exemplos de uso para cada endpoint
- [ ] **Component Library**:
    - Documentar componentes reutilizáveis
    - Criar Storybook ou similar para visualização

## 🟣 Phase 3: Cross-Repo Coordination (Futuro)
*Focus: Coordenação com outros repositórios do ecossistema.*

- [ ] **Sincronização com `smart-core`**:
    - Documentar como o UI reflete decisões do core
    - Criar guias de integração (quando permitido por ADR)
- [ ] **Coordenação com `smart-ui-landing` e `smart-ui-mobile`**:
    - Alinhar padrões de design
    - Compartilhar componentes via npm packages (quando aplicável)

## 🟠 Phase 4: Protocol Integration (Requer ADR)
*Focus: Integração real com protocolo (requer decisão arquitetural).*

> ⚠️ **Nota:** Estas fases requerem uma nova ADR para permitir mudanças arquiteturais.

- [ ] **Web3 Integration** (quando permitido):
    - Integração com Dynamic.xyz para wallet connection
    - Conexão com contratos reais do `forge-core`
    - Event listening on-chain
- [ ] **AI Integration** (quando permitido):
    - Doctor AI endpoint via Modal.com
    - Narrative generator automático

---

## 🏁 Próximos Passos Imediatos

**Prioridade:** Focar em **Phase 1** (UI/UX Enhancement).

Como este é um **Demo and Intent Layer**, o foco deve estar em:
1. Melhorar a experiência de demonstração
2. Tornar os fluxos mais claros e educativos
3. Expandir analytics e tracking
4. Documentar melhor os componentes existentes

**Para integrações reais com Web3/Protocol:**
- Consultar `smart-core` para autoridade de protocolo
- Criar nova ADR se mudanças arquiteturais forem necessárias
- Seguir guidelines em `docs/adr/0002-ui-as-demo-and-intent-layer.md`

---

## 📚 Referências

- `docs/adr/0002-ui-as-demo-and-intent-layer.md` — Definição do Smart UI como Demo Layer
- `docs/adr/0002-ui-as-demo-and-intent-layer.md` — ADR que define o papel do UI
- `docs/FRONTEND_MAP.md` — Mapa dos frontends do ecossistema
- `docs/archive/MIGRATION_TO_MULTI_REPOS.md` — Histórico da migração

---

*Última atualização: 2026-01-24*
