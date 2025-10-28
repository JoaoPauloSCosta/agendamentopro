<template>
  <div class="app-layout min-h-screen bg-gray-50">
    <!-- Layout Principal -->
    <div class="flex h-screen">
      <!-- Sidebar -->
      <div class="sidebar-container flex-shrink-0">
        <Sidebar />
      </div>

      <!-- Área Principal -->
      <main class="main-content flex-1 overflow-hidden p-6 h-full">
        <!-- Slot para o conteúdo da página -->
        <div class="h-full">
          <slot>
          <!-- Conteúdo padrão caso não haja slot -->
          <div class="text-center py-12">
            <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Conteúdo da Página</h3>
            <p class="text-gray-500">O conteúdo da página será exibido aqui.</p>
          </div>
          </slot>
        </div>
      </main>
    </div>

    <!-- Overlay para mobile quando sidebar está aberta -->
    <div
      v-if="sidebarOpen"
      @click="closeSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
    ></div>
  </div>
</template>

<script setup lang="ts">
// Estado da sidebar (para mobile)
const sidebarOpen = ref(false)

// Funções para controlar a sidebar
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

// Fechar sidebar quando a tela for redimensionada para desktop
const handleResize = () => {
  if (window.innerWidth >= 768) {
    sidebarOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

</script>

<style scoped>
/* Layout responsivo */
.app-layout {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Sidebar responsiva */
.sidebar-container {
  position: relative;
  z-index: 50;
}

/* Mobile: sidebar como overlay */
@media (max-width: 767px) {
  .sidebar-container {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar-container.open {
    transform: translateX(0);
  }
}

/* Desktop: sidebar fixa */
@media (min-width: 768px) {
  .sidebar-container {
    position: static;
    transform: none;
  }
}

/* Scroll customizado */
.main-body::-webkit-scrollbar {
  width: 8px;
}

.main-body::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.main-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.main-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animações suaves */
.main-content {
  transition: all 0.3s ease;
}

/* Sombras e elevações */
.main-header {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.main-footer {
  box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.1), 0 -1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Estados de hover e focus */
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Responsividade adicional */
@media (max-width: 640px) {
  .main-body {
    padding: 1rem;
  }
  
  .main-header {
    padding: 1rem;
  }
  
  .main-footer {
    padding: 1rem;
  }
}
</style>