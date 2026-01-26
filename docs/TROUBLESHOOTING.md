# 🔧 Troubleshooting — NΞØ Smart Factory

**Data:** 2026-01-26  
**Status:** Ativo  
**Categoria:** Suporte  
**Audiência:** Desenvolvedores

---

## ⚠️ Avisos e Warnings Comuns

### DeprecationWarning: `url.parse()`

**Mensagem:**
```
(node:4) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead.
```

**Causa:**
Este aviso vem de dependências (provavelmente Vercel CLI ou dependências transitivas), não do nosso código. É um **aviso de depreciação**, não um erro.

**Status:**

- ✅ **Não é um erro** — não bloqueia a execução
- ✅ **Não vem do nosso código** — é de dependências externas
- ⚠️ **Pode ser ignorado** — será corrigido quando as dependências atualizarem

**Solução:**

1. **Ignorar o aviso** (não afeta funcionalidade)
2. **Aguardar atualização** das dependências (Vercel CLI, etc.)
3. **Suprimir o aviso** (opcional):

   ```bash
   NODE_OPTIONS="--no-deprecation" vercel dev
   ```

**Nota:** Este aviso é comum em projetos Node.js modernos e não representa um problema de segurança no nosso código.

---

### `vercel dev` demora para iniciar

**Sintomas:**

- `npm install` completa, mas servidor não inicia
- Processo parece travado
- Porta 3000 não responde

**Causa:**
O `vercel dev` pode demorar 30-60 segundos na primeira inicialização porque precisa:

1. ✅ Instalar dependências (já completo)
2. ⏳ Compilar o projeto Vite
3. ⏳ Iniciar servidor de desenvolvimento
4. ⏳ Configurar serverless functions

**Solução:**

1. **Aguardar** — Primeira inicialização pode levar até 1 minuto
2. **Verificar logs** — Deve aparecer mensagens como:
   ```
   > Ready! Available at http://localhost:3000
   ```
3. **Verificar porta:**
   ```bash
   lsof -ti:3000  # Deve retornar um PID
   ```
4. **Se travar completamente:**
   - Pressionar `Ctrl+C` para parar
   - Verificar se há outro processo na porta 3000:
     ```bash
     lsof -ti:3000
     kill -9 $(lsof -ti:3000)  # Se necessário
     ```
   - Tentar novamente: `make dev-vercel`

**Tempo esperado:**
- Primeira vez: 30-60 segundos
- Próximas vezes: 10-20 segundos

---

## 🐛 Erros Comuns

### Erro: "API routes return 404"

**Sintomas:**

- `GET /api/deploys` retorna 404
- `POST /api/drafts` retorna 404
- APIs não funcionam

**Causa:**
Usando `vite dev` em vez de `vercel dev`

**Solução:**
```bash
# Parar vite dev (Ctrl+C)
make dev-vercel
# ou
npm run dev:vercel
```

**Explicação:**
As rotas `/api/*` são **Vercel Serverless Functions** e só funcionam com `vercel dev` ou em deploy.

---

### Erro: "Database connection not authenticated"

**Sintomas:**
- `503 Service Unavailable`
- Mensagem: "Database connection not authenticated"

**Causa:**
- `DATABASE_URL` não configurada no `.env`
- Database inativo no Neon.tech
- URL inválida

**Solução:**
1. Verificar `.env`:
   ```bash
   grep DATABASE_URL .env
   ```

2. Verificar se database está ativo:
   - Acesse: https://console.neon.tech
   - Verifique se o projeto está ativo

3. Testar conexão:
   ```bash
   psql $DATABASE_URL -c "SELECT 1;"
   ```

---

### Erro: "TAVILY_API_KEY não configurada"

**Sintomas:**
- APIs Tavily retornam erro
- `{ "error": "TAVILY_API_KEY não configurada", "fallback": true }`

**Causa:**
Variável de ambiente `TAVILY_API_KEY` não configurada

**Solução:**

**Local:**
```bash
# Adicionar ao .env
echo 'TAVILY_API_KEY="sua-key-aqui"' >> .env
```

**Vercel (Produção):**
```bash
vercel env add TAVILY_API_KEY production
vercel env add TAVILY_API_KEY preview
vercel env add TAVILY_API_KEY development
```

---

### Erro: "vercel: command not found"

**Sintomas:**
- `make dev-vercel` falha
- Comando `vercel` não encontrado

**Solução:**
```bash
npm i -g vercel
vercel login
```

---

### Erro: "Build failed" no Vercel

**Sintomas:**
- Deploy falha no Vercel
- Logs mostram erro de build

**Solução:**
1. Testar build localmente:
   ```bash
   npm run build
   ```

2. Verificar logs no Vercel Dashboard:
   - Deployments → último deploy → Building

3. Verificar variáveis de ambiente:
   - Settings → Environment Variables

4. Verificar se todas as dependências estão no `package.json`

---

### Erro: "Cannot find module"

**Sintomas:**
- Erro ao executar scripts
- Módulo não encontrado

**Solução:**
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

---

## 🔍 Debugging

### Verificar se APIs estão funcionando

```bash
# Testar endpoint
curl http://localhost:3000/api/ops-status

# Testar todas as APIs
make test-apis
```

### Verificar variáveis de ambiente

```bash
# Listar todas as variáveis
cat .env | grep -v "^#" | grep "="

# Verificar variável específica
grep DATABASE_URL .env
```

### Verificar logs do Vercel Dev

```bash
# Iniciar com logs detalhados
NODE_OPTIONS="--trace-warnings" vercel dev
```

### Verificar se servidor está rodando

```bash
# Verificar porta
lsof -ti:3000

# Testar conexão
curl http://localhost:3000
```

---

## 📚 Referências

- [DEV_SETUP.md](../DEV_SETUP.md) — Setup de desenvolvimento
- [API_TESTING.md](./API_TESTING.md) — Testes de API
- [DEPLOY_GUIDE.md](../DEPLOY_GUIDE.md) — Guia de deploy

---

**Última atualização:** 2026-01-26
