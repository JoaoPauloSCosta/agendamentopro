<template>
  <BaseModal
    :is-open="isOpen"
    :title="modalTitle"
    :icon="UserIcon"
    icon-variant="info"
    size="md"
    :loading="loading"
    :confirm-disabled="!isFormValid"
    confirm-text="Salvar"
    cancel-text="Cancelar"
    @close="handleClose"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #content>
      <form @submit.prevent="handleConfirm" class="space-y-4">
        <!-- Dropdown de Perfil -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Perfil do Usuário
          </label>
          <select
            v-model="form.perfilId"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :disabled="loading"
            required
          >
            <option value="">Selecione um perfil</option>
            <option 
              v-for="perfil in perfis" 
              :key="perfil.id" 
              :value="perfil.id"
            >
              {{ perfil.nome }}
            </option>
          </select>
          <p v-if="errors.perfilId" class="mt-1 text-sm text-red-600">
            {{ errors.perfilId }}
          </p>
        </div>

        <!-- Dropdown de Especialidade -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Especialidade
          </label>
          <select
            v-model="form.especialidadeId"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :disabled="loading"
            required
          >
            <option value="">Selecione uma especialidade</option>
            <option 
              v-for="especialidade in especialidades" 
              :key="especialidade.id" 
              :value="especialidade.id"
            >
              {{ especialidade.nome }}
            </option>
          </select>
          <p v-if="errors.especialidadeId" class="mt-1 text-sm text-red-600">
            {{ errors.especialidadeId }}
          </p>
        </div>
      </form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from 'vue'
import { UserIcon } from '@heroicons/vue/24/outline'
import BaseModal from './BaseModal.vue'
import type { AgPerfil, AgEspecialidade } from '~/types/database'

const toast = useNuxtApp().$toast

interface Props {
  isOpen?: boolean
  isEdicao?: boolean
  profissionalId?: number | null
  loading?: boolean
  perfis?: AgPerfil[]
  especialidades?: AgEspecialidade[]
  profissionalData?: {
    profissional_id: number
    profile_id: number
    especialidade_id: number
    nome_profissional: string
  } | null
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  isEdicao: false,
  profissionalId: null,
  loading: false,
  perfis: () => [],
  especialidades: () => [],
  profissionalData: null
})

interface Emits {
  close: []
  save: [data: ProfissionalFormData]
  cancel: []
}

const emit = defineEmits<Emits>()

// Composable
const { inserirProfissional, editarProfissional } = useProfissionais()

// Tipos
interface ProfissionalFormData {
  perfilId: number | string
  especialidadeId: number | string
}

interface FormErrors {
  perfilId?: string
  especialidadeId?: string
}

// Estado do formulário
const form = ref<ProfissionalFormData>({
  perfilId: '',
  especialidadeId: ''
})

const errors = reactive<FormErrors>({})

// Computed
const modalTitle = computed(() => {
  return props.isEdicao ? 'Editar Profissional' : 'Novo Profissional'
})

const isFormValid = computed(() => {
  if (!form.value?.perfilId || !form.value?.especialidadeId) return false
  if (!errors || typeof errors !== 'object') return true
  return Object.keys(errors).length === 0
})

// Validação do formulário
const validateForm = (): boolean => {
  // Limpar errors existentes
  Object.keys(errors).forEach(key => delete errors[key])

  // Validar perfil
  if (!form.value?.perfilId) {
    errors.perfilId = 'Perfil é obrigatório'
  }

  // Validar especialidade
  if (!form.value?.especialidadeId) {
    errors.especialidadeId = 'Especialidade é obrigatória'
  }

  return Object.keys(errors).length === 0
}

// Função para resetar o formulário
const resetForm = () => {
  form.value = {
    perfilId: '',
    especialidadeId: ''
  }
  // Garantir que errors seja reinicializado corretamente
  Object.keys(errors).forEach(key => delete errors[key])
}

// Event handlers
const handleClose = () => {
  resetForm()
  emit('close')
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const handleConfirm = async () => {
  if (!validateForm()) {
    return
  }

  try {
    if (props.isEdicao) {
      // Modo edição - chama a função de editar profissional
      if (!props.profissionalData?.profissional_id) {
        toast.error('ID do profissional não encontrado', {
          timeout: 4000
        })
        return
      }

      const resultado = await editarProfissional(
        props.profissionalData.profissional_id,
        Number(form.value.perfilId),
        Number(form.value.especialidadeId)
      )

      if (resultado.success) {
        toast.success(resultado.message, {
          timeout: 4000
        })
        
        // Emite evento para atualizar a tabela
        emit('save', {
          perfilId: Number(form.value.perfilId),
          especialidadeId: Number(form.value.especialidadeId)
        })
      } else {
        toast.error(resultado.message, {
          timeout: 4000
        })
        return // Não fecha o modal em caso de erro
      }
    } else {
      // Modo criação - chama a função de inserir profissional
      const resultado = await inserirProfissional(
        Number(form.value.perfilId),
        Number(form.value.especialidadeId)
      )

      if (resultado.success) {
        toast.success(resultado.message, {
          timeout: 4000
        })
        
        // Emite evento para atualizar a tabela
        emit('save', {
          perfilId: Number(form.value.perfilId),
          especialidadeId: Number(form.value.especialidadeId)
        })
      } else {
        toast.error(resultado.message, {
          timeout: 4000
        })
        return // Não fecha o modal em caso de erro
      }
    }
    
    resetForm()
    emit('close')
  } catch (error: any) {
    console.error('Erro ao salvar profissional:', error)
    const errorMessage = String(error?.message || 'Erro interno. Tente novamente.')
    
    toast.error(errorMessage, {
      timeout: 4000
    })
  }
}

// Watchers
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    if (props.isEdicao && props.profissionalData) {
      // Pré-preencher o formulário com os dados do profissional
      form.value = {
        perfilId: props.profissionalData.profile_id,
        especialidadeId: props.profissionalData.especialidade_id
      }
    } else {
      resetForm()
    }
  }
})

// Watcher para mudanças nos dados do profissional
watch(() => props.profissionalData, (newData) => {
  if (props.isOpen && props.isEdicao && newData) {
    form.value = {
      perfilId: newData.profile_id,
      especialidadeId: newData.especialidade_id
    }
  }
})
</script>

<style scoped>
/* Estilos específicos do modal se necessário */
</style>