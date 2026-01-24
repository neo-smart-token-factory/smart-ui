## ⚠️ Architectural Status Notice

This repository is **intentionally frozen**.

The Smart UI is classified as a **Demo and Intent Layer**, as defined in:
- `docs/ui-status.md`
- `ADR 0002 — Smart UI as Demo and Intent Layer`

### What this means

- This UI demonstrates flows and concepts.
- It does NOT represent protocol authority.
- It does NOT deploy contracts or execute transactions.
- Backend logic present here is transitional and non-authoritative.

### Allowed changes

- Critical build fixes
- Security dependency updates
- Explicit demo/simulation labeling

### Forbidden changes

- New features
- New backend logic
- Protocol rules
- Direct core integrations

Any change outside this scope requires an explicit architectural decision (ADR).

**Do not treat this repository as production infrastructure.**


# NΞØ SMART FACTORY — Interface de Gestão e Fábrica de Tokens

## 🌐 Visão Geral
A **NΞØ Smart Factory** é a interface definitiva para o ecossistema de criação de ativos da NEO. Desenvolvida como uma fábrica de tokens multichain, ela permite que usuários compilem e publiquem contratos inteligentes com precisão técnica e segurança.

Documentação detalhada: [PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)

## 🚀 Estética e Design
- **Tema**: Modo Escuro (Obsidian)
- **Destaque**: Neon Acid (`#D8F244`)
- **Efeitos**: Glassmorphism e Gradientes Cinéticos.
- **Interações**: Micro-animações fluidas.

## 🛠️ Stack Técnica
- **Build Tool**: Vite 7.3.1 (ultra-rápido HMR)
- **Framework Principal**: React 18 + Vite
- **Este repo**: Dashboard Principal (`src/`) + API routes (`api/`)
- **Estilo**: Tailwind CSS + Design Tokens Customizados
- **Ícones**: Lucide React / Vue
- **Web3**: Ethers.js v6 (Viem mencionado como opção futura)

## 📦 Funcionalidades
- [x] **Fábrica Multichain**: Suporte integrado para Base, Polygon e outras redes EVM.
- [x] **Compilação de Contratos**: Interface para configurar e compilar novos tokens sem código.
- [x] **Gerador de Ativos**: Criação automática de planos de marketing e rascunhos de whitepaper.
- [x] **Pronto para MiniApp**: Design responsivo otimizado para frames do Telegram MiniApp.

## 🏃 Como Rodar Localmente
```bash
# Para a interface principal
npm install
npm run dev
```

## 📜 Atribuição e Licença
Este projeto está licenciado sob a **Licença MIT**.

Se você utilizar esta UI como base para seu projeto, solicitamos a **Atribuição** ao Protocolo NΞØ, mantendo os créditos de design e referência à fábrica original.

## 📦 Repositórios Relacionados

Este projeto faz parte do ecossistema NEØ Smart Factory:

- **Dashboard** (este repo): https://github.com/neo-smart-token-factory/smart-ui
- **Landing Page**: https://github.com/neo-smart-token-factory/smart-ui-landing
- **Mobile App**: https://github.com/neo-smart-token-factory/smart-ui-mobile

---
**Build v0.5.3** — *Transformando código em ativos líquidos.*
