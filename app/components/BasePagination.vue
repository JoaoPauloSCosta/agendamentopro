<template>
  <div class="flex items-center justify-between bg-white px-4 py-3 sm:px-6 border-t border-gray-200">
    <!-- Informações da paginação -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="goToPrevious"
        :disabled="currentPage <= 1"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      <button
        @click="goToNext"
        :disabled="currentPage >= totalPages"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próximo
      </button>
    </div>
    
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <!-- Informações dos resultados -->
      <div>
        <p class="text-sm text-gray-700">
          Mostrando
          <span class="font-medium">{{ startItem }}</span>
          até
          <span class="font-medium">{{ endItem }}</span>
          de
          <span class="font-medium">{{ totalItems }}</span>
          resultados
        </p>
      </div>
      
      <!-- Navegação da paginação -->
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- Botão Anterior -->
          <button
            @click="goToPrevious"
            :disabled="currentPage <= 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Anterior</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          
          <!-- Números das páginas -->
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...'"
              @click="goToPage(page as number)"
              :class="[
                page === currentPage
                  ? 'relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
              ]"
            >
              {{ page }}
            </button>
            <span
              v-else
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
            >
              ...
            </span>
          </template>
          
          <!-- Botão Próximo -->
          <button
            @click="goToNext"
            :disabled="currentPage >= totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Próximo</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

interface Props {
  currentPage: number
  totalItems: number
  itemsPerPage?: number
  maxVisiblePages?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 10,
  maxVisiblePages: 7
})

const emit = defineEmits<{
  'page-change': [page: number]
}>()

// Computed properties
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const startItem = computed(() => {
  if (props.totalItems === 0) return 0
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  const end = props.currentPage * props.itemsPerPage
  return end > props.totalItems ? props.totalItems : end
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = props.currentPage
  const maxVisible = props.maxVisiblePages

  if (total <= maxVisible) {
    // Se o total de páginas é menor que o máximo visível, mostra todas
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Lógica para mostrar páginas com reticências
    const halfVisible = Math.floor(maxVisible / 2)
    
    if (current <= halfVisible + 1) {
      // Início: 1, 2, 3, 4, 5, ..., total
      for (let i = 1; i <= maxVisible - 2; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - halfVisible) {
      // Fim: 1, ..., total-4, total-3, total-2, total-1, total
      pages.push(1)
      pages.push('...')
      for (let i = total - (maxVisible - 3); i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Meio: 1, ..., current-1, current, current+1, ..., total
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

// Methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('page-change', page)
  }
}

const goToPrevious = () => {
  if (props.currentPage > 1) {
    goToPage(props.currentPage - 1)
  }
}

const goToNext = () => {
  if (props.currentPage < totalPages.value) {
    goToPage(props.currentPage + 1)
  }
}
</script>