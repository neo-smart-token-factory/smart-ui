# 🔧 Solução: Cache + Workspaces no Vercel

## ✅ Confirmação

Você está **100% correto**:
- ✅ Root Directory do Landing = `landing` (correto)
- ✅ Root Directory do Mobile = `nuxt-app` (correto)

O problema é **cache + workspaces do npm**!

---

## 🐛 Problema Real Identificado

### Workspaces do npm

O projeto usa **npm workspaces**:
```json
{
  "workspaces": ["landing", "nuxt-app", "packages/*"]
}
```

**O que acontece:**
1. Quando você roda `npm install` na raiz, ele instala **todos** os workspaces
2. O `package-lock.json` fica na **raiz**, não nos subdiretórios
3. Quando o Vercel muda para `landing/` ou `nuxt-app/`, ele não encontra o `package-lock.json`
4. Tenta instalar novamente, mas pode estar confuso com a estrutura de workspaces

### Cache do Vercel

O Vercel pode ter cache de:
- Estrutura de diretórios antiga
- Dependências instaladas incorretamente
- Build artifacts antigos

---

## ✅ Soluções Aplicadas

### 1. Install Command Atualizado

**Mudança nos vercel.json:**

**ANTES:**
```json
{
  "installCommand": "npm install"
}
```

**DEPOIS:**
```json
{
  "installCommand": "npm install --no-workspaces"
}
```

**Por quê?**
- `--no-workspaces` força o npm a instalar **apenas** as dependências do `package.json` local
- Ignora os workspaces da raiz
- Cada projeto instala suas próprias dependências independentemente

### 2. Limpar Cache (SUA SUGESTÃO - CORRETA!)

**No Vercel Dashboard:**

1. **smart-ui-landing:**
   - Settings → **Caches**
   - Clique em **"Clear All Caches"** ou **"Purge Cache"**

2. **smart-ui-mobile:**
   - Settings → **Caches**
   - Clique em **"Clear All Caches"** ou **"Purge Cache"**

**Por quê limpar cache?**
- Remove cache de estrutura antiga
- Remove cache de dependências
- Força rebuild completo e limpo

---

## 🚀 Passos para Resolver

### Passo 1: Limpar Cache (FAÇA AGORA)

**Vercel Dashboard:**
1. Acesse cada projeto
2. Settings → **Caches**
3. **Clear All Caches**

### Passo 2: Desabilitar "Include files outside root directory"

**Nas imagens você mostrou que está ENABLED. Desabilite:**

1. Settings → Build and Deployment
2. Role até **Root Directory**
3. **Desabilite** "Include files outside the root directory in the Build Step"
4. Salve para ambos projetos

**Por quê?**
- Com workspaces, isso pode fazer o Vercel procurar na raiz
- Desabilitar força trabalho apenas dentro do Root Directory

### Passo 3: Commit e Push das Correções

As correções já foram aplicadas nos `vercel.json`:
- ✅ `installCommand: "npm install --no-workspaces"`

**Próximo:** Fazer commit e push

### Passo 4: Re-deploy

Após limpar cache e fazer push:
1. Vercel vai detectar o push automaticamente
2. Ou faça Redeploy manual no Dashboard

---

## 📋 Checklist Completo

- [ ] Limpar cache do smart-ui-landing
- [ ] Limpar cache do smart-ui-mobile
- [ ] Desabilitar "Include files outside root directory" (ambos)
- [ ] Verificar que vercel.json tem `--no-workspaces`
- [ ] Commit e push das correções
- [ ] Aguardar deploy automático ou fazer Redeploy manual

---

## 🔍 Por Que `--no-workspaces` Funciona?

**Sem `--no-workspaces`:**
```
1. Vercel muda para landing/
2. Roda npm install
3. npm detecta workspaces na raiz
4. Tenta instalar tudo (raiz + landing + nuxt-app)
5. Confusão com estrutura
```

**Com `--no-workspaces`:**
```
1. Vercel muda para landing/
2. Roda npm install --no-workspaces
3. npm instala APENAS dependências de landing/package.json
4. Ignora workspaces da raiz
5. Build funciona normalmente
```

---

## ⚠️ Nota Importante

O `package-lock.json` está na **raiz** do repositório (comum em workspaces).

**Isso é normal e correto!** O `--no-workspaces` faz o npm trabalhar apenas com o `package.json` local, sem precisar do lock file da raiz.

---

**Última atualização:** Janeiro 2026
