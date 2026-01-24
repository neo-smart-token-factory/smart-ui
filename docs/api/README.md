# 📡 API Documentation — NΞØ Smart Factory

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** API  
**Audiência:** Desenvolvedores

> **⚠️ Important:** This API operates in **simulation mode** and does not execute real blockchain transactions.

---

## 📚 Documentação

### OpenAPI Specification

A documentação completa da API está disponível em formato OpenAPI 3.0:

- **[openapi.yaml](./openapi.yaml)** — Especificação OpenAPI completa
- **Visualização:** Use ferramentas como [Swagger UI](https://swagger.io/tools/swagger-ui/) ou [Redoc](https://redocly.com/) para visualizar

### Documentação por Tema

| Documento | Descrição |
|-----------|-----------|
| [API_MARKETING_ROUTES.md](./API_MARKETING_ROUTES.md) | Rotas de API para marketing e analytics |
| [MARKETING_SCHEMA_EXPLANATION.md](./MARKETING_SCHEMA_EXPLANATION.md) | Explicação do schema de marketing |
| [FRONTEND_MARKETING_INTEGRATION.md](./FRONTEND_MARKETING_INTEGRATION.md) | Integração de marketing no frontend |

---

## 🚀 Endpoints Disponíveis

### Deploys
- `GET /api/deploys` — Listar deploys recentes
- `POST /api/deploys` — Registrar novo deploy

### Drafts
- `GET /api/drafts?address={address}` — Buscar draft do usuário
- `POST /api/drafts` — Salvar draft

### Operations
- `GET /api/ops-status` — Status operacional

### Marketing & Analytics
- `GET /api/leads` — Buscar lead
- `POST /api/leads` — Criar/atualizar lead
- `GET /api/analytics` — Dados de analytics
- `GET /api/sessions` — Buscar sessão
- `POST /api/sessions` — Criar/atualizar sessão
- `GET /api/events` — Buscar eventos de conversão
- `POST /api/events` — Registrar evento

---

## 🔧 Uso Local

Para testar localmente, use:

```bash
vercel dev
```

As rotas estarão disponíveis em `http://localhost:3000/api/*`

**Nota:** Com `vite dev` puro, as rotas `/api/*` não funcionam (são Vercel Serverless Functions).

---

## 📖 Referências

- [OpenAPI Specification](./openapi.yaml)
- [Documentação Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Database Schema](../DATABASE_SCHEMA.sql)
