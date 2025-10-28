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
        <!-- Nome do Cliente -->
        <BaseInput
          v-model="form.nome"
          label="Nome do Cliente"
          placeholder="Digite o nome completo do cliente"
          required
          :error="errors.nome"
          :disabled="loading"
        />

        <!-- CPF -->
        <BaseInput
          v-model="form.cpf"
          label="CPF"
          placeholder="000.000.000-00"
          required
          :error="errors.cpf"
          :disabled="loading"
          @input="formatarCPF"
          maxlength="14"
        />

        <!-- Email -->
        <BaseInput
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="cliente@email.com"
          :error="errors.email"
          :disabled="loading"
        />

        <!-- Telefone -->
        <BaseInput
          v-model="form.telefone"
          label="Telefone"
          placeholder="(11) 99999-9999"
          :error="errors.telefone"
          :disabled="loading"
          @input="formatarTelefone"
          maxlength="15"
        />

        <!-- Endereço -->
        <BaseInput
          v-model="form.endereco"
          label="Endereço"
          placeholder="Rua, número, bairro, cidade"
          :error="errors.endereco"
          :disabled="loading"
        />
      </form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from 'vue'
import { UserIcon } from '@heroicons/vue/24/outline'
import BaseModal from './BaseModal.vue'
import BaseInput from './BaseInput.vue'
import type { AgCliente } from '~/types/database'

const toast = useNuxtApp().$toast

interface Props {
  isOpen?: boolean
  isEdicao?: boolean
  clienteId?: string | null
  clienteData?: AgCliente | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  isEdicao: false,
  clienteId: null,
  clienteData: null,
  loading: false
})

interface Emits {
  close: []
  save: [data: ClienteFormData]
  cancel: []
}

const emit = defineEmits<Emits>()

// Composables
const { inserirCliente, buscarClientes, editarCliente } = useProfissionais()

// Tipos
interface ClienteFormData {
  nome: string
  cpf: string
  email?: string
  telefone?: string
  endereco?: string
}

interface FormErrors {
  nome?: string
  cpf?: string
  email?: string
  telefone?: string
  endereco?: string
}

// Estado do formulário
const form = ref<ClienteFormData>({
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  endereco: ''
})

const errors = reactive<FormErrors>({})
const loading = ref(false) // Estado de loading interno

// Função para carregar dados do cliente para edição
const carregarCliente = () => {
  if (!props.isEdicao) return
  
  // Se temos dados do cliente passados via prop, usar eles
  if (props.clienteData) {
    form.value.nome = props.clienteData.nome || ''
    form.value.cpf = props.clienteData.cpf || ''
    form.value.email = props.clienteData.email || ''
    form.value.telefone = props.clienteData.telefone || ''
    form.value.endereco = props.clienteData.endereco || ''
    return
  }
  
  // Fallback: buscar no banco se não temos os dados (não deveria acontecer)
  if (props.clienteId) {
    buscarClienteNoBanco()
  }
}

// Função auxiliar para buscar no banco (fallback)
const buscarClienteNoBanco = async () => {
  try {
    const clientes = await buscarClientes()
    const cliente = clientes.find(c => c.id === Number(props.clienteId))
    
    if (cliente) {
      form.value.nome = cliente.nome || ''
      form.value.cpf = cliente.cpf || ''
      form.value.email = cliente.email || ''
      form.value.telefone = cliente.telefone || ''
      form.value.endereco = cliente.endereco || ''
    }
  } catch (error) {
    console.error('Erro ao carregar cliente:', error)
    toast.error('Erro ao carregar dados do cliente', {
      timeout: 4000
    })
  }
}

// Watcher para carregar dados quando modal abrir em modo edição
watch(() => [props.isOpen, props.isEdicao, props.clienteData], async () => {
  if (props.isOpen && props.isEdicao) {
    await nextTick()
    carregarCliente()
  }
}, { immediate: false })

// Computed
const modalTitle = computed(() => {
  return props.isEdicao ? 'Editar Cliente' : 'Novo Cliente'
})

const isFormValid = computed(() => {
  // Verifica apenas os campos obrigatórios básicos, não os erros de validação
  if (!form.value?.nome?.trim()) return false
  if (!form.value?.cpf?.trim()) return false
  return true
})

// Função para validar CPF (completa)
const validarCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, '')
  
  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false
  
  // Validação dos dígitos verificadores
  let soma = 0
  let resto
  
  // Validação do primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i)
  }
  
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false
  
  // Validação do segundo dígito verificador
  soma = 0
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i)
  }
  
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false
  
  return true
}

// Função para validar email
const validarEmail = (email: string): boolean => {
  if (!email.trim()) return true // Email é opcional
  // Verificar se tem @ e pelo menos um ponto após o @
  return email.includes('@') && email.split('@')[1]?.includes('.')
}

// Função para formatar CPF
const formatarCPF = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '') // Remove tudo que não é dígito
  
  // Limita a 11 dígitos
  if (value.length > 11) {
    value = value.substring(0, 11)
  }
  
  // Aplica a máscara
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  
  form.value.cpf = value
}

// Função para formatar telefone
const formatarTelefone = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '') // Remove tudo que não é dígito
  
  // Limita a 11 dígitos
  if (value.length > 11) {
    value = value.substring(0, 11)
  }
  
  // Aplica a máscara (XX) XXXXX-XXXX
  if (value.length <= 11) {
    value = value.replace(/(\d{2})(\d)/, '($1) $2')
    value = value.replace(/(\d{5})(\d)/, '$1-$2')
  }
  
  form.value.telefone = value
}

// Validação do formulário
const validateForm = (): boolean => {
  // Limpar errors existentes
  Object.keys(errors).forEach(key => delete errors[key])

  // Validar nome
  if (!form.value?.nome?.trim()) {
    errors.nome = 'Nome do cliente é obrigatório'
  } else if (form.value.nome.trim().length < 2) {
    errors.nome = 'Nome deve ter pelo menos 2 caracteres'
  } else if (form.value.nome.trim().length > 100) {
    errors.nome = 'Nome deve ter no máximo 100 caracteres'
  }

  // Validar CPF
  if (!form.value?.cpf?.trim()) {
    errors.cpf = 'CPF é obrigatório'
  } else {
    // Remove a máscara para validar
    const cpfLimpo = form.value.cpf.replace(/\D/g, '')
    if (!validarCPF(cpfLimpo)) {
      errors.cpf = 'CPF inválido'
    }
  }

  // Validar email (se preenchido)
  if (form.value?.email?.trim() && !validarEmail(form.value.email)) {
    errors.email = 'Email inválido'
  }

  return Object.keys(errors).length === 0
}

// Função para resetar o formulário
const resetForm = () => {
  form.value = {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: ''
  }
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
    // Mostrar toast para erros de validação
    if (errors.email) {
      toast.error('Email inválido. Verifique se contém @ e um domínio válido.', {
        timeout: 4000
      })
    } else if (errors.cpf) {
      toast.error('CPF inválido. Digite apenas números.', {
        timeout: 4000
      })
    } else if (errors.nome) {
      toast.error('Nome é obrigatório.', {
        timeout: 4000
      })
    } else {
      toast.error('Verifique os campos obrigatórios.', {
        timeout: 4000
      })
    }
    return // Retorna sem ativar o loading
  }

  loading.value = true // Só ativa loading após validação bem-sucedida

  try {
    if (props.isEdicao && props.clienteId) {
      // Editar cliente existente

      const response = await editarCliente(Number(props.clienteId), {
        nome: form.value.nome.trim(),
        cpf: form.value.cpf.replace(/\D/g, ''), // Remove máscara do CPF
        email: form.value.email?.trim() || null,
        telefone: form.value.telefone?.replace(/\D/g, '') || null, // Remove máscara do telefone
        endereco: form.value.endereco?.trim() || null
      })
      
      if (response && typeof response === 'object' && response.success === true) {

        const message = String(response.message || 'Cliente editado com sucesso!')
        
        toast.success(message, {
          timeout: 3000
        })
        
        resetForm()
        emit('save', form.value)
        emit('close')
      } else {

        const errorMessage = String(response?.message || 'Erro ao editar cliente')
        
        toast.error(errorMessage, {
          timeout: 4000
        })
      }
    } else {
      // Inserir novo cliente

      const response = await inserirCliente({
        nome: form.value.nome.trim(),
        cpf: form.value.cpf.replace(/\D/g, ''), // Remove máscara do CPF
        email: form.value.email?.trim() || null,
        telefone: form.value.telefone?.replace(/\D/g, '') || null, // Remove máscara do telefone
        endereco: form.value.endereco?.trim() || null
      })

      if (response && typeof response === 'object' && response.success === true) {

        const message = String(response.message || 'Cliente salvo com sucesso!')
        
        toast.success(message, {
          timeout: 3000
        })
        
        resetForm()
        emit('save', form.value)
        emit('close')
      } else {

        const errorMessage = String(response?.message || 'Erro ao salvar cliente')
        
        toast.error(errorMessage, {
          timeout: 4000
        })
      }
    }
  } catch (error: any) {
    console.error('Erro ao salvar cliente:', error)
    const errorMessage = String(error?.message || 'Erro interno. Tente novamente.')
    
    toast.error(errorMessage, {
      timeout: 4000
    })
  } finally {
    loading.value = false // Sempre desativar loading
  }
}

// Watchers
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    if (props.isEdicao) {
      carregarCliente()
    } else {
      resetForm()
    }
  }
})

watch(() => props.clienteId, () => {
  if (props.isOpen && props.isEdicao) {
    carregarCliente()
  }
})
</script>

<style scoped>
/* Estilos específicos do modal se necessário */
</style>