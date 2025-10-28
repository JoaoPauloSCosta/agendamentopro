<template>
  <NuxtLayout>
    <div class="p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Administração</h1>
      
      <!-- Tabela de Usuários -->
      <TabelaAdmin />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Metadata da página
definePageMeta({
  title: 'Administração - AgendaPro',
  middleware: 'admin'
})

// SEO
useHead({
  title: 'Administração - AgendaPro',
  meta: [
    {
      name: 'description',
      content: 'Painel de administração do sistema AgendaPro.'
    }
  ]
})
</script>
