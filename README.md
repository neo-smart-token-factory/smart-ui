# NΞØ SMART FACTORY — Interface de Gestão e Fábrica de Tokens

===============================================================================
                        AVISO DE STATUS ARQUITETURAL
===============================================================================

Este repositório está **intencionalmente congelado** em termos de **estrutura e arquitetura**.

O Smart UI é classificado como **Demo and Intent Layer**, conforme definido em:
• `docs/ui-status.md`
• `ADR 0002 — Smart UI as Demo and Intent Layer`

-------------------------------------------------------------------------------
 O QUE ISSO SIGNIFICA
-------------------------------------------------------------------------------
Este repositório é um **projeto ativo** para desenvolvimento de UI/UX e features de interface, mas com limites arquiteturais claros:

- **Estrutura e arquitetura:** Congeladas (arquitetura NEØ)
- **Lógica de protocolo:** Não pode ser adicionada (autoridade está no core)
- **Transações reais:** Não executa (opera em simulation mode)
- **Backend como infraestrutura:** Não deve ser expandido como produção

Desenvolvimento permitido: UI/UX, features de interface, tracking/analytics, API routes para demo.

-------------------------------------------------------------------------------
 MUDANÇAS PERMITIDAS
-------------------------------------------------------------------------------
 [✓] Correções críticas de build
 [✓] Atualizações de segurança de dependências
 [✓] Melhorias de UI/UX
 [✓] Features de interface (sem lógica de protocolo)
 [✓] Tracking e analytics
 [✓] Rotulagem explícita de demo/simulação

-------------------------------------------------------------------------------
 MUDANÇAS PROIBIDAS
-------------------------------------------------------------------------------
 [✗] Modificar estrutura de pastas (arquitetura NEØ)
 [✗] Adicionar lógica de protocolo/autoridade
 [✗] Integrações diretas com smart-core
 [✗] Deploy real de contratos (apenas simulação)
 [✗] Expandir backend como infraestrutura de produção

Qualquer mudança fora deste escopo requer uma decisão arquitetural explícita (ADR).

===============================================================================

## 🌐 Visão Geral

A **NΞØ Smart Factory** é uma **interface de demonstração** para o ecossistema de criação de ativos da NEO. Desenvolvida como protótipo de uma fábrica de tokens multichain, ela **demonstra fluxos** para compilação e publicação de contratos inteligentes.

**⚠️ Importante:** Esta interface opera em **simulation mode** e não executa transações reais na blockchain. É uma camada de demonstração e coleta de intenção do usuário.

## 🚀 Estética e Design

┌─────────────────────────────────────────────────────────────┐
│ ▓▓▓ VISUAL                                                  │
├─────────────────────────────────────────────────────────────┤
│ └─ Tema: Modo Escuro (Obsidian)                             │
│ └─ Destaque: Neon Acid (#D8F244)                            │
│ └─ Efeitos: Glassmorphism e Gradientes Cinéticos            │
│ └─ Interações: Micro-animações fluidas                      │
└─────────────────────────────────────────────────────────────┘

## 🛠️ Stack Técnica

┌─────────────────────────────────────────────────────────────┐
│ ▓▓▓ TECNOLOGIAS                                             │
├─────────────────────────────────────────────────────────────┤
│ └─ Build Tool: Vite 7.3.1 (ultra-rápido HMR)               │
│ └─ Framework: React 18 + Vite                               │
│ └─ Escopo: Dashboard Principal (src/) + API routes (api/)   │
│ └─ Estilo: Tailwind CSS + Design Tokens Customizados        │
│ └─ Ícones: Lucide React                                     │
│ └─ Web3: Ethers.js v6 (simulation mode)                     │
│ └─ Database: Neon PostgreSQL (demo/analytics)               │
└─────────────────────────────────────────────────────────────┘

## 📦 Funcionalidades Demonstradas

=================================================================
              STATUS DE IMPLEMENTAÇÃO - v0.5.3
=================================================================

[####] FABRICA MULTICHAIN ................................................. OK
       Demonstra suporte para Base, Polygon e outras redes EVM
       ⚠️ Operação em simulation mode (não executa transações reais)

[####] COMPILACAO DE CONTRATOS ............................................ OK
       Interface para configurar e compilar novos tokens sem código
       ⚠️ Gera contratos simulados (mock addresses/hashes)

[####] GERADOR DE ATIVOS .................................................. OK
       Criação automática de planos de marketing e rascunhos de whitepaper
       ⚠️ Funcionalidade de demonstração

[####] PRONTO PARA MINIAPP ................................................ OK
       Design responsivo otimizado para frames do Telegram MiniApp

[####] MARKETING & ANALYTICS .............................................. OK
       Sistema completo de tracking de leads, eventos e recuperação de usuários
       ✅ Funcional (captura visitantes, eventos, abandono)

=================================================================
STATUS: 5/5 funcionalidades demonstradas
=================================================================

## 🏃 Como Rodar Localmente

```bash
make install
make dev          # Só frontend (sem API)
make dev-vercel   # Com API routes (recomendado)
```

**Deploy:** Veja [docs/DEPLOY_DASHBOARD.md](docs/DEPLOY_DASHBOARD.md) (Neon + Vercel + migrations).

## 📐 Arquitetura do Sistema

┌─────────────────────────────────────────────────────────────┐
│              ARQUITETURA DO SISTEMA                         │
└─────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FRONTEND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Dashboard NΞØ Smart UI
 (React 18 + Vite 7.3.1)
 Simulation Mode (não executa transações reais) 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    │
                    ▼
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 API LAYER (Vercel Serverless Functions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ 
 ░ ░                                                                 ░ ░ ░ 
 ░ ░   ⚠️ Para demo/persistência temporária          ░ ░ ░ 
 ░ ░   (não autoritativo)                            ░ ░ ░ 
 ░ ░  ┌──────────┐  ┌──────────┐  ┌──────────┐     ░ ░ ░ 
 ░ ░  │/api/deploy│  │/api/draft│  │/api/leads│     ░ ░ ░ 
 ░ ░  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──┬───┘ ░ ░ ░ 
 ░ ░         │                 │                 │             │     ░ ░ ░ 
 ░ ░         └─────────────────┴─────────────────┴─────────────┘     ░ ░ ░ 
 ░ ░                                │                                ░ ░ ░ 
 ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    │
                    ▼
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 DATABASE (Neon PostgreSQL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Neon Database (PostgreSQL)
 ⚠️ Persistência demo/analytics (não autoritativo) 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Nota sobre APIs e Database:**
- As API routes (`/api/*`) são **funcionais** e conectam a um **database real** (Neon)
- Elas servem para: persistir dados de demo, tracking de marketing, analytics
- **Não** representam autoridade de protocolo ou execução real de transações
- São componentes **transicionais** para demo e coleta de intenção do usuário

## 📜 Atribuição e Licença

Este projeto está licenciado sob a **Licença MIT**.

## 📦 Repositórios Relacionados

┌─────────────────────────────────────────────────────────────┐
│ ▓▓▓ ECOSSISTEMA NEØ SMART FACTORY                          │
├─────────────────────────────────────────────────────────────┤
│ └─ Dashboard (este repo)                                    │
│    └─ https://github.com/neo-smart-token-factory/smart-ui   │
│    └─ Interface de gestão (simulation mode)                 │
│ └─ Landing Page                                             │
│    └─ https://github.com/neo-smart-token-factory/            │
│       smart-ui-landing                                       │
│    └─ Página pública de marketing                           │
│ └─ Mobile App                                               │
│    └─ https://github.com/neo-smart-token-factory/            │
│       smart-ui-mobile                                        │
│    └─ PWA mobile-first                                      │
└─────────────────────────────────────────────────────────────┘

## ❓ Perguntas Frequentes

**Este dashboard executa transações reais?**  
Não. Opera em simulation mode. Gera mock addresses e hashes para demonstração.

**Posso usar isso em produção?**  
Não. É um protótipo de demonstração. Para produção, veja o repositório smart-core.

**O database armazena dados reais?**  
Sim, mas apenas para analytics, tracking de marketing e persistência de demos.

**Posso contribuir com melhorias de UI?**  
Sim! Veja a seção "MUDANÇAS PERMITIDAS" no aviso arquitetural.

---

<div align="center">

## NΞØ SMART FACTORY

**Transformando código em ativos líquidos.**

[![Website](https://img.shields.io/badge/Website-neosmart.space-D8F244?style=flat-square&logo=internet-explorer&logoColor=000)](https://neosmart.space)
[![GitHub](https://img.shields.io/badge/GitHub-neo--smart--token--factory-C0E030?style=flat-square&logo=github&logoColor=000)](https://github.com/neo-smart-token-factory)
[![Twitter](https://img.shields.io/badge/Twitter-@neosmartfactory-A8C81C?style=flat-square&logo=twitter&logoColor=000)](https://x.com/neosmartfactory)
[![Email](https://img.shields.io/badge/Email-neosmart.factory@gmail.com-90B008?style=flat-square&logo=gmail&logoColor=000)](mailto:neosmart.factory@gmail.com)

</div>

---

**Build v0.5.3** — *Demonstrando a transformação de código em ativos.*  
**Status:** Demo and Intent Layer — Simulation Mode
