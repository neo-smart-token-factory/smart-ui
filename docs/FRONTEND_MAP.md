# NΞØ Smart UI — Mapa de Navegação (3-Frontends)

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Guia  
**Audiência:** Desenvolvedores

Este documento serve como guia operacional para desenvolvedores que acessam o ecossistema `smart-ui` pela primeira vez.

---

## 🗺️ Arquitetura de Front-End

Atualmente, o projeto utiliza uma estratégia de **Desacoplamento por Contexto**, dividida em três frentes:

### 1. Main Dashboard (Nexus)
- **Local:** `/` (Raiz do repositório)
- **Stack:** Next.js 14 (App Router)
- **Uso:** Cockpit interno e visualização da saúde do protocolo. É onde o "Doctor CLI" reporta seus dados.
- **Comando:** `npm run dev` (Porta 3000)

### 2. User App (Forge PWA)
- **Local:** `/nuxt-app`
- **Stack:** Nuxt 3 + Pinia
- **Uso:** Interface de criação de tokens para o usuário final. Focada em ser instalável (PWA) e rápida no mobile/Telegram.
- **Comando:** `cd nuxt-app && npm run dev` (Porta 3001)

### 3. Public Landing Page
- **Local:** `/landing`
- **Stack:** React + Vite
- **Uso:** Marketing, captura de leads e narrativa do protocolo. Otimizada para SEO e carregamento instantâneo.
- **Comando:** `cd landing && npm run dev` (Porta 3002)

---

## 🧐 É inteligente trabalhar com 3 Frontends?

**A resposta curta: Sim, se o objetivo for experimentação e resiliência; Não, se você busca baixo custo de manutenção.**

### ✅ Vantagens (Por que fazemos isso agora):
1.  **Tecnologia sob Medida:** Usamos Vite para a Landing (foco em performance), Nuxt para o App (estabilidade PWA) e Next para o Dashboard (complexidade de visualização de dados).
2.  **Isolamento de Erro:** Se a Landing Page cair ou sofrer um ataque, a interface de criação de tokens (App) continua operacional.
3.  **Velocidade de Teste:** Podemos mudar toda a estética da Landing Page sem precisar testar novamente as regras de negócio complexas do App.

### ❌ Desafios (O que precisamos mitigar):
1.  **Duplicação de Estilo:** Atualmente, os tokens de design (cores, fontes) precisam ser sincronizados manualmente entre as pastas.
2.  **Overhead de Dependências:** Três `node_modules` diferentes consomem mais espaço e tempo de build.

### 🎯 Estratégia NΞØ:
Manteremos os três separados enquanto o protocolo amadurece (Fase Experimental). Assim que o design e as regras de negócio estabilizarem, a tendência natural será unificá-los ou mover para um **Monorepo (Turbo/NX)** para compartilhar componentes core.

---

## 🛠️ Guia de Inicialização Rápida

Para trabalhar em todo o ecossistema simultaneamente, utilize o Makefile:

```bash
# Terminal 1: Inicia tudo (Dashboard, Landing e Nuxt via concurrently ou múltiplos terminais)
make dev-all (Em desenvolvimento) 

# Ou manualmente:
npm run dev & cd landing && npm run dev & cd nuxt-app && npm run dev
```

---
*NΞØ Protocol — Operações Cirúrgicas Web3*
