<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Loading state -->
    <div v-if="loading" class="p-6 text-center">
      <div class="text-gray-500">Carregando clientes...</div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-6 text-center">
      <div class="text-red-600">Erro ao carregar clientes: {{ error }}</div>
    </div>

    <!-- Table -->
    <div v-else-if="clientes.length > 0" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CPF
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Telefone
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Endereço
            </th>
            <th v-if="showActions" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="cliente in clientes" :key="cliente.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ cliente.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ cliente.nome || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ cliente.cpf || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ cliente.email || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ cliente.telefone || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ cliente.endereco || '-' }}
            </td>
            <td v-if="showActions" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div class="flex space-x-2">
                <!-- Botão Editar -->
                <button
                  type="button"
                  @click="$emit('editar', cliente)"
                  class="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                  title="Editar"
                >
                  <PencilIcon class="h-4 w-4" />
                </button>
                
                <!-- Botão Deletar -->
                <button
                  type="button"
                  @click="$emit('deletar', cliente)"
                  class="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                  title="Deletar"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-else class="p-6 text-center">
      <div class="text-gray-500">Nenhum cliente encontrado</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AgCliente } from '~/types/database'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

interface Props {
  clientes: AgCliente[]
  loading?: boolean
  error?: string | null
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  showActions: true
})

// Definir emits
const emit = defineEmits<{
  editar: [cliente: AgCliente]
  deletar: [cliente: AgCliente]
}>()
</script>