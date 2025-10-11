<template>
  <div class="relative">
    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
    >
      <!-- Perfil Option -->
      <button
        @click="handleProfile"
        class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors duration-200"
      >
        <UserIcon class="w-5 h-5 text-gray-500" />
        <span>Perfil</span>
      </button>
      
      <!-- Divider -->
      <div class="border-t border-gray-200 my-1"></div>
      
      <!-- Sair Option -->
      <button
        @click="handleLogout"
        class="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-200"
      >
        <ArrowRightOnRectangleIcon class="w-5 h-5 text-red-500" />
        <span>Sair</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

// Props
interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  logout: []
}>()

// Handlers
const handleProfile = () => {
  // Por enquanto não faz nada, como solicitado
  console.log('Perfil clicado - funcionalidade será implementada futuramente')
  emit('close')
}

const handleLogout = () => {
  emit('logout')
  emit('close')
}
</script>