<template>
  <NuxtLayout>
    <div class="p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Profissionais</h1>
      
      <!-- Botão de adicionar -->
      <div class="mb-6 flex justify-end">
        <BaseButton
          v-if="userStore.isAdmin"
          label="Adicionar Profissional"
          variant="primary"
          size="md"
          :icon-left="PlusIcon"
          @click="adicionarProfissional"
        />
      </div>
      
      <!-- Tabela de profissionais -->
      <TabelaProfissionais 
        :profissionais="profissionais"
        :loading="loading"
        :error="error"
        :show-actions="userStore.isAdmin"
        @editar="editarProfissional"
        @deletar="deletarProfissional"
      />
      
      <!-- Modal de Profissional -->
      <ModalProfissional
        :is-open="modalAberto"
        :is-edicao="modoEdicao"
        :profissional-id="profissionalEditandoId"
        :profissional-data="profissionalEditandoData"
        :loading="salvandoProfissional"
        :perfis="perfis"
        :especialidades="especialidades"
        @close="fecharModal"
        @cancel="fecharModal"
        @save="salvarProfissional"
      />

      <!-- Modal de Confirmação para Deletar -->
      <ModalConfirmacao
        :is-open="modalConfirmacaoAberto"
        title="Deletar Profissional"
        :message="mensagemConfirmacao"
        :loading="deletandoProfissional"
        @confirm="confirmarDelecao"
        @cancel="cancelarDelecao"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { AgProfissional, AgPerfil, AgEspecialidade } from '~/types/database'
import { PlusIcon } from '@heroicons/vue/24/outline'
import TabelaProfissionais from '~/components/TabelaProfissionais.vue'
import ModalProfissional from '~/components/ModalProfissional.vue'
import ModalConfirmacao from '~/components/ModalConfirmacao.vue'
import { useToast } from 'vue-toastification'

// Store do usuário
const userStore = useUserStore()

// Toast
const toast = useToast()

// Estado reativo
const profissionais = ref<AgProfissional[]>([])
const perfis = ref<AgPerfil[]>([])
const especialidades = ref<AgEspecialidade[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Estado do modal
const modalAberto = ref(false)
const modoEdicao = ref(false)
const profissionalEditandoId = ref<number | null>(null)
const profissionalEditandoData = ref<AgProfissional | null>(null)
const salvandoProfissional = ref(false)

// Estado do modal de confirmação
const modalConfirmacaoAberto = ref(false)
const profissionalParaDeletar = ref<AgProfissional | null>(null)
const deletandoProfissional = ref(false)
const mensagemConfirmacao = computed(() => {
  if (profissionalParaDeletar.value) {
    return `Tem certeza que deseja deletar o profissional "${profissionalParaDeletar.value.nome_profissional}"? Esta ação não pode ser desfeita.`
  }
  return 'Tem certeza que deseja deletar este profissional?'
})

// Composable
const { buscarProfissionais, buscarPerfis, buscarEspecialidades, deletarProfissional: deletarProfissionalAPI } = useProfissionais()

// Função para carregar profissionais
const carregarProfissionais = async () => {
  try {
    loading.value = true
    error.value = null
    profissionais.value = await buscarProfissionais()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar profissionais'
    console.error('Erro ao carregar profissionais:', err)
  } finally {
    loading.value = false
  }
}

// Função para carregar perfis
const carregarPerfis = async () => {
  try {
    perfis.value = await buscarPerfis()
  } catch (err) {
    console.error('Erro ao carregar perfis:', err)
  }
}

// Função para carregar especialidades
const carregarEspecialidades = async () => {
  try {
    especialidades.value = await buscarEspecialidades()
  } catch (err) {
    console.error('Erro ao carregar especialidades:', err)
  }
}

// Função para carregar todos os dados necessários
const carregarDados = async () => {
  await Promise.all([
    carregarProfissionais(),
    carregarPerfis(),
    carregarEspecialidades()
  ])
}

// Função para adicionar profissional
const adicionarProfissional = () => {
  modoEdicao.value = false
  profissionalEditandoId.value = null
  profissionalEditandoData.value = null
  modalAberto.value = true
}

// Função para editar profissional
const editarProfissional = (profissional: AgProfissional) => {
  modoEdicao.value = true
  profissionalEditandoId.value = profissional.profissional_id
  profissionalEditandoData.value = profissional
  modalAberto.value = true
}

// Função para deletar profissional
const deletarProfissional = (profissional: AgProfissional) => {
  profissionalParaDeletar.value = profissional
  modalConfirmacaoAberto.value = true
}

// Função para confirmar a deleção
const confirmarDelecao = async () => {
  if (!profissionalParaDeletar.value) return

  try {
    deletandoProfissional.value = true
    
    const resultado = await deletarProfissionalAPI(profissionalParaDeletar.value.profissional_id)
    
    if (resultado.success) {
      // Recarregar a lista de profissionais
      await carregarProfissionais()
      
      // Fechar modal e limpar estado
      cancelarDelecao()
      
      // Mostrar toast de sucesso
      toast.success('Profissional excluído', {
        timeout: 4000
      })
    } else {
      console.error('Erro ao deletar profissional:', resultado.message)
      toast.error(resultado.message, {
        timeout: 4000
      })
    }
  } catch (error) {
    console.error('Erro ao deletar profissional:', error)
    toast.error('Erro interno. Tente novamente.', {
      timeout: 4000
    })
  } finally {
    deletandoProfissional.value = false
  }
}

// Função para cancelar a deleção
const cancelarDelecao = () => {
  modalConfirmacaoAberto.value = false
  profissionalParaDeletar.value = null
  deletandoProfissional.value = false
}

// Funções do modal
const fecharModal = () => {
  modalAberto.value = false
  modoEdicao.value = false
  profissionalEditandoId.value = null
  profissionalEditandoData.value = null
}

const salvarProfissional = async (dadosProfissional: any) => {
  try {
    console.log('Dados do profissional para salvar:', dadosProfissional)
    // TODO: Implementar lógica de salvamento
    // Por enquanto apenas recarrega os dados
    await carregarProfissionais()
  } catch (err) {
    console.error('Erro ao salvar profissional:', err)
  }
}

// Carregar dados ao montar o componente
onMounted(async () => {
  await carregarDados()
})
</script>