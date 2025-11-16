<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Simulador – v0.5.1</h1>

    <div class="mt-6">
      <div class="bg-black p-6 rounded-xl text-neo font-mono text-sm whitespace-pre-wrap">
        {{ simulation }}
      </div>
    </div>

    <div class="mt-6">
      <button @click="goBack">Voltar</button>
    </div>
  </div>
</template>

<script setup>
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
.text-neo {
  color: #0ff;
}
</style>

