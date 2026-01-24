# 🗄️ Guia Rápido: Configurar Neon Database

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Guia  
**Audiência:** DevOps

Guia passo a passo para configurar Neon e executar migrations.

---

## 📋 Checklist Rápido

- [x] Criar conta/projeto no Neon
- [x] Copiar `DATABASE_URL`
- [x] Criar `.env` local com `DATABASE_URL`
- [x] Executar migrations (`make migratedb`)
- [x] Verificar tabelas criadas
- [x] Configurar `DATABASE_URL` no Vercel (se ainda não fez)

---

## 1️⃣ Criar Projeto no Neon

### Passo 1: Acessar Neon

1. Acesse: https://console.neon.tech
2. Faça login (ou crie conta gratuita)

### Passo 2: Criar Novo Projeto

1. Clique em **"New Project"** (ou **"Create Project"**)
2. **Nome do projeto:** `smart-ui-dashboard` (ou outro nome de sua escolha)
3. **Região:** Escolha a mais próxima:
   - `us-east-2` (Ohio) - Recomendado para EUA
   - `us-west-2` (Oregon)
   - `eu-central-1` (Frankfurt) - Para Europa
   - `ap-southeast-1` (Singapore) - Para Ásia
4. Clique em **"Create Project"**

### Passo 3: Obter Connection String

1. No projeto criado, procure por **"Connection details"** ou **"Connection string"**
2. Clique em **"URI"** ou **"Connection string"**
3. Copie a URL completa (ela será algo como):
   ```text
   postgresql://user:password@ep-xxx-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **⚠️ IMPORTANTE:** Guarde essa URL - você precisará dela!

---

## 2️⃣ Configurar `.env` Local

### Passo 1: Criar arquivo `.env`

```bash
cd /Users/nettomello/CODIGOS/NEO\ SMART\ TOKEN/smart-ui
cp .env.example .env
```

### Passo 2: Editar `.env`

Abra o arquivo `.env` e cole a `DATABASE_URL` que você copiou:

```bash
# Editar .env
nano .env
# ou
code .env
# ou
open -a TextEdit .env
```

**Substitua a linha:**
```bash
DATABASE_URL="postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neodb?sslmode=require"
```

**Por sua URL real:**
```bash
DATABASE_URL="postgresql://seu-user:seu-password@ep-xxx-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**Salve o arquivo.**

---

## 3️⃣ Executar Migrations

### Opção 1: Usando Makefile (Recomendado)

```bash
cd /Users/nettomello/CODIGOS/NEO\ SMART\ TOKEN/smart-ui
make migratedb
```

### Opção 2: Usando npm

```bash
cd /Users/nettomello/CODIGOS/NEO\ SMART\ TOKEN/smart-ui
npm run migrate
```

### Opção 3: Direto com variável (sem .env)

```bash
cd /Users/nettomello/CODIGOS/NEO\ SMART\ TOKEN/smart-ui
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require" npm run migrate
```

### ✅ Sucesso Esperado

Você deve ver:

```text
🚀 Iniciando migração do banco de dados (Neon)...
✅ Tabelas "deploys" e "drafts" criadas ou já existem.
📊 Status: 0 deploy(s) registrado(s).
```

---

## 4️⃣ Verificar Tabelas Criadas

### Opção 1: Via Neon Console

1. Acesse seu projeto no Neon: https://console.neon.tech
2. Vá para **"SQL Editor"** ou **"Query"**
3. Execute:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
4. Deve mostrar:
   - `deploys`
   - `drafts`

### Opção 2: Via Script (Opcional)

Criar um script de verificação:

```bash
# Criar scripts/verify-tables.js
node -e "
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL);
const tables = await sql\`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'\`;
console.log('Tabelas:', tables.map(t => t.table_name));
await sql.end();
"
```

---

## 5️⃣ Configurar no Vercel (Se ainda não fez)

### Passo 1: Acessar Vercel

1. Acesse: https://vercel.com
2. Vá para seu projeto `smart-ui-dashboard`

### Passo 2: Adicionar Variável de Ambiente

1. **Settings** → **Environment Variables**
2. Clique em **"Add New"**
3. **Key:** `DATABASE_URL`
4. **Value:** Cole a mesma URL do Neon que você usou no `.env`
5. **Environments:** Marque:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (opcional)
6. Clique em **"Save"**

### Passo 3: Redeploy (Se necessário)

Se o projeto já estava deployado, faça um **Redeploy** para aplicar a nova variável:

1. Vá para **"Deployments"**
2. Clique nos **⋯ (três pontos)** do último deploy
3. **Redeploy** → **Use existing Build Cache** (ou limpar cache se preferir)

---

## 🧪 Testar Conexão

### Teste Local (com vercel dev)

```bash
cd /Users/nettomello/CODIGOS/NEO\ SMART\ TOKEN/smart-ui
make dev-vercel
```

Acesse: `http://localhost:3000`

**Testar API routes:**
- `http://localhost:3000/api/deploys` → Deve retornar `[]` (array vazio)
- `http://localhost:3000/api/ops-status` → Deve retornar status

### Teste em Produção

Após deploy no Vercel:

- `https://seu-projeto.vercel.app/api/deploys` → Deve retornar `[]`
- `https://seu-projeto.vercel.app/api/ops-status` → Deve retornar status

---

## 🐛 Troubleshooting

### Erro: "DATABASE_URL não definida"

**Causa:** `.env` não existe ou não tem `DATABASE_URL`

**Solução:**
```bash
# Verificar se .env existe
ls -la .env

# Verificar se tem DATABASE_URL
grep DATABASE_URL .env

# Se não existir, criar
cp .env.example .env
# Editar .env e adicionar DATABASE_URL
```

### Erro: "Connection refused" ou "timeout"

**Causa:** URL do Neon incorreta ou projeto pausado

**Solução:**
1. Verificar se a URL está correta no Neon Console
2. Verificar se o projeto Neon está ativo (não pausado)
3. Verificar se `?sslmode=require` está no final da URL

### Erro: "relation 'deploys' does not exist"

**Causa:** Migrations não foram executadas

**Solução:**
```bash
# Executar migrations novamente
make migratedb
```

### Erro: "permission denied"

**Causa:** Credenciais incorretas ou usuário sem permissão

**Solução:**
1. Verificar se a `DATABASE_URL` está correta
2. Gerar nova connection string no Neon Console
3. Atualizar `.env` e Vercel com a nova URL

---

## ✅ Checklist Final

- [ ] Projeto Neon criado
- [ ] `DATABASE_URL` copiada
- [ ] `.env` criado com `DATABASE_URL`
- [ ] Migrations executadas com sucesso
- [ ] Tabelas `deploys` e `drafts` criadas
- [ ] `DATABASE_URL` configurada no Vercel
- [ ] Redeploy feito (se necessário)
- [ ] API routes testadas e funcionando

---

**Próximo passo:** Testar o Dashboard completo em produção! 🚀
