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

