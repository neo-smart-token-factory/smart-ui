# 🛠️ Desenvolvimento — NΞØ Smart Factory UI (v0.5.4)

Este guia descreve como configurar e desenvolver a interface do dashboard da NΞØ Smart Factory.

## 🚀 Início Rápido

### Requisitos
- Node.js 18+
- Vercel CLI (`npm i -g vercel`)
- Conta no Neon.tech (PostgreSQL)

### Instalação
```bash
make install
```

### Ambiente Local (.env)
Copie o arquivo de exemplo e preencha as variáveis necessárias:
```bash
cp .env.example .env
```

---

## 💻 Fluxo de Desenvolvimento

### Opção 1: Desenvolvimento Completo (Recomendado) ⭐
Para que as funcionalidades de backend (API routes em `/api/*`) funcionem localmente, você **deve** usar o Vercel CLI.

```bash
make dev-vercel
# ou
npm run dev:vercel
```
**Benefícios:**
- ✅ API routes funcionais (`/api/drafts`, `/api/deploys`, `/api/leads`)
- ✅ Variáveis de ambiente carregadas corretamente
- ✅ Comportamento idêntico ao ambiente de produção

### Opção 2: Apenas Frontend (Vite Dev)
Útil para ajustes rápidos de CSS e layout onde a persistência de dados não é necessária.

```bash
make dev
# ou
npm run dev
```
**Nota:** As chamadas para `/api/*` retornarão erro 404 neste modo.

---

## 📦 Estrutura de Código

- `src/components/ui/`: Componentes básicos reutilizáveis (Atômicos).
- `src/hooks/`: Lógica de estado e integração (v0.5.4 - Refatorado).
- `src/utils/`: Utilitários de validação e formatação.
- `api/`: Serverless Functions (Backend da demo).
- `lib/db.js`: Cliente de conexão com Neon PostgreSQL.

---

## 🔍 Qualidade de Código

### Linting
Sempre verifique o lint antes de commitar:
```bash
npm run lint
```
O projeto segue regras estritas para garantir compatibilidade com **React Fast Refresh**.

### Validação de Onboarding
Para garantir que todos os arquivos críticos estão presentes:
```bash
./validate-onboarding.sh
```

---

## 🐛 Solução de Problemas Comuns

### Erro: "API routes return 404"
**Causa:** Você está usando `npm run dev` (Vite) em vez de `vercel dev`.
**Solução:** Use `make dev-vercel`.

### Problemas com Wallet (Dynamic.xyz)
Certifique-se de que `VITE_DYNAMIC_ENVIRONMENT_ID` está configurado corretamente no seu `.env`. Se estiver usando modo simulação, defina `VITE_ENABLE_WEB3=false`.

---
**Última atualização:** 27 de Janeiro de 2026 (v0.5.4)
