<template>
  <NuxtLayout>
    <div class="p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Especialidades</h1>
      
      <!-- Botão de adicionar -->
      <div class="mb-6 flex justify-end">
        <BaseButton
          v-if="userStore.isAdmin"
          label="Adicionar Especialidade"
          variant="primary"
          size="md"
          :icon-left="PlusIcon"
          @click="adicionarEspecialidade"
        />
      </div>
      
      <!-- Tabela de especialidades -->
      <TabelaEspecialidades 
        :especialidades="especialidades"
        :loading="loading"
        :error="error"
        :show-actions="userStore.isAdmin"
        @editar="editarEspecialidade"
        @deletar="deletarEspecialidade"
      />
      
      <!-- Modal de Especialidade -->
      <ModalEspecialidade
        :is-open="modalAberto"
        :is-edicao="modoEdicao"
        :especialidade-id="especialidadeEditandoId"
        :loading="salvandoEspecialidade"
        @close="fecharModal"
        @cancel="fecharModal"
        @save="salvarEspecialidade"
      />
      
      <!-- Modal de Confirmação de Exclusão -->
      <ModalConfirmacao
        :is-open="modalConfirmacaoAberto"
        title="Confirmar Exclusão"
        :message="`Tem certeza que deseja excluir a especialidade '${especialidadeParaDeletar?.nome}'?`"
        :loading="deletandoEspecialidade"
        @confirm="confirmarDelecao"
        @cancel="cancelarDelecao"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { AgEspecialidade } from '~/types/database'
import { PlusIcon } from '@heroicons/vue/24/outline'
import ModalEspecialidade from '~/components/ModalEspecialidade.vue'
import ModalConfirmacao from '~/components/ModalConfirmacao.vue'
import { useToast } from 'vue-toastification'

// Store do usuário
const userStore = useUserStore()

// Toast
const toast = useToast()

// Estado reativo
const especialidades = ref<AgEspecialidade[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Estado do modal
const modalAberto = ref(false)
const modoEdicao = ref(false)
const especialidadeEditandoId = ref<number | null>(null)
const salvandoEspecialidade = ref(false)

// Estado do modal de confirmação de exclusão
const modalConfirmacaoAberto = ref(false)
const especialidadeParaDeletar = ref<AgEspecialidade | null>(null)
const deletandoEspecialidade = ref(false)

// Composable
const { buscarEspecialidades, deletarEspecialidade: deletarEspecialidadeAPI } = useProfissionais()

// Função para carregar especialidades
const carregarEspecialidades = async () => {
  try {
    loading.value = true
    error.value = null
    especialidades.value = await buscarEspecialidades()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar especialidades'
    console.error('Erro ao carregar especialidades:', err)
  } finally {
    loading.value = false
  }
}

// Função para adicionar especialidade
const adicionarEspecialidade = () => {
  modoEdicao.value = false
  especialidadeEditandoId.value = null
  modalAberto.value = true
}

// Função para editar especialidade
const editarEspecialidade = (especialidade: AgEspecialidade) => {
  modoEdicao.value = true
  especialidadeEditandoId.value = especialidade.id
  modalAberto.value = true
}

// Função para deletar especialidade
const deletarEspecialidade = (especialidade: AgEspecialidade) => {
  especialidadeParaDeletar.value = especialidade
  modalConfirmacaoAberto.value = true
}

// Função para confirmar a exclusão
const confirmarDelecao = async () => {
  if (!especialidadeParaDeletar.value) return
  
  try {
    deletandoEspecialidade.value = true
    const resultado = await deletarEspecialidadeAPI(especialidadeParaDeletar.value.id)
    
    if (resultado.success) {
      toast.success('Especialidade deletada')
      await carregarEspecialidades()
      cancelarDelecao()
    } else {
      toast.error(resultado.message)
    }
  } catch (err) {
    toast.error('Erro ao deletar especialidade')
    console.error('Erro ao deletar especialidade:', err)
  } finally {
    deletandoEspecialidade.value = false
  }
}

// Função para cancelar a exclusão
const cancelarDelecao = () => {
  modalConfirmacaoAberto.value = false
  especialidadeParaDeletar.value = null
}

// Funções do modal
const fecharModal = () => {
  modalAberto.value = false
  modoEdicao.value = false
  especialidadeEditandoId.value = null
}

const salvarEspecialidade = async (dadosEspecialidade: any) => {
  try {
    // Recarregar dados após sucesso (modal já fechou e mostrou toast)
    await carregarEspecialidades()
  } catch (err) {
    console.error('Erro ao recarregar especialidades:', err)
  }
}

// Carregar dados ao montar o componente
onMounted(async () => {
  await carregarEspecialidades()
})
</script>