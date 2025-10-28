<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <LockClosedIcon class="h-6 w-6 text-primary-600" />
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Redefinir Senha
          </h2>
          <p class="text-sm text-gray-600">
            Digite sua nova senha abaixo.
          </p>
        </div>

        <!-- Formulário de Alteração de Senha -->
        <div class="space-y-6">
          <!-- Nova Senha -->
          <div>
            <BaseInput
              id="nova-senha-input"
              v-model="novaSenha"
              type="password"
              label="Nova Senha"
              placeholder="Digite sua nova senha"
              :icon-left="KeyIcon"
              :error-message="errors.novaSenha"
              helper-text="A senha deve ter no mínimo 6 caracteres"
            />
          </div>

          <!-- Confirmar Nova Senha -->
          <div>
            <BaseInput
              id="confirmar-senha-input"
              v-model="confirmarSenha"
              type="password"
              label="Confirmar Nova Senha"
              placeholder="Digite novamente sua nova senha"
              :icon-left="KeyIcon"
              :error-message="errors.confirmarSenha"
            />
          </div>

          <!-- Botão de Ação -->
          <div>
            <BaseButton
              @click="handleChangePassword"
              variant="primary"
              size="lg"
              class="w-full"
              :disabled="!isFormValid"
              :loading="isLoading"
            >
              Redefinir Senha
            </BaseButton>
          </div>
        </div>

        <!-- Link para voltar ao login -->
        <div class="mt-6 text-center">
          <NuxtLink
            to="/login"
            class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeftIcon class="h-4 w-4" />
            Voltar para o login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LockClosedIcon, KeyIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'

// Composables
const toast = useNuxtApp().$toast
const { changePassword, isLoading } = useAuth()
const router = useRouter()

// Estado local
const novaSenha = ref('')
const confirmarSenha = ref('')

// Erros de validação
const errors = reactive({
  novaSenha: '',
  confirmarSenha: ''
})

// Computed
const isFormValid = computed(() => {
  return novaSenha.value.length >= 6 && 
         confirmarSenha.value === novaSenha.value &&
         !isLoading.value
})

// Handlers
const handleChangePassword = async () => {
  // Limpar erros anteriores
  errors.novaSenha = ''
  errors.confirmarSenha = ''

  // Validações básicas
  if (novaSenha.value.length < 6) {
    errors.novaSenha = 'A senha deve ter no mínimo 6 caracteres'
    return
  }

  if (novaSenha.value !== confirmarSenha.value) {
    errors.confirmarSenha = 'As senhas não coincidem'
    return
  }

  // Chamar função de alteração de senha
  const resultado = await changePassword(novaSenha.value)

  if (resultado.success) {
    toast.success('Senha redefinida com sucesso! Redirecionando para o login...')
    // Redirecionar para login após 2 segundos
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } else {
    toast.error(resultado.error || 'Erro ao redefinir senha')
  }
}

// Limpar erros quando o usuário digitar
watch(novaSenha, () => {
  if (errors.novaSenha) errors.novaSenha = ''
})

watch(confirmarSenha, () => {
  if (errors.confirmarSenha) errors.confirmarSenha = ''
})

// Metadata da página
definePageMeta({
  layout: false,
  title: 'Recuperar Senha - AgendaPro'
})

// SEO
useHead({
  title: 'Recuperar Senha - AgendaPro',
  meta: [
    {
      name: 'description',
      content: 'Redefina sua senha do AgendaPro.'
    }
  ]
})
</script>
