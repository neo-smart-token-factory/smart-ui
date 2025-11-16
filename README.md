# NΞØ SMART FACTORY — UI Components

Interface completa da NΞØ SMART FACTORY com Landing Page e PWA App.

## 📁 Estrutura

```
forge-ui/
├── landing/              # Landing Page (React + Vite + Tailwind)
│   ├── src/
│   │   ├── sections/
│   │   │   └── App.jsx  # Componente principal
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
│
└── nuxt-app/            # PWA App (Nuxt.js 3)
    ├── pages/
    │   ├── index.vue    # Formulário principal
    │   ├── simulator.vue
    │   └── preview.vue
    ├── components/
    │   └── TokenPreview.vue
    ├── assets/
    │   └── main.css
    └── package.json
```

## 🚀 Início Rápido

### Landing Page

```bash
cd landing
npm install
npm run dev
# Acesse http://localhost:3001
```

### PWA App

```bash
cd nuxt-app
npm install
npm run dev
# Acesse http://localhost:3000
```

## 🎨 Características

### Landing Page
- ✅ Design minimalista NΞØ
- ✅ React + Vite (performance)
- ✅ Tailwind CSS
- ✅ Totalmente responsivo
- ✅ Botão de lançamento para app

### PWA App
- ✅ Formulário completo de criação de tokens
- ✅ Preview de tokens
- ✅ Simulador de ecossistemas
- ✅ Deploy preview
- ✅ PWA-ready (Service Worker)
- ✅ Pronto para Web3

## 📦 Build

### Landing
```bash
cd landing
npm run build
npm run preview
```

### PWA
```bash
cd nuxt-app
npm run build
npm run preview
```

## 🔗 Integração

A landing page redireciona para o PWA app quando o botão "LAUNCH APP" é clicado.

Configure a URL no arquivo `landing/src/sections/App.jsx`:

```jsx
const launch = () => {
  window.location.href = "https://neo-smart-factory.app/";
};
```

## 🌐 Próximos Passos

- [ ] Integração Web3 (ethers.js)
- [ ] Conexão de wallet
- [ ] Deploy real de contratos
- [ ] Histórico de tokens
- [ ] Dashboard

---

**Versão**: v0.5.1 — IGNIÇÃO

