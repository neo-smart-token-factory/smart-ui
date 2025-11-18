<template>
  <footer class="mt-auto px-6 py-6 opacity-40 border-t footer-border">
    <p class="text-sm font-headline uppercase tracking-tight">NΞØ Protocol — PATCH v0.5.1 IGNIÇÃO</p>
    <p class="mt-2 text-sm">
      <a 
        href="mailto:team@neosmartfactory.onchain" 
        class="footer-link"
      >
        team@neosmartfactory.onchain
      </a>
    </p>
  </footer>
</template>

<style scoped>
.footer-border {
  border-color: var(--color-border-muted);
}

.footer-link {
  color: var(--color-text-secondary);
  transition: color var(--motion-duration) var(--motion-easing);
  text-decoration: underline;
}

.footer-link:hover {
  color: var(--color-text-primary);
}
</style>

