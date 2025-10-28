<template>
  <NuxtLayout>
    <div class="p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Administração</h1>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p class="text-gray-600">
          Página de administração do sistema.
        </p>
      </div>
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
