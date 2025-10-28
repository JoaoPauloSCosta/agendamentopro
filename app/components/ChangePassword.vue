<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-6">Alterar Senha</h2>
    
    <div class="space-y-6">
      <!-- Nova Senha -->
      <div>
        <BaseInput
          id="change-nova-senha-input"
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
          id="change-confirmar-senha-input"
          v-model="confirmarSenha"
          type="password"
          label="Confirmar Nova Senha"
          placeholder="Digite novamente sua nova senha"
          :icon-left="KeyIcon"
          :error-message="errors.confirmarSenha"
        />
      </div>

      <!-- Botão de Ação -->
      <div class="flex justify-end pt-4">
        <BaseButton
          @click="handleChangePassword"
          variant="primary"
          :disabled="!isFormValid"
          :loading="isLoading"
        >
          Alterar Senha
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KeyIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

// Composables
const { changePassword, isLoading } = useAuth()
const toast = useToast()

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
    toast.success(resultado.message || 'Senha alterada com sucesso!')
    // Limpar campos após sucesso
    novaSenha.value = ''
    confirmarSenha.value = ''
  } else {
    toast.error(resultado.error || 'Erro ao alterar senha')
  }
}

// Limpar erros quando o usuário digitar
watch(novaSenha, () => {
  if (errors.novaSenha) errors.novaSenha = ''
})

watch(confirmarSenha, () => {
  if (errors.confirmarSenha) errors.confirmarSenha = ''
})
</script>
