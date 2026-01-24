# 🔄 Sincronizar Variáveis de Ambiente do Vercel

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Guia  
**Audiência:** DevOps

Guia para trazer todas as variáveis de ambiente configuradas no Vercel para o projeto local.

---

## 🚀 Método Rápido (Recomendado)

Use o comando do Makefile:

```bash
cd /Users/nettomello/CODIGOS/NEO\ SMART\ TOKEN/smart-ui
make sync-env
```

Isso irá:
1. ✅ Verificar se o projeto está linkado ao Vercel
2. ✅ Baixar todas as variáveis de ambiente do Vercel
3. ✅ Criar/atualizar o arquivo `.env` local
4. ✅ Preservar variáveis opcionais do `.env.example`

---

## 📋 Passo a Passo Manual

### 1. Verificar Autenticação no Vercel

```bash
vercel login
```

### 2. Linkar Projeto (se ainda não fez)

```bash
cd /Users/nettomello/CODIGOS/NEO\ SMART\ TOKEN/smart-ui
vercel link
```

- Escolha o projeto `smart-ui-dashboard`
- Aceite as configurações padrão

### 3. Sincronizar Variáveis

```bash
# Opção 1: Via Makefile (recomendado)
make sync-env

# Opção 2: Direto via script
./scripts/sync-env-from-vercel.sh
```

### 4. Revisar Arquivo .env

```bash
cat .env
```

O script criará um arquivo `.env` com:
- ✅ Todas as variáveis do Vercel (com valores reais)
- ✅ Variáveis opcionais do `.env.example` (com comentários)
- ✅ Header informativo

---

## 🔍 O Que o Script Faz

1. **Verifica link com Vercel**: Confirma que o projeto está linkado
2. **Baixa variáveis**: Usa `vercel env pull` para obter todas as variáveis
3. **Lista variáveis encontradas**: Mostra preview (sem valores sensíveis)
4. **Cria .env**: Gera arquivo `.env` local com todas as variáveis
5. **Preserva opcionais**: Mantém variáveis do `.env.example` que não estão no Vercel

---

## 📝 Exemplo de Saída

```
🔍 Sincronizando variáveis de ambiente do Vercel...

📦 Projeto Vercel: smart-ui-dashboard

📥 Baixando variáveis de ambiente do Vercel...
✅ 8 variável(is) encontrada(s) no Vercel

📋 Variáveis encontradas:
   ✓ DATABASE_URL
   ✓ VITE_CHAIN_ID
   ✓ VITE_RPC_URL
   ✓ VITE_ENABLE_WEB3
   ✓ NEXT_PUBLIC_APP_VERSION
   ✓ NEXT_PUBLIC_APP_CODENAME
   ✓ NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID
   ✓ NEXT_PUBLIC_SENTRY_DSN

📝 Criando arquivo .env...

✅ Arquivo .env criado com sucesso!

📝 Próximos passos:
   1. Revise o arquivo .env: cat .env
   2. Adicione variáveis faltantes manualmente se necessário
   3. Execute migrations: make migratedb
```

---

## ⚠️ Importante

### Segurança

- ✅ O arquivo `.env` está no `.gitignore` (não será commitado)
- ✅ Nunca compartilhe o arquivo `.env` publicamente
- ✅ Valores sensíveis (tokens, senhas) estão protegidos

### Sobrescrita

Se você já tem um arquivo `.env`:
- O script perguntará antes de sobrescrever
- Responda `s` para confirmar ou `N` para cancelar

### Variáveis Faltantes

Se alguma variável do `.env.example` não estiver no Vercel:
- Ela será adicionada ao `.env` com o valor padrão/comentário
- Você pode preenchê-la manualmente depois

---

## 🐛 Troubleshooting

### Erro: "Projeto não está linkado ao Vercel"

**Solução:**
```bash
vercel link
```

### Erro: "Erro ao baixar variáveis do Vercel"

**Causas possíveis:**
1. Não está autenticado: `vercel login`
2. Projeto não existe no Vercel: Crie o projeto primeiro
3. Sem permissão: Verifique acesso ao projeto

**Solução:**
```bash
vercel login
vercel link
make sync-env
```

### Variáveis não aparecem

**Verifique:**
1. As variáveis estão configuradas no Vercel?
   - Acesse: https://vercel.com → Seu projeto → Settings → Environment Variables
2. As variáveis estão marcadas para o ambiente correto?
   - Production, Preview, Development

---

## ✅ Checklist

Após sincronizar:

- [ ] Arquivo `.env` criado
- [ ] Variáveis do Vercel presentes
- [ ] Revisar valores (especialmente `DATABASE_URL`)
- [ ] Adicionar variáveis faltantes manualmente (se necessário)
- [ ] Testar conexão: `make migratedb` (se tiver DATABASE_URL)

---

## 🔗 Comandos Relacionados

```bash
# Sincronizar variáveis do Vercel
make sync-env

# Executar migrations (requer .env com DATABASE_URL)
make migratedb

# Executar migrations usando Vercel diretamente (sem .env)
make migratedb-vercel

# Desenvolvimento local com variáveis do Vercel
make dev-vercel
```

---

**Próximo passo:** Após sincronizar, você pode executar migrations ou iniciar o desenvolvimento local! 🚀
