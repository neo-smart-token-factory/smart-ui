<template>
  <div class="min-h-screen flex flex-col">
    <div class="p-6 flex-1">
      <h1 class="text-3xl md:text-4xl font-headline font-extrabold mb-6 uppercase tracking-tight" style="color: var(--color-brand-primary);">Simulador – v0.5.1</h1>

      <div class="mt-6">
        <div class="p-6 rounded-xl text-sm whitespace-pre-wrap font-mono" style="background: var(--color-bg-elevated); color: var(--color-state-active); border: 1px solid var(--color-border-muted);">
          {{ simulation }}
        </div>
      </div>

      <div class="mt-6">
        <button @click="goBack">VOLTAR</button>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Footer from "~/components/Footer.vue";

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
/* Estilos aplicados via CSS variables e inline styles */
</style>

