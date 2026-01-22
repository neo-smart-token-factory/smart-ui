# NΞØ Protocol — Plano Estratégico de Arquitetura V1 🏗️🌑

Este documento consolida a visão técnica e estratégica discutida durante a "Sessão de Alta Arquitetura" de madrugada. Ele serve como o guia mestre para transformar o Protocolo NΞØ em uma potência global de infraestrutura Web3.

---

## 🕋 A Visão NEØ
O Protocolo NΞØ não é apenas um código; é um diferencial de mercado que une a **resiliência técnica brasileira** com o **design premium internacional**. Operamos no silêncio da madrugada para construir estruturas que sobrevivem ao colapso de plataformas centralizadas.

---

## 🛠️ O Arsenal Tecnológico (The Tech Stack)

### **1. Computação e IA (Prioridade Máxima)**
*   **Serviço:** [Modal.com](https://modal.com)
*   **Status:** Uso imediato ($30 em créditos até 31/01).
*   **Papel:** Motor de IA para o "Auto-Fix" do Doctor CLI e gerador de narrativas algorítmicas de marketing.

### **2. Autenticação e UX (Gatekeeper)**
*   **Serviço:** [Dynamic.xyz](https://www.dynamic.xyz/)
*   **Status:** Plano Hobby (Grátis < 1.000 MAUs).
*   **Papel:** Login unificado (Wallet + Social + Email) com interface premium.

### **3. Frontends (Tríade Desacoplada)**
*   **Hospedagem:** [Vercel](https://vercel.com) (Grátis/Hobby).
*   **Estrutura:** 
    *   **Main Dashboard (Nexus):** Next.js 14 — Controle total do ecossistema.
    *   **User App (Forge PWA):** Nuxt 3 — Fábrica de tokens mobile-optimized.
    *   **Landing Page:** React/Vite — Marketing e Conversão.

### **4. Banco de Dados e Estado (Alternativas ao Supabase)**
*   **Sugestão 1 (Edge):** [Turso](https://turso.tech) (SQLite na Edge — Ultra rápido e design foda).
*   **Sugestão 2 (Serverless Postgres):** [Neon.tech](https://neon.tech) (Semelhante ao Supabase, mas sem o "hate").
*   **Sugestão 3 (NoSQL):** [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) (Free Tier sólido).

### **5. Infraestrutura Web3 & DevOps**
*   **RPC:** [dRPC.org](https://drpc.org) (5 chaves de API ativas).
*   **Blockchain Monitoring:** [Alchemy Webhooks](https://dashboard.alchemy.com/).
*   **Error Tracking:** [Sentry.io](https://sentry.io) (Conta ativa em neomello.sentry.io).
*   **Redes Prioritárias:** Base (L2), Polygon e **Mint Chain**.

---

## 📐 Blueprint de Arquitetura (O Plano de Voo)

### **Fase 1: O Nexus de Dados (Monorepo Interno)**
Transformar o repositório `smart-ui` em um **npm workspace**.
- **Objetivo:** Compartilhar ABIs, Hooks (Wagmi/Viem) e constantes entre os 3 frontends.
- **Vantagem:** Evita o erro de dependência relativa (`../`) na Vercel.

### **Fase 2: O Cérebro na Cloud (Modal.com)**
Deploy imediato de uma API de IA na Modal.
- **Função:** Receber bytecode/código e retornar diagnósticos de segurança para o `nxf doctor`.

### **Fase 3: Monetização "Code-is-Law"**
Implementar a taxa de 5% (500 bps) diretamente no contrato da Factory.
- **Transparência:** Exibir na UI exatamente quanto o tesouro NEØ receberá de cada deploy.

---

## 📋 TODO List Imediata (Checklist de Madrugada)

1.  **[ ] Workspace Setup:** Configurar o `package.json` raiz do `smart-ui` com `workspaces`.
2.  **[ ] Shared Logic:** Mover ABIs e constantes para `/packages/shared`.
3.  **[ ] Modal Bridge:** Criar o script Python para aproveitar os créditos da Modal antes do dia 31.
4.  **[ ] Sentry Connect:** Integrar o DSN do Sentry no Dashboard Next.js.
5.  **[ ] Vercel Draft:** Criar os 3 projetos no painel da Vercel (mesmo que sem build funcional ainda).

---

## 🎙️ Manifesto do Arquiteto
*"Não somos apertadores de botões. Somos os arquitetos do novo financeiro. Se existe código, existe uma falha; onde existe uma falha, o Doctor NΞØ traz a cura."*

---
**Status:** Alpha v0.5.3  
**Data:** 22 de Janeiro de 2026  
**Liderança:** NEØ Node
