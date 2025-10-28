<template>
  <div class="relative">
    <label for="cliente" class="block text-sm font-medium text-gray-700 mb-2">
      Cliente *
    </label>
    <div class="relative">
      <!-- Campo normal quando não está desabilitado -->
      <input
        v-if="!disabled"
        id="cliente"
        v-model="buscaCliente"
        type="text"
        class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 
          'pr-8': clienteSelecionado,
          'border-red-300 focus:ring-red-500 focus:border-red-500': erro,
          'border-gray-300': !erro
        }"
        :disabled="carregandoClientes"
        :placeholder="carregandoClientes ? 'Carregando clientes...' : 'Digite para buscar um cliente'"
        autocomplete="off"
        @focus="abrirDropdown"
        @blur="fecharDropdown"
        @keydown="navegarTeclado"
        required
      />
      <!-- Campo desabilitado -->
      <input
        v-else
        id="cliente"
        :value="clienteSelecionado?.nome || 'Nenhum cliente selecionado'"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
        disabled
        readonly
      />
      <!-- Botão para limpar seleção (apenas quando não está desabilitado) -->
      <button
        v-if="clienteSelecionado && !disabled"
        type="button"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        @click="limparSelecao"
      >
        ✕
      </button>
      
      <!-- Dropdown com lista de clientes (apenas quando não está desabilitado) -->
      <div
        v-if="dropdownAberto && !carregandoClientes && !disabled"
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
    <!-- Mensagem de erro para cliente -->
    <p v-if="erro" class="mt-1 text-sm text-red-600">
      {{ erro }}
    </p>
    <p v-else-if="!disabled" class="mt-2 text-sm text-gray-600">
      Não encontrou o cliente? 
      <NuxtLink 
        to="/clientes" 
        class="text-blue-600 hover:text-blue-800 underline"
      >
        Cadastrar novo cliente
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useProfissionais } from '~/composables/useProfissionais'
import type { AgCliente } from '~/types/database'

// Props
interface Props {
  modelValue?: string
  erro?: string
  clientePreSelecionado?: AgCliente | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  erro: '',
  clientePreSelecionado: null,
  disabled: false
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
    console.log('🔍 Carregando clientes...')
    
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

// Função pública para definir cliente
const definirCliente = (cliente: AgCliente | null) => {
  if (cliente) {
    clienteSelecionado.value = cliente
    buscaCliente.value = cliente.nome || ''
    emit('update:modelValue', cliente.id.toString())
    emit('cliente-selecionado', cliente)
  } else {
    resetar()
  }
}

// Expor função para o componente pai
defineExpose({
  resetar,
  definirCliente
})

// Watchers
watch(() => buscaCliente.value, filtrarClientes)

// Watcher para cliente pré-selecionado
watch(() => props.clientePreSelecionado, (novoCliente) => {
  if (novoCliente) {
    definirCliente(novoCliente)
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  carregarClientes()
})
</script>