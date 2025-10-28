<template>
  <div class="relative">
    <label for="cliente-filtro" class="block text-sm font-medium text-gray-700 mb-2">
      Cliente
    </label>
    <div class="relative">
      <input
        id="cliente-filtro"
        v-model="buscaCliente"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'pr-8': clienteSelecionado }"
        :disabled="carregandoClientes"
        :placeholder="carregandoClientes ? 'Carregando clientes...' : 'Todos os clientes'"
        autocomplete="off"
        @focus="abrirDropdown"
        @blur="fecharDropdown"
        @keydown="navegarTeclado"
      />
      
      <!-- Botão para limpar seleção -->
      <button
        v-if="clienteSelecionado"
        type="button"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        @click="limparSelecao"
      >
        ✕
      </button>
      
      <!-- Dropdown com lista de clientes -->
      <div
        v-if="dropdownAberto && !carregandoClientes"
        class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
      >
        <div
          v-if="clientesFiltrados.length === 0"
          class="px-3 py-2 text-gray-500 text-sm"
        >
          Nenhum cliente encontrado
        </div>
        <button
          v-for="(cliente, index) in clientesFiltrados"
          :key="cliente.id"
          type="button"
          :class="[
            'w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm',
            index === indiceSelecionado ? 'bg-blue-100' : ''
          ]"
          @click="selecionarCliente(cliente)"
        >
          {{ cliente.nome }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useProfissionais } from '~/composables/useProfissionais'
import type { AgCliente } from '~/types/database'

// Props
interface Props {
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
})

// Emits
interface Emits {
  'update:modelValue': [value: string]
  'cliente-selecionado': [cliente: AgCliente | null]
}

const emit = defineEmits<Emits>()

// Composables
const { buscarClientes } = useProfissionais()

// Estado reativo
const clientes = ref<AgCliente[]>([])
const carregandoClientes = ref(false)
const clientesFiltrados = ref<AgCliente[]>([])
const buscaCliente = ref('')
const dropdownAberto = ref(false)
const clienteSelecionado = ref<AgCliente | null>(null)
const indiceSelecionado = ref(-1)

// Função para carregar clientes
const carregarClientes = async () => {
  try {
    carregandoClientes.value = true
    console.log('🔍 Carregando clientes para filtro...')
    
    const clientesData = await buscarClientes()
    clientes.value = clientesData
    clientesFiltrados.value = clientesData
    
    console.log('✅ Clientes carregados:', clientesData.length)
  } catch (error) {
    console.error('❌ Erro ao carregar clientes:', error)
    clientes.value = []
    clientesFiltrados.value = []
  } finally {
    carregandoClientes.value = false
  }
}

// Funções do dropdown pesquisável
const filtrarClientes = () => {
  if (!buscaCliente.value.trim()) {
    clientesFiltrados.value = clientes.value
  } else {
    const termo = buscaCliente.value.toLowerCase()
    clientesFiltrados.value = clientes.value.filter(cliente =>
      cliente.nome?.toLowerCase().includes(termo)
    )
  }
}

const selecionarCliente = (cliente: AgCliente) => {
  clienteSelecionado.value = cliente
  emit('update:modelValue', cliente.id.toString())
  emit('cliente-selecionado', cliente)
  buscaCliente.value = cliente.nome || ''
  dropdownAberto.value = false
}

const abrirDropdown = () => {
  dropdownAberto.value = true
  indiceSelecionado.value = -1
  filtrarClientes()
}

const fecharDropdown = () => {
  setTimeout(() => {
    dropdownAberto.value = false
    indiceSelecionado.value = -1
  }, 200) // Delay para permitir clique nos itens
}

const limparSelecao = () => {
  clienteSelecionado.value = null
  emit('update:modelValue', '')
  emit('cliente-selecionado', null)
  buscaCliente.value = ''
  indiceSelecionado.value = -1
  filtrarClientes()
}

// Navegação por teclado
const navegarTeclado = (event: KeyboardEvent) => {
  if (!dropdownAberto.value || clientesFiltrados.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      indiceSelecionado.value = Math.min(
        indiceSelecionado.value + 1,
        clientesFiltrados.value.length - 1
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      indiceSelecionado.value = Math.max(indiceSelecionado.value - 1, 0)
      break
    case 'Enter':
      event.preventDefault()
      if (indiceSelecionado.value >= 0 && indiceSelecionado.value < clientesFiltrados.value.length) {
        selecionarCliente(clientesFiltrados.value[indiceSelecionado.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      fecharDropdown()
      break
  }
}

// Função pública para resetar o componente
const resetar = () => {
  clienteSelecionado.value = null
  buscaCliente.value = ''
  indiceSelecionado.value = -1
  filtrarClientes()
}

// Expor função para o componente pai
defineExpose({
  resetar
})

// Watchers
watch(() => buscaCliente.value, filtrarClientes)

// Lifecycle
onMounted(() => {
  carregarClientes()
})
</script>
