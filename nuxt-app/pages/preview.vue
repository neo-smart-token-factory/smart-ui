<template>
  <div class="min-h-screen flex flex-col">
    <div class="p-6 flex-1">
      <h1 class="text-3xl md:text-4xl font-headline font-extrabold mb-6 uppercase tracking-tight" style="color: var(--color-brand-primary);">Deploy Preview</h1>
      
      <div v-if="tokenData" class="mt-6 max-w-xl">
        <div class="p-6 mb-6" style="background: var(--color-bg-surface); border: 1px solid var(--color-border-muted); border-radius: var(--radius-lg);">
          <h2 class="text-xl font-headline font-extrabold mb-4 uppercase tracking-tight" style="color: var(--color-brand-primary);">Configuração do Token</h2>
          <div class="space-y-2">
            <p><b style="color: var(--color-state-active);">Nome:</b> {{ tokenData.name }}</p>
            <p><b style="color: var(--color-state-active);">Símbolo:</b> {{ tokenData.symbol }}</p>
            <p><b style="color: var(--color-state-active);">Supply:</b> {{ tokenData.supply?.toLocaleString() }}</p>
            <p><b style="color: var(--color-state-active);">Preço:</b> {{ tokenData.price }} MATIC</p>
            <p><b style="color: var(--color-state-active);">Rede:</b> {{ tokenData.network === 'polygon' ? 'Polygon Mainnet' : 'Polygon Amoy' }}</p>
          </div>
        </div>

        <div class="p-4 mb-6" style="background: color-mix(in oklab, var(--color-state-warning) 20%, transparent); border: 1px solid var(--color-state-warning); border-radius: var(--radius-lg);">
          <p style="color: var(--color-state-warning);">
            ⚠️ Conecte sua wallet (em breve) e siga para o deploy real.
          </p>
        </div>

        <div class="space-y-4">
          <button @click="simulate" class="w-full">
            SIMULAR NOVAMENTE
          </button>
          <button @click="goBack" class="w-full" style="background: var(--color-bg-elevated); color: var(--color-text-primary);"
            @mouseenter="$event.target.style.background = 'var(--color-bg-surface)'"
            @mouseleave="$event.target.style.background = 'var(--color-bg-elevated)'">
            VOLTAR AO FORMULÁRIO
          </button>
        </div>
      </div>

      <div v-else class="mt-6">
        <p style="color: var(--color-text-secondary);">Nenhum dado de token encontrado.</p>
        <button @click="goBack" class="mt-4">VOLTAR</button>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Footer from "~/components/Footer.vue";

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
/* Estilos aplicados via CSS variables e inline styles */
</style>

