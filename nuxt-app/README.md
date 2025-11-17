

### PARTE 1: LANDING PAGE (React + Tailwind)

#### 1. `forge-ui/landing/package.json`
```json
{
  "name": "neo-smart-factory-landing",
  "version": "0.5.1",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

#### 2. `forge-ui/landing/vite.config.js`
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true
  }
});
```

#### 3. `forge-ui/landing/tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        neo: "#0ff",
        night: "#040404",
        zincsoft: "#cfcfcf"
      }
    }
  },
  plugins: []
};
```

#### 4. `forge-ui/landing/postcss.config.js`
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

#### 5. `forge-ui/landing/index.html`
```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>NΞØ SMART FACTORY</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="A Fábrica Descentralizada de Protocolos do Futuro" />
  </head>
  <body class="bg-night text-zincsoft">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### 6. `forge-ui/landing/src/main.jsx`
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './sections/App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### 7. `forge-ui/landing/src/styles.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

#### 8. `forge-ui/landing/src/sections/App.jsx`
```javascript
import React from "react";

export default function App() {
  const launch = () => {
    window.location.href = "https://neosmartfactory.onchain/"; // Nuxt PWA
  };

  return (
    <div className="w-full min-h-screen bg-night text-zincsoft">
      
      {/* HERO */}
      <section className="h-screen flex flex-col justify-center px-10">
        <h1 className="text-6xl font-bold tracking-tighter">
          NΞØ<br />SMART FACTORY
        </h1>

        <p className="mt-6 max-w-2xl text-xl opacity-80">
          A fábrica descentralizada que transforma intenção em protocolo.
          Crie tokens, contratos, dApps e economias em minutos.
        </p>

        <button
          onClick={launch}
          className="mt-10 px-10 py-4 bg-neo text-night font-bold text-lg rounded-lg hover:opacity-80 transition"
        >
          LAUNCH APP
        </button>
      </section>

      {/* FEATURES */}
      <section className="px-10 py-32 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            title: "Token Builder",
            desc: "Gere tokens completos com preço fixo, supply e manifesto."
          },
          {
            title: "Contract Factory",
            desc: "Templates auditados, seguros, e preparados para Polygon."
          },
          {
            title: "Rituais e Ecosistemas",
            desc: "Simule, valide e publique economias inteiras."
          }
        ].map((b, i) => (
          <div key={i} className="p-6 border border-zinc-800 rounded-xl">
            <h2 className="text-2xl font-bold">{b.title}</h2>
            <p className="mt-2 opacity-70">{b.desc}</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="px-10 pb-10 opacity-40">
        <p>NΞØ Protocol — PATCH v0.5.1 IGNIÇÃO</p>
      </footer>

    </div>
  );
}
```

---

### PARTE 2: PWA EM NUXT.JS

#### 9. `forge-ui/nuxt-app/package.json`
```json
{
  "name": "neo-smart-factory-app",
  "version": "0.5.1",
  "private": true,
  "scripts": {
    "dev": "nuxi dev",
    "build": "nuxi build",
    "preview": "nuxi preview"
  },
  "dependencies": {
    "nuxt": "^3.10.0",
    "@pinia/nuxt": "^0.5.0"
  },
  "devDependencies": {
    "@nuxt/devtools": "latest"
  }
}
```

#### 10. `forge-ui/nuxt-app/nuxt.config.ts`
```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: ["~/assets/main.css"],
  modules: ["@pinia/nuxt"],
  app: {
    head: {
      title: "NΞØ SMART FACTORY",
      meta: [
        { name: "theme-color", content: "#000000" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "A Fábrica Descentralizada de Protocolos do Futuro" }
      ]
    }
  },
  nitro: { 
    preset: "service-worker"
  }
});
```

#### 11. `forge-ui/nuxt-app/assets/main.css`
```css
body {
  background: #020202;
  color: #cecece;
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
}

input, select, textarea {
  background: #111;
  border: 1px solid #333;
  padding: 10px;
  border-radius: 6px;
  color: white;
  width: 100%;
  box-sizing: border-box;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #0ff;
}

button {
  background: #0ff;
  color: #000;
  font-weight: bold;
  padding: 12px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.8;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

#### 12. `forge-ui/nuxt-app/pages/index.vue`
```vue
<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Criar Token – PATCH v0.5.1</h1>

    <div class="mt-6 grid gap-4 max-w-xl">
      <input 
        v-model="form.name" 
        placeholder="Nome do Token" 
        required
      />
      <input 
        v-model="form.symbol" 
        placeholder="Símbolo" 
        maxlength="10"
        required
      />
      <input 
        v-model.number="form.supply" 
        type="number" 
        placeholder="Supply Inicial" 
        min="1"
        required
      />
      <input 
        v-model.number="form.price" 
        type="number" 
        step="0.001"
        placeholder="Preço Fixo (MATIC)" 
        min="0"
        required
      />

      <select v-model="form.network">
        <option value="polygon">Polygon</option>
        <option value="amoy">Polygon AMOY (testnet)</option>
      </select>

      <textarea 
        v-model="form.purpose" 
        rows="3" 
        placeholder="Propósito / Narrativa"
      ></textarea>

      <button @click="preview" :disabled="!isFormValid">
        Gerar Preview
      </button>
    </div>

    <TokenPreview v-if="showPreview" :data="form" class="mt-10" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import TokenPreview from "~/components/TokenPreview.vue";

const form = ref({
  name: "",
  symbol: "",
  supply: 0,
  price: 0,
  network: "polygon",
  purpose: ""
});

const showPreview = ref(false);

const isFormValid = computed(() => {
  return form.value.name.length >= 2 &&
         form.value.symbol.length >= 2 &&
         form.value.supply > 0 &&
         form.value.price >= 0;
});

function preview() {
  if (isFormValid.value) {
    showPreview.value = true;
  }
}
</script>

<style scoped>
h1 {
  color: #0ff;
}
</style>
```

#### 13. `forge-ui/nuxt-app/components/TokenPreview.vue`
```vue
<template>
  <div class="border border-zinc-700 p-4 rounded-xl max-w-xl">
    <h2 class="text-xl font-bold mb-4">Preview do Token</h2>
    
    <div class="space-y-2">
      <p><b>Nome:</b> {{ data.name }}</p>
      <p><b>Símbolo:</b> {{ data.symbol }}</p>
      <p><b>Supply Inicial:</b> {{ data.supply.toLocaleString() }}</p>
      <p><b>Preço Fixo:</b> {{ data.price }} MATIC</p>
      <p><b>Rede:</b> {{ data.network === 'polygon' ? 'Polygon Mainnet' : 'Polygon Amoy (Testnet)' }}</p>
      <p v-if="data.purpose" class="mt-4 opacity-70">
        <b>Propósito:</b> {{ data.purpose }}
      </p>
    </div>

    <div class="mt-6 flex gap-4">
      <button @click="simular">Simular Ecossistema</button>
      <button 
        @click="deployPreview" 
        class="bg-zinc-700 text-white hover:bg-zinc-600"
      >
        Deploy Preview
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["data"]);

function simular() {
  navigateTo({
    path: "/simulator",
    query: { data: encodeURIComponent(JSON.stringify(props.data)) }
  });
}

function deployPreview() {
  navigateTo({
    path: "/preview",
    query: { data: encodeURIComponent(JSON.stringify(props.data)) }
  });
}
</script>

<style scoped>
b {
  color: #0ff;
}
</style>
```

#### 14. `forge-ui/nuxt-app/pages/simulator.vue`
```vue
<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Simulador – v0.5.1</h1>

    <div class="mt-6">
      <div class="bg-black p-6 rounded-xl text-neo font-mono text-sm whitespace-pre-wrap">
        {{ simulation }}
      </div>
    </div>

    <div class="mt-6">
      <button @click="goBack">Voltar</button>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();

let data = {};
try {
  data = JSON.parse(decodeURIComponent(route.query.data || '{}'));
} catch (e) {
  data = {};
}

const simulation = computed(() => {
  const supplyValid = data.supply > 0;
  const priceValid = data.price >= 0;
  const nameValid = data.name && data.name.length >= 2;
  const symbolValid = data.symbol && data.symbol.length >= 2;

  return `
Token: ${data.name || 'N/A'}
Símbolo: ${data.symbol || 'N/A'}
Supply: ${data.supply?.toLocaleString() || '0'}
Preço Fixo: ${data.price || '0'} MATIC
Rede: ${data.network === 'polygon' ? 'Polygon Mainnet' : 'Polygon Amoy (Testnet)'}

Validação:
${supplyValid ? '✔ Supply válido' : '❌ Supply inválido'}
${priceValid ? '✔ Preço válido' : '❌ Preço inválido'}
${nameValid ? '✔ Nome válido' : '❌ Nome inválido'}
${symbolValid ? '✔ Símbolo válido' : '❌ Símbolo inválido'}

Status: ${supplyValid && priceValid && nameValid && symbolValid ? 'OK para deploy simulado' : 'REVISAR configurações'}
  `.trim();
});

function goBack() {
  navigateTo('/');
}
</script>

<style scoped>
.text-neo {
  color: #0ff;
}
</style>
```

#### 15. `forge-ui/nuxt-app/pages/preview.vue`
```vue
<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Deploy Preview</h1>
    
    <div v-if="tokenData" class="mt-6 max-w-xl">
      <div class="bg-zinc-900 p-6 rounded-xl mb-6">
        <h2 class="text-xl font-bold mb-4">Configuração do Token</h2>
        <div class="space-y-2">
          <p><b>Nome:</b> {{ tokenData.name }}</p>
          <p><b>Símbolo:</b> {{ tokenData.symbol }}</p>
          <p><b>Supply:</b> {{ tokenData.supply?.toLocaleString() }}</p>
          <p><b>Preço:</b> {{ tokenData.price }} MATIC</p>
          <p><b>Rede:</b> {{ tokenData.network === 'polygon' ? 'Polygon Mainnet' : 'Polygon Amoy' }}</p>
        </div>
      </div>

      <div class="bg-yellow-900/20 border border-yellow-700 p-4 rounded-xl mb-6">
        <p class="text-yellow-400">
          ⚠️ Conecte sua wallet (em breve) e siga para o deploy real.
        </p>
      </div>

      <div class="space-y-4">
        <button @click="simulate" class="w-full">
          Simular Novamente
        </button>
        <button @click="goBack" class="w-full bg-zinc-700 text-white hover:bg-zinc-600">
          Voltar ao Formulário
        </button>
      </div>
    </div>

    <div v-else class="mt-6">
      <p class="opacity-70">Nenhum dado de token encontrado.</p>
      <button @click="goBack" class="mt-4">Voltar</button>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();

let tokenData = null;
try {
  tokenData = JSON.parse(decodeURIComponent(route.query.data || '{}'));
} catch (e) {
  tokenData = null;
}

function simulate() {
  navigateTo({
    path: "/simulator",
    query: { data: encodeURIComponent(JSON.stringify(tokenData)) }
  });
}

function goBack() {
  navigateTo('/');
}
</script>

<style scoped>
b {
  color: #0ff;
}
</style>
```

---



**Versão**: v0.5.1 — IGNIÇÃO

