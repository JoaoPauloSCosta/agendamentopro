<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <KeyIcon class="h-6 w-6 text-primary-600" />
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Esqueceu sua senha?
          </h2>
          <p class="text-sm text-gray-600">
            Não se preocupe! Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <!-- Formulário -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email -->
          <div>
            <BaseInput
              id="email-recuperacao-input"
              v-model="email"
              type="email"
              label="Email"
              placeholder="seu@email.com"
              :icon-left="EnvelopeIcon"
              :error-message="emailError"
              required
            />
          </div>

          <!-- Botão de Enviar -->
          <div>
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              class="w-full"
              :loading="isLoading"
              :disabled="isLoading"
            >
              Enviar Link de Recuperação
            </BaseButton>
          </div>
        </form>

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

      <!-- Informação adicional -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Lembre-se de verificar sua caixa de spam caso não receba o email.
        </p>
      </div>
    </div>

    <!-- Modal de Confirmação -->
    <ModalConfirmacao
      :is-open="modalAberto"
      title="Email Enviado"
      message="Se o email informado estiver cadastrado em nosso sistema, você receberá um link para redefinir sua senha. Verifique sua caixa de entrada e spam."
      @confirm="handleModalClose"
      @cancel="handleModalClose"
    />
  </div>
</template>

<script setup lang="ts">
import { EnvelopeIcon, KeyIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'

// Composables
const { requestPasswordReset, isLoading } = useAuth()

// Estado local
const email = ref('')
const emailError = ref('')
const modalAberto = ref(false)

// Handler do formulário
const handleSubmit = async () => {
  // Limpar erro anterior
  emailError.value = ''

  // Validação básica
  if (!email.value) {
    emailError.value = 'O email é obrigatório'
    return
  }

  if (!isValidEmail(email.value)) {
    emailError.value = 'Digite um email válido'
    return
  }

  // Solicitar recuperação de senha
  const resultado = await requestPasswordReset(email.value)

  // Sempre mostrar o modal, independente do resultado
  // Isso é uma boa prática de segurança para não revelar se o email existe ou não
  modalAberto.value = true
}

// Handler do modal
const handleModalClose = () => {
  modalAberto.value = false
  // Limpar o campo de email
  email.value = ''
}

// Validação de email
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Limpar erro quando o usuário digitar
watch(email, () => {
  if (emailError.value) emailError.value = ''
})

// Metadata da página
definePageMeta({
  layout: false,
  title: 'Esqueci minha senha - AgendaPro'
})

// SEO
useHead({
  title: 'Esqueci minha senha - AgendaPro',
  meta: [
    {
      name: 'description',
      content: 'Recupere sua senha do AgendaPro.'
    }
  ]
})
</script>
