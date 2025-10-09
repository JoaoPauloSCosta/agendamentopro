<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Navigation -->
    <nav class="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">A</span>
            </div>
            <span class="text-xl font-bold text-gray-800">Agendamento</span>
          </div>
          <div class="hidden md:flex items-center space-x-6">
            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors">Início</a>
            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors">Recursos</a>
            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors">Contato</a>
            <button class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
              Entrar
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <div class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <span class="mr-2">🚀</span>
            Novo sistema de agendamento
          </div>
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Organize seus
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              compromissos
            </span>
            <br />
            de forma inteligente
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transforme a maneira como você gerencia seu tempo com nossa plataforma moderna, 
            intuitiva e repleta de recursos avançados para otimizar sua produtividade.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Começar Gratuitamente
            </button>
            <button class="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
              Ver Demonstração
            </button>
          </div>
        </div>
      </div>
      
      <!-- Floating Elements -->
      <div class="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-60 animate-bounce"></div>
      <div class="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-60 animate-pulse"></div>
      <div class="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-60 animate-ping"></div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recursos Poderosos
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra todas as funcionalidades que tornam nosso sistema único
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Agendamento Inteligente</h3>
            <p class="text-gray-600 leading-relaxed">
              Crie e gerencie compromissos com IA que sugere os melhores horários baseados na sua rotina.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM12 17H7l5 5v-5zM12 12l-5-5h5V2l5 5h-5v5z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Notificações Smart</h3>
            <p class="text-gray-600 leading-relaxed">
              Receba lembretes personalizados via email, SMS ou push notifications no momento certo.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2">
            <div class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Colaboração em Equipe</h3>
            <p class="text-gray-600 leading-relaxed">
              Compartilhe calendários, agende reuniões em grupo e sincronize com toda sua equipe.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div class="text-white">
            <div class="text-4xl md:text-5xl font-bold mb-2 counter" data-target="15000">15,000+</div>
            <div class="text-blue-100 text-lg">Usuários Ativos</div>
          </div>
          <div class="text-white">
            <div class="text-4xl md:text-5xl font-bold mb-2">500K+</div>
            <div class="text-blue-100 text-lg">Agendamentos</div>
          </div>
          <div class="text-white">
            <div class="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
            <div class="text-blue-100 text-lg">Uptime</div>
          </div>
          <div class="text-white">
            <div class="text-4xl md:text-5xl font-bold mb-2">4.9★</div>
            <div class="text-blue-100 text-lg">Avaliação</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Pronto para revolucionar sua agenda?
        </h2>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Junte-se a milhares de profissionais que já transformaram sua produtividade com nossa plataforma.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Começar Agora - Grátis
          </button>
          <p class="text-sm text-gray-500">Sem cartão de crédito • Teste por 14 dias</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">A</span>
              </div>
              <span class="text-xl font-bold">Agendamento</span>
            </div>
            <p class="text-gray-400">
              A plataforma mais avançada para gerenciamento de tempo e produtividade.
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Produto</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Recursos</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Preços</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Integrações</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Empresa</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Sobre</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Carreiras</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Suporte</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Ajuda</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contato</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Agendamento. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Configuração da página
useHead({
  title: 'Agendamento - Sistema Inteligente de Gestão de Tempo',
  meta: [
    { name: 'description', content: 'Transforme sua produtividade com nosso sistema avançado de agendamento e gestão de tempo.' }
  ]
})

// Dados reativos
const stats = reactive({
  users: 15000,
  appointments: 500000,
  uptime: 99.9,
  rating: 4.9
})

// Log de desenvolvimento
console.log('🎨 Página redesenhada com Tailwind CSS!')
console.log('📊 Stats:', stats)
</script>

<style scoped>
/* Animações customizadas */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Scroll suave */
html {
  scroll-behavior: smooth;
}
</style>