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

