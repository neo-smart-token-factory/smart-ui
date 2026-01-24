# 📊 Acesso ao Gráfico do Ecossistema NEØ

**Guia rápido para visualizar o gráfico interativo após o deploy.**

---

## 🌐 URLs de Acesso

### Produção

Após o deploy no Vercel, o gráfico estará disponível em:

```
https://smart-ui-dashboard.vercel.app/ecosystem-graph.html
```

Ou, se você tiver um domínio customizado:

```
https://seu-dominio.com/ecosystem-graph.html
```

### Preview (Branches)

Para branches de preview:

```
https://smart-ui-dashboard-{branch}-{org}.vercel.app/ecosystem-graph.html
```

---

## 🚀 Acesso Local (Desenvolvimento)

### Opção 1: Servidor Vite (Recomendado)

```bash
# Na raiz do projeto
npm run dev

# Acesse:
http://localhost:3000/ecosystem-graph.html
```

### Opção 2: Abrir Diretamente

```bash
# Abrir no navegador
open ecosystem-graph.html

# Ou via Python
python3 -m http.server 8000
# Acesse: http://localhost:8000/ecosystem-graph.html
```

### Opção 3: Vercel Dev (com API routes)

```bash
npm run dev:vercel

# Acesse:
http://localhost:3000/ecosystem-graph.html
```

---

## ✅ Verificação Pós-Deploy

### 1. Verificar se o arquivo foi deployado

```bash
# Via curl
curl -I https://smart-ui-dashboard.vercel.app/ecosystem-graph.html

# Deve retornar:
# HTTP/2 200
# content-type: text/html
```

### 2. Verificar no Vercel Dashboard

1. Acesse [vercel.com](https://vercel.com)
2. Vá para o projeto `smart-ui-dashboard`
3. **Deployments** → Último deploy → **View Build Logs**
4. Verifique se `ecosystem-graph.html` está listado nos arquivos deployados

### 3. Testar Funcionalidades

Ao acessar o gráfico, verifique:

- ✅ Gráfico carrega e exibe nós
- ✅ Controles funcionam (Reset, Física, Centralizar)
- ✅ Clique em nós exibe informações
- ✅ Zoom e drag funcionam
- ✅ Legenda está visível

---

## 🔧 Troubleshooting

### Problema: 404 Not Found

**Causa:** Arquivo não foi incluído no build ou está em local incorreto.

**Solução:**

1. Verificar se o arquivo está na raiz do projeto:
   ```bash
   ls -la ecosystem-graph.html
   ```

2. Verificar `.vercelignore` (não deve ignorar o arquivo):
   ```bash
   cat .vercelignore
   # Se ecosystem-graph.html estiver listado, remova
   ```

3. Fazer redeploy:
   ```bash
   git add ecosystem-graph.html
   git commit -m "fix: ensure ecosystem-graph.html is deployed"
   git push
   ```

### Problema: D3.js não carrega

**Causa:** CDN bloqueada ou conexão offline.

**Solução:**

1. Verificar console do navegador (F12)
2. Se CDN estiver bloqueada, usar versão local:
   - Baixar D3.js e colocar em `public/d3.min.js`
   - Atualizar referência no HTML:
     ```html
     <script src="/d3.min.js"></script>
     ```

### Problema: Gráfico não renderiza

**Causa:** Erro JavaScript ou dados inválidos.

**Solução:**

1. Abrir Console do navegador (F12)
2. Verificar erros JavaScript
3. Verificar se `data` está definido corretamente no código

---

## 📝 Notas Importantes

### SEO

O arquivo está configurado para **não ser indexado**:

```html
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
```

Isso significa que:
- ✅ Não aparecerá em buscas do Google
- ✅ Pode ser acessado diretamente via URL
- ✅ Ideal para visualização interna da arquitetura

### Segurança

O gráfico é **público** (não requer autenticação). Se precisar proteger:

1. Adicionar autenticação no Vercel (Password Protection)
2. Ou mover para rota protegida via middleware

### Performance

- **Tamanho:** ~15KB (HTML + CSS + JS inline)
- **Dependências:** D3.js via CDN (~250KB)
- **Carregamento:** Instantâneo após D3.js carregar

---

## 🔗 Links Rápidos

- **Produção:** `https://smart-ui-dashboard.vercel.app/ecosystem-graph.html`
- **Local Dev:** `http://localhost:3000/ecosystem-graph.html`
- **Repositório:** `github.com/neo-smart-token-factory/smart-ui`

---

## 📚 Documentação Relacionada

- [ARCHITECTURE_WORKFLOWS_AND_DEPLOYMENT.md](./ARCHITECTURE_WORKFLOWS_AND_DEPLOYMENT.md) - Arquitetura completa
- [DEPLOY_DASHBOARD.md](./DEPLOY_DASHBOARD.md) - Guia de deploy
- [ECOSYSTEM_GRAPH_AUDIT.md](../ECOSYSTEM_GRAPH_AUDIT.md) - Auditoria do gráfico

---

**Última atualização:** Janeiro 2026
