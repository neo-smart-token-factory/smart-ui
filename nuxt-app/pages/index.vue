<template>
  <div class="min-h-screen flex flex-col">
    <div class="p-6 flex-1">
      <h1 class="text-3xl font-bold mb-6">Criar Token – PATCH v0.5.1</h1>

      <div class="mt-6 grid gap-4 max-w-xl">
        <input 
          v-model="form.name" 
          placeholder="Nome do Token" 
          required
        />
        <input 
          v-model="form.symbol" 
          placeholder="Símbolo" 
          maxlength="10"
          required
        />
        <input 
          v-model.number="form.supply" 
          type="number" 
          placeholder="Supply Inicial" 
          min="1"
          required
        />
        <input 
          v-model.number="form.price" 
          type="number" 
          step="0.001"
          placeholder="Preço Fixo (MATIC)" 
          min="0"
          required
        />

        <select v-model="form.network">
          <option value="polygon">Polygon</option>
          <option value="amoy">Polygon AMOY (testnet)</option>
        </select>

        <textarea 
          v-model="form.purpose" 
          rows="3" 
          placeholder="Propósito / Narrativa"
        ></textarea>

        <button @click="preview" :disabled="!isFormValid">
          Gerar Preview
        </button>
      </div>

      <TokenPreview v-if="showPreview" :data="form" class="mt-10" />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import TokenPreview from "~/components/TokenPreview.vue";
import Footer from "~/components/Footer.vue";

const form = ref({
  name: "",
  symbol: "",
  supply: 0,
  price: 0,
  network: "polygon",
  purpose: ""
});

const showPreview = ref(false);

const isFormValid = computed(() => {
  return form.value.name.length >= 2 &&
         form.value.symbol.length >= 2 &&
         form.value.supply > 0 &&
         form.value.price >= 0;
});

function preview() {
  if (isFormValid.value) {
    showPreview.value = true;
  }
}
</script>

<style scoped>
h1 {
  color: #0ff;
}
</style>

