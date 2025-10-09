<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Título do Formulário -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-neutral-900 mb-2">
        Entrar
      </h2>
      <p class="text-neutral-600">
        Acesse sua conta para continuar
      </p>
    </div>

    <!-- Formulário -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Campo Email -->
      <div>
        <BaseInput
          v-model="formData.email"
          type="email"
          label="Email"
          placeholder="Digite seu email"
          :required="true"
          autocomplete="email"
          size="lg"
          :icon-left="EnvelopeIcon"
        />
      </div>

      <!-- Campo Senha -->
      <div>
        <BaseInput
          v-model="formData.password"
          type="password"
          label="Senha"
          placeholder="Digite sua senha"
          :required="true"
          autocomplete="current-password"
          size="lg"
          :icon-left="LockClosedIcon"
        />
      </div>

      <!-- Link Esqueci a Senha -->
      <div class="flex justify-end">
        <a 
          href="#" 
          class="text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200"
        >
          Esqueci minha senha
        </a>
      </div>

      <!-- Botão Entrar -->
      <div class="pt-2">
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :full-width="true"
          :loading="isLoading"
        >
          Entrar
        </BaseButton>
      </div>
    </form>

    <!-- Link Criar Conta -->
    <div class="mt-8 text-center">
      <p class="text-neutral-600">
        Não tem uma conta?
        <a 
          href="#" 
          class="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
        >
          Criar conta
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

// Dados do formulário
const formData = ref({
  email: '',
  password: ''
})

// Estado de loading
const isLoading = ref(false)

// Função de submit (apenas para demonstração)
const handleSubmit = () => {
  console.log('Dados do formulário:', formData.value)
  // Aqui seria implementada a lógica de autenticação
}
</script>

<style scoped>
/* Estilos específicos do componente se necessário */
</style>