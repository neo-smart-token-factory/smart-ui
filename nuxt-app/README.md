# NΞØ SMART FACTORY — PWA App

Aplicação PWA principal da NΞØ SMART FACTORY construída com Nuxt.js 3.

## 🚀 Início Rápido

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`

## 📦 Build

```bash
npm run build
npm run preview
```

## 🎯 Funcionalidades

- ✅ Formulário completo de criação de tokens
- ✅ Preview de tokens
- ✅ Simulador de ecossistemas
- ✅ Deploy preview
- ✅ PWA-ready (Service Worker)
- ✅ Pronto para integração Web3

## 📁 Estrutura

```
nuxt-app/
├── pages/
│   ├── index.vue        # Formulário principal
│   ├── simulator.vue    # Simulador
│   └── preview.vue      # Deploy preview
├── components/
│   └── TokenPreview.vue # Componente de preview
├── assets/
│   └── main.css         # Estilos globais
├── plugins/             # Plugins Nuxt
├── public/              # Assets estáticos
├── nuxt.config.ts       # Configuração Nuxt
└── package.json
```

## 🔧 Configuração

O app está configurado como:
- **SSR**: Desabilitado (SPA mode)
- **PWA**: Service Worker habilitado
- **State Management**: Pinia

## 🌐 Próximos Passos

- [ ] Integração com Web3 (ethers.js)
- [ ] Conexão de wallet (MetaMask, WalletConnect)
- [ ] Deploy real de contratos
- [ ] Histórico de tokens criados
- [ ] Dashboard de tokens

---

**Versão**: v0.5.1 — IGNIÇÃO

