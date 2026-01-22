<script setup>
import { onMounted, ref } from 'vue'
import { Rocket, Wallet } from 'lucide-vue-next'

const tg = window.Telegram?.WebApp
const user = ref(null)

onMounted(() => {
  if (tg) {
    tg.ready()
    tg.expand()
    user.value = tg.initDataUnsafe?.user
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8">
    
    <div class="relative w-24 h-24 mb-4">
      <div class="absolute inset-0 bg-[#d8f244] opacity-20 blur-xl rounded-full animate-pulse"></div>
      <Rocket class="w-full h-full text-[#d8f244] relative z-10" />
    </div>

    <div class="space-y-2">
      <h1 class="text-4xl font-bold tracking-tighter uppercase">NΞØ Mobile</h1>
      <p class="text-gray-400 text-sm">Your decentralized factory in your pocket.</p>
    </div>

    <div v-if="user" class="bg-white/5 border border-white/10 rounded-xl p-4 w-full max-w-xs">
      <p class="text-xs text-gray-500 uppercase font-bold mb-1">Welcome Operator</p>
      <p class="font-bold text-lg">{{ user.first_name }}</p>
    </div>

    <button 
      class="bg-[#d8f244] text-black font-bold py-4 px-8 rounded-xl w-full max-w-xs active:scale-95 transition-transform flex items-center justify-center gap-3"
    >
      <Wallet class="w-5 h-5" /> Connect Wallet
    </button>
  </div>
</template>
