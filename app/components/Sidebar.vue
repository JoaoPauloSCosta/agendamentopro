<template>
  <aside 
    :class="['sidebar bg-white border-r border-gray-200 h-full flex flex-col shadow-lg', { 'collapsed': isCollapsed }]"
  >
    <!-- Cabeçalho da Sidebar -->
    <header class="sidebar-header p-6 border-b border-gray-200 bg-blue-600 relative">
      <div :class="['flex items-center justify-between', 'header-content']">
        <!-- Logo e título (apenas quando expandido) -->
        <div v-show="!isCollapsed" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <ClipboardDocumentListIcon class="w-6 h-6 text-white" />
          </div>
          <div class="transition-opacity duration-300">
            <h1 class="text-xl font-bold text-white">AgendaPro</h1>
            <p class="text-sm text-white/80">Sistema de Agendamentos</p>
          </div>
        </div>
        
        <!-- Botão de Toggle (integrado no header) -->
        <button
          @click="toggleSidebar"
          class="text-white hover:text-gray-200 transition-colors p-1"
        >
          <ChevronLeftIcon 
            v-if="!isCollapsed" 
            class="w-6 h-6" 
          />
          <ChevronRightIcon 
            v-if="isCollapsed" 
            class="w-6 h-6" 
          />
        </button>
      </div>
    </header>

    <!-- Conteúdo Principal da Sidebar -->
    <nav class="sidebar-content flex-1 p-4 overflow-y-auto">
      <div class="space-y-2">
        <!-- Botões de Navegação -->
        <div class="space-y-1">
          <BaseButton
            variant="ghost"
            size="md"
            :full-width="!isCollapsed"
            :class="[
              'text-blue-600 hover:bg-blue-50 transition-colors',
              isCollapsed ? 'justify-center px-2' : 'justify-start text-left'
            ]"
            @click="navigate('/')"
          >
            <template #iconLeft>
              <HomeIcon class="w-5 h-5 text-blue-600" />
            </template>
            <span v-show="!isCollapsed" class="button-text">Dashboard</span>
          </BaseButton>

          <BaseButton
            variant="ghost"
            size="md"
            :full-width="!isCollapsed"
            :class="[
              'text-blue-600 hover:bg-blue-50 transition-colors',
              isCollapsed ? 'justify-center px-2' : 'justify-start text-left'
            ]"
            @click="navigate('/agendamentos')"
          >
            <template #iconLeft>
              <CalendarDaysIcon class="w-5 h-5 text-blue-600" />
            </template>
            <span v-show="!isCollapsed" class="button-text">Agendamentos</span>
          </BaseButton>

          <BaseButton
            variant="ghost"
            size="md"
            :full-width="!isCollapsed"
            :class="[
              'text-blue-600 hover:bg-blue-50 transition-colors',
              isCollapsed ? 'justify-center px-2' : 'justify-start text-left'
            ]"
            @click="navigate('/clientes')"
          >
            <template #iconLeft>
              <UsersIcon class="w-5 h-5 text-blue-600" />
            </template>
            <span v-show="!isCollapsed" class="button-text">Clientes</span>
          </BaseButton>

          <BaseButton
            variant="ghost"
            size="md"
            :full-width="!isCollapsed"
            :class="[
              'text-blue-600 hover:bg-blue-50 transition-colors',
              isCollapsed ? 'justify-center px-2' : 'justify-start text-left'
            ]"
            @click="navigate('/profissionais')"
          >
            <template #iconLeft>
              <UserIcon class="w-5 h-5 text-blue-600" />
            </template>
            <span v-show="!isCollapsed" class="button-text">Profissionais</span>
          </BaseButton>

          <BaseButton
            variant="ghost"
            size="md"
            :full-width="!isCollapsed"
            :class="[
              'text-blue-600 hover:bg-blue-50 transition-colors',
              isCollapsed ? 'justify-center px-2' : 'justify-start text-left'
            ]"
            @click="navigate('/especialidades')"
          >
            <template #iconLeft>
              <BeakerIcon class="w-5 h-5 text-blue-600" />
            </template>
            <span v-show="!isCollapsed" class="button-text">Especialidades</span>
          </BaseButton>
        </div>
      </div>
    </nav>

    <!-- Rodapé da Sidebar -->
    <footer class="sidebar-footer p-4 border-t border-gray-200 bg-gray-50">
      <div :class="['space-y-3', 'footer-content']">
        <!-- Menu Dropdown Container -->
        <div class="relative">
          <!-- Botão de Configurações -->
          <BaseButton
            variant="ghost"
            size="md"
            :full-width="!isCollapsed"
            :class="[
              'text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors',
              isCollapsed ? 'justify-center px-2' : 'justify-between text-left'
            ]"
            @click="toggleDropdown"
          >
            <div class="flex items-center gap-3">
              <CogIcon class="w-5 h-5 text-gray-600" />
              <span v-show="!isCollapsed" class="button-text">Configurações</span>
            </div>
            <ChevronUpIcon 
              v-if="isDropdownOpen && !isCollapsed" 
              class="w-4 h-4 text-gray-500 transition-transform duration-200" 
            />
            <ChevronDownIcon 
              v-else-if="!isCollapsed" 
              class="w-4 h-4 text-gray-500 transition-transform duration-200" 
            />
          </BaseButton>

          <!-- Menu Dropdown -->
          <MenuDropdown
            :is-open="isDropdownOpen"
            @close="closeDropdown"
            @logout="handleLogout"
          />
        </div>

        <!-- Versão -->
        <div v-show="!isCollapsed" class="text-center">
          <p class="text-xs text-gray-400 button-text">v1.0.0</p>
        </div>
      </div>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  CalendarDaysIcon,
  UsersIcon,
  UserIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

// Estado do dropdown
const isDropdownOpen = ref(false)

// Estado de colapso da sidebar com persistência
const isCollapsed = ref(false)

// Função para carregar estado do localStorage
const loadSidebarState = () => {
  if (process.client) {
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      isCollapsed.value = JSON.parse(savedState)
    }
  }
}

// Função para salvar estado no localStorage
const saveSidebarState = (collapsed: boolean) => {
  if (process.client) {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed))
  }
}

// Composable de autenticação
const { logout } = useAuth()

// Funções de navegação
const navigate = async (path: string) => {
  console.log(`Navegando para: ${path}`)
  console.log(`Sidebar colapsado: ${isCollapsed.value}`)
  await navigateTo(path)
}

// Função para alternar colapso da sidebar
const toggleSidebar = () => {
  console.log(`Toggle sidebar - antes: ${isCollapsed.value}`)
  isCollapsed.value = !isCollapsed.value
  saveSidebarState(isCollapsed.value) // Salvar estado no localStorage
  console.log(`Toggle sidebar - depois: ${isCollapsed.value}`)
  // Fechar dropdown quando colapsar
  if (isCollapsed.value) {
    isDropdownOpen.value = false
  }
}

// Funções do dropdown
const toggleDropdown = () => {
  // Permitir abrir dropdown mesmo quando colapsado
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleLogout = async () => {
  try {
    await logout()
    console.log('Logout realizado com sucesso')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}

// Carregar estado da sidebar quando o componente for montado
onMounted(() => {
  loadSidebarState()
})

// Log de desenvolvimento
console.log('🎨 Componente Sidebar carregado!')
</script>

<style scoped>
.sidebar {
  width: 280px;
  min-width: 280px;
  transition: all 0.3s ease;
}

/* Sidebar colapsada */
.sidebar.collapsed {
  width: 80px;
  min-width: 80px;
}

/* Scroll customizado para a navegação */
.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 2px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

/* Animações suaves para botões */
.sidebar button {
  transition: all 0.2s ease;
}

/* Estilos para botões no modo colapsado */
.sidebar.collapsed button {
  justify-content: center;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Ocultar texto no modo colapsado */
.sidebar.collapsed .button-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
  transition: all 0.2s ease;
}

/* Mostrar texto no modo expandido */
.sidebar:not(.collapsed) .button-text {
  opacity: 1;
  width: auto;
  transition: all 0.2s ease;
}

/* Estilos para o header no modo colapsado */
.sidebar.collapsed .header-content {
  justify-content: center;
}

/* Estilos para o footer no modo colapsado */
.sidebar.collapsed .footer-content {
  justify-content: center;
}

/* Responsividade */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    min-width: 100%;
  }
}
</style>