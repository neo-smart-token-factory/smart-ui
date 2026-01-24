# 🔧 Correção de Problemas de Deploy Vercel

## ✅ Status dos Builds Locais

**Testado localmente:**
- ✅ Landing: Build funciona (`npm run build` em `landing/`)
- ✅ Mobile: Build funciona (`npm run build` em `nuxt-app/`)
- ✅ Dashboard: Deploy funcionou (simulation mode ativo)

**Problema:** Configuração do Root Directory no Vercel Dashboard

---

## 🐛 Problemas Identificados no Vercel

### 1. smart-ui-mobile ❌
```
Error: Could not read package.json: /vercel/path0/nuxt-app/package.json
```

**Causa:** Root Directory configurado incorretamente. O Vercel está procurando `nuxt-app/package.json` quando deveria procurar apenas `package.json` (já que o Root Directory é `nuxt-app`).

**Solução:** Verificar Root Directory no Vercel Dashboard

### 2. smart-ui-landing ❌
```
Error: Could not resolve entry module "index.html"
```

**Causa:** Vite não está encontrando o index.html. Já corrigido no código com `rollupOptions.input`.

**Solução:** Re-deploy após correções no código

---

## ✅ Soluções

### Problema 1: Mobile - package.json não encontrado

**Solução A: Verificar Root Directory no Vercel**

1. Vercel Dashboard → **smart-ui-mobile** → **Settings** → **General**
2. Verificar **Root Directory**: deve ser exatamente `nuxt-app` (sem barra, sem ponto)
3. Se estiver diferente, corrigir para `nuxt-app`

**Solução B: Adicionar vercel.json explícito**

O arquivo `nuxt-app/vercel.json` já existe, mas vamos garantir que está correto:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

**Solução C: Verificar se package.json existe**

Certifique-se de que `nuxt-app/package.json` existe e está commitado no Git.

---

### Problema 2: Landing - index.html não encontrado

**Solução A: Verificar Root Directory**

1. Vercel Dashboard → **smart-ui-landing** → **Settings** → **General**
2. Verificar **Root Directory**: deve ser exatamente `landing` (sem barra, sem ponto)
3. Se estiver diferente, corrigir para `landing`

**Solução B: Verificar vite.config.js**

O Vite precisa encontrar o `index.html` na raiz do Root Directory. Como o Root Directory é `landing`, ele deve encontrar `landing/index.html` automaticamente.

**Solução C: Adicionar build.rollupOptions.input explícito**

Se necessário, podemos adicionar ao `landing/vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: './index.html'  // Caminho relativo ao Root Directory
    }
  },
  server: {
    port: 3001,
    open: true
  }
});
```

---

## 🔍 Verificação Rápida

### Checklist Mobile

- [ ] Root Directory no Vercel: `nuxt-app` (exatamente isso)
- [ ] `nuxt-app/package.json` existe e está commitado
- [ ] `nuxt-app/index.html` existe
- [ ] `nuxt-app/vite.config.js` existe

### Checklist Landing

- [ ] Root Directory no Vercel: `landing` (exatamente isso)
- [ ] `landing/index.html` existe e está commitado
- [ ] `landing/package.json` existe
- [ ] `landing/vite.config.js` existe

---

## 🚀 Passos Imediatos

### 1. Verificar Root Directory no Vercel Dashboard

Para cada projeto:

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione o projeto
3. **Settings** → **General**
4. Verifique **Root Directory**:
   - Dashboard: `.` ou vazio
   - Landing: `landing`
   - Mobile: `nuxt-app`

### 2. Re-deploy Manual

Após corrigir Root Directory:

1. Vercel Dashboard → **Deployments**
2. Clique nos 3 pontos (⋯) do último deploy
3. **Redeploy**

Ou via CLI:
```bash
# Landing
cd landing
vercel --prod

# Mobile
cd nuxt-app
vercel --prod
```

---

## 📝 Configuração Correta Esperada

### Dashboard
```
Root Directory: . (ou vazio)
Build Command: npm run build
Output Directory: dist
```

### Landing
```
Root Directory: landing
Build Command: npm run build
Output Directory: dist
```

### Mobile
```
Root Directory: nuxt-app
Build Command: npm run build
Output Directory: dist
```

---

## ⚠️ Nota Importante

O Vercel executa os comandos **dentro do Root Directory**. Então:

- Se Root Directory = `landing`, ele executa `npm run build` dentro de `landing/`
- O Vite procura `index.html` na raiz do Root Directory (ou seja, `landing/index.html`)
- O `package.json` deve estar na raiz do Root Directory

Se os arquivos estão corretos mas ainda há erro, o problema é a configuração do Root Directory no Vercel Dashboard.

---

**Última atualização:** Janeiro 2026
