<template>
  <NuxtLayout>
    <div class="p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Clientes</h1>
      
      <!-- Botão de adicionar -->
      <div class="mb-6 flex justify-end">
        <BaseButton
          label="Adicionar Cliente"
          variant="primary"
          size="md"
          :icon-left="PlusIcon"
          @click="adicionarCliente"
        />
      </div>
      
      <!-- Tabela de clientes -->
      <TabelaClientes 
        :clientes="clientes"
        :loading="loading"
        :error="error"
        :show-actions="true"
        @editar="editarCliente"
        @deletar="deletarCliente"
      />
      
      <!-- Modal de Confirmação de Exclusão -->
      <ModalConfirmacao
        :is-open="modalConfirmacaoAberto"
        title="Confirmar Exclusão"
        :message="`Tem certeza que deseja excluir o cliente '${clienteParaDeletar?.nome}'?`"
        :loading="deletandoCliente"
        @confirm="confirmarDelecao"
        @cancel="cancelarDelecao"
      />

      <!-- Modal de Cliente -->
      <ModalCliente
        :is-open="modalClienteAberto"
        :is-edicao="isEdicaoCliente"
        :cliente-id="clienteParaEditar?.id?.toString() || null"
        :cliente-data="clienteParaEditar"
        @close="fecharModalCliente"
        @save="salvarCliente"
        @cancel="fecharModalCliente"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { AgCliente } from '~/types/database'
import { PlusIcon } from '@heroicons/vue/24/outline'
import ModalConfirmacao from '~/components/ModalConfirmacao.vue'
import ModalCliente from '~/components/ModalCliente.vue'
import { useToast } from 'vue-toastification'

// Toast
const toast = useToast()

// Estado reativo
const clientes = ref<AgCliente[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Estado do modal de confirmação de exclusão
const modalConfirmacaoAberto = ref(false)
const clienteParaDeletar = ref<AgCliente | null>(null)
const deletandoCliente = ref(false)

// Estado do modal de cliente
const modalClienteAberto = ref(false)
const clienteParaEditar = ref<AgCliente | null>(null)
const isEdicaoCliente = ref(false)

// Composable
const { buscarClientes, deletarCliente: deletarClienteComposable } = useProfissionais()

// Função para carregar clientes
const carregarClientes = async () => {
  try {
    loading.value = true
    error.value = null
    clientes.value = await buscarClientes()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar clientes'
    console.error('Erro ao carregar clientes:', err)
  } finally {
    loading.value = false
  }
}

// Função para adicionar cliente
const adicionarCliente = () => {
  isEdicaoCliente.value = false
  clienteParaEditar.value = null
  modalClienteAberto.value = true
}

// Função para editar cliente
const editarCliente = (cliente: AgCliente) => {
  isEdicaoCliente.value = true
  clienteParaEditar.value = cliente
  modalClienteAberto.value = true
}

// Função para deletar cliente
const deletarCliente = (cliente: AgCliente) => {
  clienteParaDeletar.value = cliente
  modalConfirmacaoAberto.value = true
}

// Função para confirmar a exclusão
const confirmarDelecao = async () => {
  if (!clienteParaDeletar.value) return
  
  try {
    deletandoCliente.value = true
    
    const resultado = await deletarClienteComposable(clienteParaDeletar.value.id)
    
    if (resultado.success) {
      toast.success(resultado.message)
      // Recarregar a lista de clientes após deletar
      await carregarClientes()
      cancelarDelecao()
    } else {
      toast.error(resultado.message)
    }
  } catch (err) {
    toast.error('Erro ao deletar cliente')
    console.error('Erro ao deletar cliente:', err)
  } finally {
    deletandoCliente.value = false
  }
}

// Função para cancelar a exclusão
const cancelarDelecao = () => {
  modalConfirmacaoAberto.value = false
  clienteParaDeletar.value = null
}

// Funções do modal de cliente
const fecharModalCliente = () => {
  modalClienteAberto.value = false
  clienteParaEditar.value = null
  isEdicaoCliente.value = false
}

const salvarCliente = async (dadosCliente: any) => {
  // Recarregar a lista de clientes após salvar
  await carregarClientes()
  // Removido o toast daqui pois já é mostrado no modal
}

// Carregar dados ao montar o componente
onMounted(async () => {
  await carregarClientes()
})
</script>