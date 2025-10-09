<template>
  <div class="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-neutral-900 mb-4">
          🧪 Teste de Componentes
        </h1>
        <p class="text-xl text-neutral-600">
          Avaliação dos componentes BaseButton, BaseInput, Heroicons e Toast
        </p>
      </div>

      <!-- Toast Tests -->
      <section class="mb-16">
        <div class="bg-white rounded-2xl shadow-card border border-neutral-200 p-8">
          <h2 class="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
            🍞 Toast Notifications
            <span class="ml-3 text-sm font-normal text-neutral-500">Sistema de Notificações</span>
          </h2>

          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-neutral-800">Tipos de Toast</h3>
              <div class="flex flex-wrap gap-3">
                <BaseButton 
                  variant="success" 
                  size="sm"
                  @click="showSuccessToast"
                >
                  <CheckCircleIcon class="w-4 h-4 mr-2" />
                  Sucesso
                </BaseButton>
                <BaseButton 
                  variant="danger" 
                  size="sm"
                  @click="showErrorToast"
                >
                  <XCircleIcon class="w-4 h-4 mr-2" />
                  Erro
                </BaseButton>
                <BaseButton 
                  variant="secondary" 
                  size="sm"
                  @click="showWarningToast"
                >
                  <ExclamationTriangleIcon class="w-4 h-4 mr-2" />
                  Aviso
                </BaseButton>
                <BaseButton 
                  variant="primary" 
                  size="sm"
                  @click="showInfoToast"
                >
                  <InformationCircleIcon class="w-4 h-4 mr-2" />
                  Info
                </BaseButton>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-neutral-800">Heroicons</h3>
              <div class="flex flex-wrap gap-4 items-center">
                <HomeIcon class="w-6 h-6 text-primary-600" />
                <UserIcon class="w-6 h-6 text-secondary-600" />
                <CalendarIcon class="w-6 h-6 text-success-600" />
                <ClockIcon class="w-6 h-6 text-warning-600" />
                <HeartIcon class="w-6 h-6 text-danger-600" />
                <StarIcon class="w-6 h-6 text-warning-500" />
                <BellIcon class="w-6 h-6 text-primary-500" />
                <CogIcon class="w-6 h-6 text-neutral-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- BaseButton Tests -->
      <section class="mb-16">
        <div class="bg-white rounded-2xl shadow-card border border-neutral-200 p-8">
          <h2 class="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
            🔘 BaseButton
            <span class="ml-3 text-sm font-normal text-neutral-500">Componente de Botão Reutilizável</span>
          </h2>

          <!-- Variantes -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-neutral-800 mb-4">Variantes</h3>
            <div class="flex flex-wrap gap-4">
              <BaseButton variant="primary" label="Primary" />
              <BaseButton variant="secondary" label="Secondary" />
              <BaseButton variant="ghost" label="Ghost" />
              <BaseButton variant="danger" label="Danger" />
              <BaseButton variant="success" label="Success" />
            </div>
          </div>

          <!-- Tamanhos -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-neutral-800 mb-4">Tamanhos</h3>
            <div class="flex flex-wrap items-center gap-4">
              <BaseButton size="sm" label="Small" />
              <BaseButton size="md" label="Medium" />
              <BaseButton size="lg" label="Large" />
              <BaseButton size="xl" label="Extra Large" />
            </div>
          </div>

          <!-- Estados -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-neutral-800 mb-4">Estados</h3>
            <div class="flex flex-wrap gap-4">
              <BaseButton label="Normal" @click="showAlert('Botão clicado!')" />
              <BaseButton label="Loading" :loading="true" />
              <BaseButton label="Disabled" :disabled="true" />
              <BaseButton label="Full Width" :full-width="true" />
            </div>
          </div>

          <!-- Com Slots -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-neutral-800 mb-4">Com Slots</h3>
            <div class="flex flex-wrap gap-4">
              <BaseButton variant="primary">
                <span class="mr-2">✨</span>
                Com Emoji
              </BaseButton>
              <BaseButton variant="secondary">
                <strong>Texto Bold</strong>
              </BaseButton>
            </div>
          </div>

          <!-- Interativo -->
          <div class="bg-neutral-50 rounded-lg p-4">
            <h4 class="font-medium text-neutral-800 mb-3">Teste Interativo</h4>
            <div class="flex gap-4">
              <BaseButton 
                variant="primary" 
                :loading="buttonLoading"
                @click="simulateLoading"
              >
                {{ buttonLoading ? 'Carregando...' : 'Simular Loading' }}
              </BaseButton>
              <BaseButton 
                variant="ghost" 
                @click="buttonClickCount++"
              >
                Clicado {{ buttonClickCount }}x
              </BaseButton>
            </div>
          </div>
        </div>
      </section>

      <!-- BaseInput Tests -->
      <section class="mb-16">
        <div class="bg-white rounded-2xl shadow-card border border-neutral-200 p-8">
          <h2 class="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
            📝 BaseInput
            <span class="ml-3 text-sm font-normal text-neutral-500">Componente de Input Reutilizável</span>
          </h2>

          <!-- Tipos Básicos -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-neutral-800 mb-4">Tipos Básicos</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <BaseInput
                v-model="textValue"
                label="Texto"
                placeholder="Digite um texto..."
                helper-text="Campo de texto simples"
              />
              <BaseInput
                v-model="emailValue"
                type="email"
                label="Email"
                placeholder="seu@email.com"
                helper-text="Formato de email válido"
              />
              <BaseInput
                v-model="passwordValue"
                type="password"
                label="Senha"
                placeholder="Digite sua senha..."
                helper-text="Clique no ícone para mostrar/ocultar"
              />
              <BaseInput
                v-model="numberValue"
                type="number"
                label="Número"
                placeholder="123"
                :min="0"
                :max="100"
                helper-text="Valor entre 0 e 100"
              />
            </div>
          </div>

          <!-- Tamanhos -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-neutral-800 mb-4">Tamanhos</h3>
            <div class="grid md:grid-cols-3 gap-6">
              <BaseInput
                v-model="sizeSmall"
                size="sm"
                label="Small"
                placeholder="Tamanho pequeno"
              />
              <BaseInput
                v-model="sizeMedium"
                size="md"
                label="Medium"
                placeholder="Tamanho médio"
              />
              <BaseInput
                v-model="sizeLarge"
                size="lg"
                label="Large"
                placeholder="Tamanho grande"
              />
            </div>
          </div>

          <!-- Estados -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-neutral-800 mb-4">Estados</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <BaseInput
                v-model="normalInput"
                label="Normal"
                placeholder="Input normal"
                helper-text="Estado padrão do input"
              />
              <BaseInput
                v-model="errorInput"
                label="Com Erro"
                placeholder="Input com erro"
                error-message="Este campo é obrigatório"
                :required="true"
              />
              <BaseInput
                v-model="disabledInput"
                label="Desabilitado"
                placeholder="Input desabilitado"
                :disabled="true"
                helper-text="Este campo está desabilitado"
              />
              <BaseInput
                v-model="readonlyInput"
                label="Somente Leitura"
                placeholder="Input readonly"
                :readonly="true"
                helper-text="Este campo é somente leitura"
              />
            </div>
          </div>

          <!-- Com Funcionalidades -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-neutral-800 mb-4">Funcionalidades</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <BaseInput
                v-model="clearableInput"
                label="Limpável"
                placeholder="Digite algo para ver o botão limpar"
                :clearable="true"
                helper-text="Botão de limpar aparece quando há texto"
              />
              <BaseInput
                v-model="charCountInput"
                label="Contador de Caracteres"
                placeholder="Digite até 50 caracteres"
                :maxlength="50"
                :show-char-count="true"
                helper-text="Máximo de 50 caracteres"
              />
            </div>
          </div>

          <!-- Valores em Tempo Real -->
          <div class="bg-neutral-50 rounded-lg p-4">
            <h4 class="font-medium text-neutral-800 mb-3">Valores em Tempo Real</h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Texto:</strong> "{{ textValue }}"<br>
                <strong>Email:</strong> "{{ emailValue }}"<br>
                <strong>Senha:</strong> "{{ passwordValue }}"<br>
                <strong>Número:</strong> {{ numberValue }}
              </div>
              <div>
                <strong>Limpável:</strong> "{{ clearableInput }}"<br>
                <strong>Contador:</strong> "{{ charCountInput }}"<br>
                <strong>Caracteres:</strong> {{ charCountInput.length }}/50
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Formulário de Exemplo -->
      <section class="mb-16">
        <div class="bg-white rounded-2xl shadow-card border border-neutral-200 p-8">
          <h2 class="text-2xl font-bold text-neutral-900 mb-6">
            📋 Formulário de Exemplo
          </h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <BaseInput
                v-model="form.name"
                label="Nome Completo"
                placeholder="Seu nome completo"
                :required="true"
                :error-message="formErrors.name"
              />
              <BaseInput
                v-model="form.email"
                type="email"
                label="Email"
                placeholder="seu@email.com"
                :required="true"
                :error-message="formErrors.email"
              />
            </div>
            
            <BaseInput
              v-model="form.phone"
              type="tel"
              label="Telefone"
              placeholder="(11) 99999-9999"
              helper-text="Formato: (XX) XXXXX-XXXX"
            />
            
            <BaseInput
              v-model="form.message"
              label="Mensagem"
              placeholder="Sua mensagem..."
              :maxlength="200"
              :show-char-count="true"
              helper-text="Conte-nos como podemos ajudar"
            />
            
            <div class="flex gap-4 pt-4">
              <BaseButton
                type="submit"
                variant="primary"
                :loading="formSubmitting"
              >
                {{ formSubmitting ? 'Enviando...' : 'Enviar Formulário' }}
              </BaseButton>
              <BaseButton
                type="button"
                variant="secondary"
                @click="resetForm"
              >
                Limpar
              </BaseButton>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports dos ícones do Heroicons
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  HomeIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  HeartIcon,
  StarIcon,
  BellIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

// Import do toast
import { useToast } from 'vue-toastification'

// Configuração da página
useHead({
  title: 'Teste de Componentes - Agendamento',
  meta: [
    { name: 'description', content: 'Página de teste para componentes BaseButton, BaseInput, Heroicons e Toast' }
  ]
})

// Inicializar toast
const toast = useToast()

// Estados dos componentes BaseButton
const buttonLoading = ref(false)
const buttonClickCount = ref(0)

// Estados dos componentes BaseInput
const textValue = ref('')
const emailValue = ref('')
const passwordValue = ref('')
const numberValue = ref(0)
const sizeSmall = ref('')
const sizeMedium = ref('')
const sizeLarge = ref('')
const normalInput = ref('')
const errorInput = ref('')
const disabledInput = ref('Valor desabilitado')
const readonlyInput = ref('Valor somente leitura')
const clearableInput = ref('')
const charCountInput = ref('')

// Formulário de exemplo
const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const formErrors = reactive({
  name: '',
  email: ''
})

const formSubmitting = ref(false)

// Métodos para Toast
const showSuccessToast = () => {
  toast.success('✅ Operação realizada com sucesso!', {
    timeout: 3000
  })
}

const showErrorToast = () => {
  toast.error('❌ Ocorreu um erro na operação!', {
    timeout: 4000
  })
}

const showWarningToast = () => {
  toast.warning('⚠️ Atenção: Verifique os dados informados!', {
    timeout: 5000
  })
}

const showInfoToast = () => {
  toast.info('ℹ️ Informação importante para o usuário!', {
    timeout: 3500
  })
}

// Métodos existentes
const showAlert = (message: string) => {
  toast.info(message)
}

const simulateLoading = async () => {
  buttonLoading.value = true
  toast.info('🔄 Simulando operação...')
  await new Promise(resolve => setTimeout(resolve, 2000))
  buttonLoading.value = false
  toast.success('✅ Loading simulado concluído!')
}

const validateForm = () => {
  formErrors.name = ''
  formErrors.email = ''
  
  let isValid = true
  
  if (!form.name.trim()) {
    formErrors.name = 'Nome é obrigatório'
    isValid = false
  }
  
  if (!form.email.trim()) {
    formErrors.email = 'Email é obrigatório'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    formErrors.email = 'Email inválido'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('❌ Por favor, corrija os erros no formulário!')
    return
  }
  
  formSubmitting.value = true
  toast.info('📤 Enviando formulário...')
  
  // Simular envio
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  formSubmitting.value = false
  toast.success('🎉 Formulário enviado com sucesso!')
  resetForm()
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  
  Object.assign(formErrors, {
    name: '',
    email: ''
  })
  
  toast.info('🔄 Formulário limpo!')
}

// Log de desenvolvimento
console.log('🧪 Página de teste carregada!')
console.log('📊 Componentes disponíveis: BaseButton, BaseInput, Heroicons, Toast')
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style>