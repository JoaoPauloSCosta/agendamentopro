<template>
  <BaseModal
    :is-open="isOpen"
    :title="modalTitle"
    :icon="AcademicCapIcon"
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
        <!-- Nome da Especialidade -->
        <BaseInput
          v-model="form.nome"
          label="Nome da Especialidade"
          placeholder="Digite o nome da especialidade"
          required
          :error="errors.nome"
          :disabled="loading"
        />
      </form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from 'vue'
import { AcademicCapIcon } from '@heroicons/vue/24/outline'
import BaseModal from './BaseModal.vue'
import BaseInput from './BaseInput.vue'

const toast = useNuxtApp().$toast

interface Props {
  isOpen?: boolean
  isEdicao?: boolean
  especialidadeId?: string | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  isEdicao: false,
  especialidadeId: null,
  loading: false
})

interface Emits {
  close: []
  save: [data: EspecialidadeFormData]
  cancel: []
}

const emit = defineEmits<Emits>()

// Composables
const { inserirEspecialidade, editarEspecialidade, buscarEspecialidades } = useProfissionais()

// Tipos
interface EspecialidadeFormData {
  nome: string
}

interface FormErrors {
  nome?: string
}

// Estado do formulário
const form = ref<EspecialidadeFormData>({
  nome: ''
})

const errors = reactive<FormErrors>({})

// Função para carregar dados da especialidade para edição
const carregarEspecialidade = async () => {
  if (!props.isEdicao || !props.especialidadeId) return
  
  try {
    const especialidades = await buscarEspecialidades()
    const especialidade = especialidades.find(e => e.id === props.especialidadeId)
    
    if (especialidade) {
      form.value.nome = especialidade.nome
    }
  } catch (error) {
    console.error('Erro ao carregar especialidade:', error)
    toast.error('Erro ao carregar dados da especialidade', {
      timeout: 4000
    })
  }
}

// Watcher para carregar dados quando modal abrir em modo edição
watch(() => [props.isOpen, props.isEdicao, props.especialidadeId], async () => {
  if (props.isOpen && props.isEdicao && props.especialidadeId) {
    // Aguardar próximo tick para garantir que o componente está totalmente inicializado
    await nextTick()
    await carregarEspecialidade()
  }
}, { immediate: false })

// Computed
const modalTitle = computed(() => {
  return props.isEdicao ? 'Editar Especialidade' : 'Nova Especialidade'
})

const isFormValid = computed(() => {
  // Verificação mais segura para evitar erros de Object.keys
  if (!form.value?.nome?.trim()) return false
  if (!errors || typeof errors !== 'object') return true
  return Object.keys(errors).length === 0
})

// Validação do formulário
const validateForm = (): boolean => {
  // Limpar errors existentes
  Object.keys(errors).forEach(key => delete errors[key])

  // Validar nome
  if (!form.value?.nome?.trim()) {
    errors.nome = 'Nome da especialidade é obrigatório'
  } else if (form.value.nome.trim().length < 2) {
    errors.nome = 'Nome deve ter pelo menos 2 caracteres'
  } else if (form.value.nome.trim().length > 100) {
    errors.nome = 'Nome deve ter no máximo 100 caracteres'
  }

  return Object.keys(errors).length === 0
}

// Função para resetar o formulário
const resetForm = () => {
  form.value = {
    nome: ''
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
    if (props.isEdicao && props.especialidadeId) {
      // Editar especialidade existente
      const response = await editarEspecialidade(props.especialidadeId, form.value.nome.trim())
      // Verificação mais robusta para Nuxt 4
      if (response && typeof response === 'object' && response.success === true) {

        const message = String(response.message || 'Especialidade editada com sucesso!')
        
        // Usar toast diretamente como na página de teste
        toast.success(message, {
          timeout: 3000
        })
        
        resetForm()
        emit('save', { id: props.especialidadeId, nome: form.value.nome.trim() })
        emit('close')
      } else {

        const errorMessage = String(response?.message || 'Erro ao editar especialidade')
        
        // Usar toast diretamente como na página de teste
        toast.error(errorMessage, {
          timeout: 4000
        })
      }
    } else {
      // Inserir nova especialidade
      const response = await inserirEspecialidade(form.value.nome.trim())

      // Verificação mais robusta para Nuxt 4
      if (response && typeof response === 'object' && response.success === true) {

        const message = String(response.message || 'Especialidade salva com sucesso!')
        
        // Usar toast diretamente como na página de teste
        toast.success(message, {
          timeout: 3000
        })
        
        resetForm()
        emit('save', { nome: form.value.nome.trim() })
        emit('close')
      } else {

        const errorMessage = String(response?.message || 'Erro ao salvar especialidade')
        
        // Usar toast diretamente como na página de teste
        toast.error(errorMessage, {
          timeout: 4000
        })
      }
    }
  } catch (error: any) {
    console.error('Erro ao salvar especialidade:', error)
    const errorMessage = String(error?.message || 'Erro interno. Tente novamente.')
    
    // Usar toast diretamente como na página de teste
    toast.error(errorMessage, {
      timeout: 4000
    })
  }
}

// Carregar dados quando for edição
const loadEspecialidadeData = async () => {
  if (props.isEdicao && props.especialidadeId) {
    // TODO: Implementar carregamento dos dados da especialidade
    // Por enquanto, apenas um placeholder

    // Exemplo de como seria:
    // const { data } = await supabase
    //   .from('ag_especialidades')
    //   .select('*')
    //   .eq('id', props.especialidadeId)
    //   .single()
    
    // if (data) {
    //   form.nome = data.nome
    //   form.descricao = data.descricao || ''
    //   form.ativo = data.ativo
    // }
  }
}

// Watchers
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    if (props.isEdicao) {
      loadEspecialidadeData()
    } else {
      resetForm()
    }
  }
})

watch(() => props.especialidadeId, () => {
  if (props.isOpen && props.isEdicao) {
    loadEspecialidadeData()
  }
})
</script>

<style scoped>
/* Estilos específicos do modal se necessário */
</style>