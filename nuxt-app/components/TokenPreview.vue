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

