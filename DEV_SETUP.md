# 🛠️ Guia de Desenvolvimento - Dashboard

## ⚠️ Problema: API Routes não funcionam com `vite dev`

As rotas `/api/*` são **Vercel Serverless Functions** e não funcionam com o servidor de desenvolvimento do Vite.

## ✅ Soluções

### Opção 1: Usar Vercel Dev (Recomendado) ⭐

Para desenvolvimento completo com API routes funcionando:

```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Fazer login (primeira vez)
vercel login

# Iniciar com Vercel Dev
make dev-vercel
# ou
npm run dev:vercel
```

**Vantagens:**
- ✅ API routes funcionam (`/api/drafts`, `/api/deploys`)
- ✅ Variáveis de ambiente do `.env` carregadas
- ✅ Comportamento idêntico à produção
- ✅ Database conecta corretamente

### Opção 2: Vite Dev (Modo Básico)

Para desenvolvimento apenas do frontend (sem API):

```bash
make dev
# ou
npm run dev
```

**Limitações:**
- ❌ API routes retornam 404
- ❌ Drafts não salvam
- ❌ Deploy history não carrega
- ⚠️ Erros silenciosos no console (esperado)

**Quando usar:**
- Desenvolvimento de UI/UX
- Testes de componentes
- Quando não precisa de funcionalidades de API

## 🔧 Correções Aplicadas

### 1. Campo "Mission Narrative" ✅

**Problema:** Não permitia digitar espaços entre palavras.

**Solução:**
- Removido `sanitizeInput` do `onChange` do textarea
- `sanitizeInput` agora só remove caracteres perigosos (`<`, `>`)
- `trim()` aplicado apenas no momento de salvar (não durante digitação)

### 2. Erro 404 em `/api/drafts` ✅

**Problema:** API routes não disponíveis em `vite dev`.

**Solução:**
- Adicionado tratamento de erro silencioso
- Mensagens informativas no console
- Instruções para usar `vercel dev`

### 3. Erro "Failed to sync history sequence" ✅

**Problema:** Mesmo problema - API routes não disponíveis.

**Solução:**
- Tratamento de erro melhorado
- Não bloqueia funcionalidade principal
- Mensagens informativas

## 📋 Checklist de Desenvolvimento

### Setup Inicial

- [ ] Instalar Vercel CLI: `npm i -g vercel`
- [ ] Fazer login: `vercel login`
- [ ] Configurar `.env` com `DATABASE_URL`
- [ ] Executar migrations: `make migratedb`

### Desenvolvimento Diário

**Com API (Recomendado):**
```bash
make dev-vercel
```

**Sem API (Apenas UI):**
```bash
make dev
```

## 🐛 Troubleshooting

### Erro: "vercel: command not found"

```bash
npm i -g vercel
```

### Erro: "Database connection not authenticated"

1. Verificar se `.env` existe
2. Verificar se `DATABASE_URL` está configurada
3. Verificar se database está ativo no Neon.tech

### Erro: "API routes return 404"

**Causa:** Usando `vite dev` em vez de `vercel dev`

**Solução:**
```bash
# Parar vite dev (Ctrl+C)
make dev-vercel
```

## 📝 Notas

- **Campo Mission Narrative:** Agora permite espaços normalmente
- **API Routes:** Funcionam apenas com `vercel dev`
- **Erros silenciosos:** Esperados em `vite dev` (não são bugs)

---

**Última atualização:** Janeiro 2026
