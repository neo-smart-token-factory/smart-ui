// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: ["~/assets/tokens.css", "~/assets/main.css"],
  modules: ["@pinia/nuxt"],
  app: {
    head: {
      title: "NΞØ SMART FACTORY",
      meta: [
        { name: "theme-color", content: "#0E0E0E" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "A Fábrica Descentralizada de Protocolos do Futuro" }
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Space+Grotesk:wght@800;900&display=swap" }
      ]
    }
  },
  nitro: { 
    preset: "service-worker"
  }
});

