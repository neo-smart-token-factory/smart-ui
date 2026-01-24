# 🔧 Correção: installCommand não encontra package.json

## 🐛 Problema Identificado

**Erro:**

``
Error: Could not read package.json: /vercel/path1/package.json
Error: Command "npm install --no-workspaces" exited with 254
``

**Causa:**

- Quando especificamos `installCommand` no `vercel.json`, o Vercel pode executar **ANTES** de mudar para o Root Directory
- Ou pode estar ignorando o Root Directory ao executar o comando customizado
- O erro mostra que está procurando na raiz (`/vercel/path1/`) em vez do subdiretório

---

## ✅ Solução Aplicada

### Remover `installCommand` do vercel.json

**ANTES:**

```json
{
  "installCommand": "npm install --no-workspaces"
}
```

**DEPOIS:**

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

**Por quê?**

- O Vercel detecta automaticamente o package manager
- Quando o Root Directory está configurado, o Vercel **muda para lá primeiro**
- Depois executa `npm install` no diretório correto
- Com `installCommand` customizado, pode estar executando na raiz

---

## 🚀 Próximos Passos

1. **Commit e push** das mudanças
2. **Limpar cache** novamente (se necessário)
3. **Re-deploy** manual ou aguardar trigger automático

---

## 🔍 Como o Vercel Funciona com Root Directory

**Ordem de execução CORRETA:**

``
1.Vercel clona o repositório
2. Vercel muda para o Root Directory (landing/ ou nuxt-app/)
3. Vercel detecta package.json no diretório atual
4. Vercel executa npm install (padrão) no diretório correto
5. Vercel executa buildCommand
``

**Com installCommand customizado (PROBLEMA):**

``
1.Vercel clona o repositório
2. Vercel executa installCommand (pode estar na raiz ainda)
3. ❌ Erro: não encontra package.json
``

---

## ⚠️ Nota sobre Workspaces

Mesmo sem `--no-workspaces`, o Vercel deve funcionar porque:

- O Root Directory força o trabalho dentro do subdiretório
- O `package.json` local tem todas as dependências necessárias
- O npm install no subdiretório instala apenas as dependências locais

Se houver problemas com workspaces, podemos configurar no **Vercel Dashboard** (Settings → Build and Deployment → Install Command) em vez do `vercel.json`.

---

**Última atualização:** Janeiro 2026
