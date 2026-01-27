# 🚀 Guia de Deploy — NΞØ Smart Factory UI (v0.5.4)

Este documento detalha o processo de publicação do Dashboard e da API em ambientes de produção (Vercel + Neon).

## 📋 Pré-requisitos
- Conta em [Neon.tech](https://console.neon.tech) (PostgreSQL)
- Conta em [Vercel](https://vercel.com)
- Projeto configurado como **Single App** (não mais monorepo)

---

## 1️⃣ Configuração do Banco de Dados (Neon)

1. **Criar Projeto:** No console do Neon, crie um novo projeto.
2. **Connection String:** Copie a URL de conexão (URI) e salve-a como `DATABASE_URL`.
3. **Executar Migrações:**
   ```bash
   # Localmente
   make migratedb
   ```
   Isso criará as tabelas `deploys`, `drafts`, `leads`, `sessions` e `events`.

---

## 2️⃣ Deploy na Vercel

### Configuração do Projeto
1. **Root Directory:** `.` (raiz)
2. **Framework Preset:** Vite
3. **Build Command:** `npm run build`

### Variáveis de Ambiente (Production)
Configure estas variáveis no painel da Vercel:

| Variável | Valor/Exemplo |
|----------|---------------|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.neon.tech/neodb` |
| `VITE_ENABLE_WEB3` | `false` (para simulation) ou `true` (Phase 02) |
| `VITE_CHAIN_ID` | `8453` (Base) |
| `VITE_DYNAMIC_ENVIRONMENT_ID` | Seu ID do Dynamic.xyz |
| `NEXT_PUBLIC_APP_VERSION` | `0.5.4` |

---

## 3️⃣ Validação Pós-Deploy

Após o deploy, valide os seguintes pontos:
- [ ] A interface carrega sem erros de rede.
- [ ] O componente de **Wallet** exibe o status correto (Configurado/Não Configurado).
- [ ] O **Histórico de Deploys** carrega com sucesso via `/api/deploys`.
- [ ] O **Modo Simulação** funciona conforme esperado (se habilitado).

---

## 🔧 Solução de Problemas de Deploy

### Tabelas não encontradas
Certifique-se de que rodou `make migratedb` apontando para a instância de produção ou use o SQL Editor do Neon com o conteúdo de `migrations/01_init.sql`.

### Erros de Variáveis `VITE_*`
No Vite, variáveis de ambiente que devem ser expostas ao frontend **precisam** começar com o prefixo `VITE_`.

---
**Última atualização:** 27 de Janeiro de 2026 (v0.5.4)
