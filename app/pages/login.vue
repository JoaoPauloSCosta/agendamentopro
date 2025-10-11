<template>
  <div class="min-h-screen bg-gradient-secondary flex">
    <!-- Coluna Esquerda - Formulário -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- Header Mobile (visível apenas em telas pequenas) -->
        <div class="lg:hidden text-center mb-8">
          <div class="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-3-4.5h-12m12 0v4.5m-12-4.5v4.5" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-neutral-900 mb-1">
            AgendaPro
          </h1>
          <p class="text-neutral-600">
            Sistema de Agendamentos
          </p>
        </div>

        <!-- Componente do Formulário -->
        <FormularioLogin />

        <!-- Footer -->
        <div class="mt-8 text-center text-sm text-neutral-500">
          <p>
            © 2024 AgendaPro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>

    <!-- Coluna Direita - Branding/Informações -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-primary items-center justify-center p-12">
      <div class="max-w-md text-center text-white">
        <!-- Logo/Nome da Empresa -->
        <div class="mb-8">
          <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-3-4.5h-12m12 0v4.5m-12-4.5v4.5" />
            </svg>
          </div>
          <h1 class="text-4xl font-bold mb-2">
            AgendaPro
          </h1>
          <p class="text-xl text-white/90">
            Sistema de Agendamentos
          </p>
        </div>

        <!-- Frase Motivacional -->
        <div class="space-y-6">
          <blockquote class="text-lg leading-relaxed text-white/95">
            "Simplifique seus agendamentos e otimize seu tempo. 
            Gerencie compromissos de forma inteligente e eficiente."
          </blockquote>
          
          <!-- Features -->
          <div class="space-y-4 text-left">
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-white rounded-full"></div>
              <span class="text-white/90">Agendamentos em tempo real</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-white rounded-full"></div>
              <span class="text-white/90">Notificações automáticas</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-white rounded-full"></div>
              <span class="text-white/90">Relatórios detalhados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configurações da página
definePageMeta({
  layout: false, // Remove o layout padrão para ter controle total
  title: 'Login - AgendaPro'
})

// SEO
useHead({
  title: 'Login - AgendaPro',
  meta: [
    {
      name: 'description',
      content: 'Faça login no AgendaPro para gerenciar seus agendamentos de forma inteligente e eficiente.'
    }
  ]
})
</script>

<style scoped>
/* Animações suaves para a página */
.min-h-screen {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsividade adicional se necessário */
@media (max-width: 1023px) {
  .min-h-screen {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }
}
</style>