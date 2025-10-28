<template>
  <NuxtLayout>
    <div class="p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p class="mt-2 text-sm text-gray-600">
          Gerencie suas informações pessoais e configurações de conta
        </p>
      </div>

      <!-- Informações do Perfil -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Informações Pessoais</h2>
        
        <div class="space-y-6">
          <!-- Nome -->
          <div>
            <BaseInput
              v-model="nome"
              label="Nome"
              placeholder="Digite seu nome"
              :icon-left="UserIcon"
            />
            <div v-if="nomeAlterado" class="mt-3 flex gap-3">
              <BaseButton
                @click="handleSaveNome"
                variant="primary"
                size="sm"
                :loading="isLoading"
                :disabled="isLoading"
              >
                Salvar
              </BaseButton>
              <BaseButton
                @click="handleCancelNome"
                variant="secondary"
                size="sm"
                :disabled="isLoading"
              >
                Cancelar
              </BaseButton>
            </div>
          </div>

          <!-- Email (somente leitura) -->
          <div>
            <BaseInput
              :model-value="email"
              label="Email"
              type="email"
              :readonly="true"
              :disabled="true"
              :icon-left="EnvelopeIcon"
            />
            <p class="mt-2 text-xs text-gray-500">
              O email não pode ser alterado
            </p>
          </div>
        </div>
      </div>

      <!-- Componente de Alteração de Senha -->
      <ChangePassword />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { UserIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '~/stores/user'

// Store
const toast = useNuxtApp().$toast
const userStore = useUserStore()

// Composables
const { updateUserName, isLoading } = useAuth()

// Estado local
const nome = ref('')
const nomeOriginal = ref('')

// Computed
const email = computed(() => userStore.user?.email || '')

const nomeAlterado = computed(() => {
  return nome.value !== nomeOriginal.value && nome.value.trim() !== ''
})

// Inicializar nome do perfil
onMounted(() => {
  nome.value = userStore.profile?.nome || ''
  nomeOriginal.value = userStore.profile?.nome || ''
})

// Handler para salvar nome
const handleSaveNome = async () => {
  if (!nome.value.trim()) {
    toast.error('O nome não pode estar vazio')
    return
  }

  if (nome.value === nomeOriginal.value) {
    toast.info('Nenhuma alteração foi feita')
    return
  }

  const resultado = await updateUserName(nome.value.trim())

  if (resultado.success) {
    toast.success(resultado.message)
    nomeOriginal.value = nome.value.trim()
    // Atualizar o store
    await userStore.fetchProfile()
  } else {
    toast.error(resultado.message)
  }
}

// Handler para cancelar edição
const handleCancelNome = () => {
  nome.value = nomeOriginal.value
}

// Verificar autenticação
const user = useSupabaseUser()

// Redirecionar se não estiver autenticado
watchEffect(() => {
  if (!user.value) {
    navigateTo('/login')
  }
})

// Metadata da página
definePageMeta({
  title: 'Perfil - AgendaPro'
})

// SEO
useHead({
  title: 'Perfil - AgendaPro',
  meta: [
    {
      name: 'description',
      content: 'Gerencie suas informações pessoais e configurações de conta.'
    }
  ]
})
</script>
