<template>
  <div class="p-4 max-w-xl" style="background: var(--color-bg-surface); border: 1px solid var(--color-border-muted); border-radius: var(--radius-lg);">
    <h2 class="text-xl font-headline font-extrabold mb-4 uppercase tracking-tight" style="color: var(--color-brand-primary);">Preview do Token</h2>
    
    <div class="space-y-2">
      <p><b style="color: var(--color-state-active);">Nome:</b> {{ data.name }}</p>
      <p><b style="color: var(--color-state-active);">Símbolo:</b> {{ data.symbol }}</p>
      <p><b style="color: var(--color-state-active);">Supply Inicial:</b> {{ data.supply.toLocaleString() }}</p>
      <p><b style="color: var(--color-state-active);">Preço Fixo:</b> {{ data.price }} MATIC</p>
      <p><b style="color: var(--color-state-active);">Rede:</b> {{ data.network === 'polygon' ? 'Polygon Mainnet' : 'Polygon Amoy (Testnet)' }}</p>
      <p v-if="data.purpose" class="mt-4" style="color: var(--color-text-secondary);">
        <b style="color: var(--color-state-active);">Propósito:</b> {{ data.purpose }}
      </p>
    </div>

    <div class="mt-6 flex gap-4">
      <button @click="simular">SIMULAR ECOSSISTEMA</button>
      <button 
        @click="deployPreview" 
        style="background: var(--color-bg-elevated); color: var(--color-text-primary);"
        @mouseenter="$event.target.style.background = 'var(--color-bg-surface)'"
        @mouseleave="$event.target.style.background = 'var(--color-bg-elevated)'"
      >
        DEPLOY PREVIEW
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
/* Estilos aplicados via CSS variables e inline styles */
</style>

