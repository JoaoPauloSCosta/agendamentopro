<template>
  <div class="agendamento-manager">
    <!-- Header -->
    <div class="header">
      <!-- Primeira linha: Controlador, Profissional e Botão -->
      <div class="header-primeira-linha">
        <!-- Lado esquerdo: Controlador de semana -->
        <div class="header-esquerdo">
          <ControladorSemana />
        </div>
        
        <!-- Centro: Profissional atual -->
        <div class="header-centro">
          <ProfissionalAtual 
            :profissional-selecionado-id="profissionalSelecionadoId"
            @click="abrirModalSelecionarProfissional"
            @profissionais-carregados="handleProfissionaisCarregados"
          />
        </div>
        
        <!-- Lado direito: Botão -->
        <div class="header-direito">
          <div class="header-acoes">
            <BaseButton
              label="Novo"
              variant="primary"
              size="md"
              @click="criarNovoAgendamento"
            />
          </div>
        </div>
      </div>
      
      <!-- Segunda linha: Lista de dias -->
      <div class="lista-dias-container">
        <ListaDias v-if="agendamentoStore.diasSemana" :dias="agendamentoStore.diasSemana" />
      </div>
    </div>
    
    <!-- Corpo - Ocupa todo o restante do espaço -->
    <div class="corpo">
      <!-- Lado esquerdo: Régua de horários -->
      <div class="corpo-esquerdo">
        <ReguaHorarios />
      </div>
      
      <!-- Lado direito: Conteúdo principal -->
      <div class="corpo-direito">
        <!-- Lista de agendamentos por dia -->
        <div class="agendamentos-container">
          <ItemAgendamento 
            v-for="(dia, index) in agendamentoStore.diasSemana" 
            v-if="agendamentoStore.diasSemana"
            :key="index"
            :data="dia"
            :agendamentos="agendamentos"
            @slot-click="abrirModalEdicao"
          />
        </div>
      </div>
    </div>
    
    <!-- Modal Novo Agendamento -->
    <ModalNovoAgendamento
      :is-open="modalNovoAgendamentoAberto"
      :profissional-id="profissionalAtualId"
      :agendamentos-existentes="agendamentos"
      @close="fecharModalNovoAgendamento"
      @confirm="confirmarNovoAgendamento"
      @cancel="cancelarNovoAgendamento"
    />

    <!-- Modal Edição Agendamento -->
    <ModalNovoAgendamento
      :is-open="modalEdicaoAberto"
      :modo-edicao="true"
      :agendamento-para-edicao="agendamentoParaEdicao"
      :profissional-id="profissionalAtualId"
      :agendamentos-existentes="agendamentos"
      @close="fecharModalEdicao"
      @confirm="confirmarEdicaoAgendamento"
      @cancel="fecharModalEdicao"
      @cancelar-agendamento="abrirModalConfirmacaoCancelamento"
    />

    <!-- Modal de Confirmação de Cancelamento -->
    <ModalConfirmacao
      :is-open="modalConfirmacaoCancelamentoAberto"
      title="Cancelar Agendamento"
      message="Deseja cancelar este agendamento?"
      :loading="loadingCancelamento"
      @confirm="confirmarCancelamentoAgendamento"
      @cancel="fecharModalConfirmacaoCancelamento"
    />

    <!-- Modal Selecionar Profissional -->
    <ModalSelecionarProfissional
      :is-open="modalSelecionarProfissionalAberto"
      :profissionais="profissionais"
      :profissional-selecionado-id="profissionalSelecionadoId"
      :loading="loading"
      @close="fecharModalSelecionarProfissional"
      @selecionar="handleSelecionarProfissional"
    />
  </div>
</template>

<script setup lang="ts">
// Importar o componente ControladorSemana
import ControladorSemana from './ControladorSemana.vue'
// Importar o componente ProfissionalAtual
import ProfissionalAtual from './ProfissionalAtual.vue'
// Importar o componente ListaDias
import ListaDias from './ListaDias.vue'
// Importar o componente ReguaHorarios
import ReguaHorarios from './ReguaHorarios.vue'
// Importar o componente ItemAgendamento
import ItemAgendamento from './ItemAgendamento.vue'
// Importar o BaseButton
import BaseButton from '../BaseButton.vue'
// Importar o ModalNovoAgendamento
import ModalNovoAgendamento from './ModalNovoAgendamento.vue'
// Importar o ModalConfirmacao
import ModalConfirmacao from '../ModalConfirmacao.vue'
// Importar o ModalSelecionarProfissional
import ModalSelecionarProfissional from './ModalSelecionarProfissional.vue'
// Importar o store de agendamento
import { useAgendamentoStore } from '~/stores/agendamento'
// Importar composables
import { useProfissionais } from '~/composables/useProfissionais'
import { useAgendamentos } from '~/composables/useAgendamentos'
import { useUserStore } from '~/stores/user'
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import type { AgProfissional, AgAgendamento } from '~/types/database'

// Configuração do componente
defineOptions({
  name: 'AgendamentoManager'
})

// Stores
const agendamentoStore = useAgendamentoStore()
const userStore = useUserStore()

// Composables
const { buscarProfissionais, buscarClientes } = useProfissionais()
const { buscarAgendamentosPorProfissionalESemana, limparCache, atualizarAgendamento, cancelarAgendamento } = useAgendamentos()

// Estado reativo para profissionais e agendamentos
const profissionais = ref<AgProfissional[]>([])
const clientes = ref<AgCliente[]>([])
const agendamentos = ref<AgAgendamento[]>([])
const loading = ref(true)
const loadingAgendamentos = ref(false)
const modalNovoAgendamentoAberto = ref(false)

// Estado para modal de edição
const modalEdicaoAberto = ref(false)
const agendamentoParaEdicao = ref<AgAgendamento | null>(null)

// Estado para modal de confirmação de cancelamento
const modalConfirmacaoCancelamentoAberto = ref(false)
const agendamentoParaCancelar = ref<number | null>(null)
const loadingCancelamento = ref(false)

// Estado para modal de seleção de profissional
const modalSelecionarProfissionalAberto = ref(false)
const profissionalSelecionadoId = ref<number | null>(null)

// Computed para encontrar o profissional atual
const profissionalAtual = computed(() => {
  if (profissionais.value.length === 0) return null
  
  // Se há um profissional selecionado manualmente, usar ele
  if (profissionalSelecionadoId.value) {
    const profissionalSelecionado = profissionais.value.find(
      prof => prof.profissional_id === profissionalSelecionadoId.value
    )
    
    if (profissionalSelecionado) {
      console.log('👨‍⚕️ Profissional selecionado manualmente:', profissionalSelecionado)
      return profissionalSelecionado
    }
  }
  
  // Se o usuário tem um perfil, tentar encontrar o profissional correspondente
  if (userStore.profile?.id) {
    const profissionalLogado = profissionais.value.find(
      prof => prof.profile_id === userStore.profile?.id
    )
    
    if (profissionalLogado) {
      console.log('👨‍⚕️ Profissional logado encontrado:', profissionalLogado)
      return profissionalLogado
    }
  }
  
  // Se não encontrou o profissional logado, retorna o primeiro da lista
  console.log('👨‍⚕️ Usando primeiro profissional da lista:', profissionais.value[0])
  return profissionais.value[0]
})

// Computed para obter o ID do profissional atual
const profissionalAtualId = computed(() => {
  return profissionalAtual.value?.profissional_id || null
})

// Função para carregar agendamentos
const carregarAgendamentos = async () => {
  if (!profissionalAtualId.value) {
    agendamentos.value = []
    return
  }

  try {
    loadingAgendamentos.value = true
    console.log('🔍 Carregando agendamentos para profissional:', profissionalAtualId.value)
    
    // Obter início e fim da semana atual do store
    const diasSemana = agendamentoStore.diasSemana
    if (!diasSemana || diasSemana.length === 0) {
      console.warn('⚠️ diasSemana não está disponível ainda')
      return
    }
    
    const inicioSemana = diasSemana[0] // Domingo
    const fimSemana = diasSemana[6] // Sábado
    
    console.log('📅 Semana atual:', inicioSemana.toLocaleDateString('pt-BR'), 'até', fimSemana.toLocaleDateString('pt-BR'))
    
    const dados = await buscarAgendamentosPorProfissionalESemana(
      profissionalAtualId.value,
      inicioSemana,
      fimSemana
    )
    
    // Ordenar agendamentos do mais atual para o mais antigo
    // Combina data e hora_inicio para ordenação precisa
    const dadosOrdenados = dados.sort((a, b) => {
      const dataHoraA = new Date(`${a.data}T${a.hora_inicio}`)
      const dataHoraB = new Date(`${b.data}T${b.hora_inicio}`)
      return dataHoraB.getTime() - dataHoraA.getTime() // Decrescente (mais recente primeiro)
    })
    
    agendamentos.value = dadosOrdenados
    
    console.log('✅ Agendamentos carregados e ordenados:', dados.length)
  } catch (error) {
    console.error('❌ Erro ao carregar agendamentos:', error)
    agendamentos.value = []
  } finally {
    loadingAgendamentos.value = false
  }
}

// Função para carregar profissionais
const carregarProfissionais = async () => {
  try {
    loading.value = true
    console.log('🔍 Buscando profissionais...')
    console.log('👤 Usuário logado - Profile ID:', userStore.profile?.id)
    
    const dados = await buscarProfissionais()
    profissionais.value = dados
    
    console.log('📋 Profissionais carregados:', dados.length)
    console.log('🎯 Profissional atual selecionado:', profissionalAtual.value)
  } catch (error) {
    console.error('❌ Erro ao carregar profissionais:', error)
  } finally {
    loading.value = false
  }
}

// Função para carregar clientes
const carregarClientes = async () => {
  try {
    console.log('🔍 Buscando clientes...')
    
    const dados = await buscarClientes()
    clientes.value = dados
    
    console.log('📋 Clientes carregados:', dados.length)
  } catch (error) {
    console.error('❌ Erro ao carregar clientes:', error)
  }
}

// Função para criar novo agendamento
const criarNovoAgendamento = async () => {
  console.log('🆕 Tentando abrir modal para novo agendamento')
  
  // Verificar autenticação antes de abrir o modal
  const user = useSupabaseUser()
  const userStore = useUserStore()
  
  console.log('👤 Verificando autenticação...')
  console.log('👤 useSupabaseUser():', user.value)
  console.log('👤 userStore.isAuthenticated:', userStore.isAuthenticated)
  
  const isAuthenticated = user.value?.id || userStore.isAuthenticated
  
  if (!isAuthenticated) {
    console.error('❌ Usuário não autenticado. Redirecionando para login...')
    
    // Mostrar toast de erro
    const { $toast } = useNuxtApp()
    $toast.error('Você precisa estar logado para criar agendamentos. Redirecionando para login...')
    
    // Redirecionar para login após um breve delay
    setTimeout(() => {
      navigateTo('/login')
    }, 2000)
    
    return
  }
  
  console.log('✅ Usuário autenticado. Abrindo modal...')
  modalNovoAgendamentoAberto.value = true
}

// Funções do modal
const fecharModalNovoAgendamento = () => {
  modalNovoAgendamentoAberto.value = false
}

const confirmarNovoAgendamento = async (dados: any) => {
  console.log('✅ Confirmando novo agendamento:', dados)
  console.log('📊 Agendamentos antes da atualização:', agendamentos.value.length)
  
  try {
    // Fechar o modal primeiro
    modalNovoAgendamentoAberto.value = false
    console.log('🚪 Modal fechado')
    
    // Aguardar um pouco para garantir que o modal fechou
    await new Promise(resolve => setTimeout(resolve, 100))
    console.log('⏱️ Aguardou 100ms')
    
    // FORÇAR limpeza do cache antes de recarregar
    console.log('🗑️ Forçando limpeza do cache...')
    limparCache()
    
    // Recarregar agendamentos para mostrar o novo agendamento imediatamente
    console.log('🔄 Recarregando agendamentos após criação...')
    console.log('👤 Profissional atual:', profissionalAtualId.value)
    console.log('📅 Semana atual:', agendamentoStore.inicioSemana, 'até', agendamentoStore.fimSemana)
    
    await carregarAgendamentos()
    
    console.log('✅ Lista de agendamentos atualizada!')
    console.log('📊 Agendamentos após a atualização:', agendamentos.value.length)
    
    // Forçar reatividade
    await nextTick()
    console.log('🔄 nextTick executado para forçar reatividade')
    
  } catch (error) {
    console.error('❌ Erro ao recarregar agendamentos:', error)
  }
}

const cancelarNovoAgendamento = () => {
  console.log('❌ Cancelando novo agendamento')
  modalNovoAgendamentoAberto.value = false
}

// Função para recarregar agendamentos (alias para carregarAgendamentos)
const recarregarAgendamentos = async () => {
  console.log('🔄 Recarregando agendamentos...')
  
  // FORÇAR limpeza do cache antes de recarregar
  console.log('🗑️ Forçando limpeza do cache...')
  limparCache()
  
  // Recarregar agendamentos
  await carregarAgendamentos()
  
  console.log('✅ Agendamentos recarregados com sucesso!')
}

// Função para abrir modal de edição
const abrirModalEdicao = async (agendamentoId: number) => {
  console.log('✏️ Abrindo modal de edição para agendamento ID:', agendamentoId)
  
  // Buscar o agendamento completo
  const agendamento = agendamentos.value.find(ag => ag.id === agendamentoId)
  
  if (!agendamento) {
    console.error('❌ Agendamento não encontrado:', agendamentoId)
    return
  }
  
  console.log('📝 Agendamento encontrado para edição:', agendamento)
  agendamentoParaEdicao.value = agendamento
  modalEdicaoAberto.value = true
}

// Função para fechar modal de edição
const fecharModalEdicao = () => {
  console.log('❌ Fechando modal de edição')
  modalEdicaoAberto.value = false
  agendamentoParaEdicao.value = null
}

// Função para confirmar edição do agendamento
const confirmarEdicaoAgendamento = async (dadosAgendamento: any) => {
  if (!agendamentoParaEdicao.value?.id) {
    console.error('❌ ID do agendamento não encontrado para edição')
    return
  }

  try {
    console.log('💾 Salvando alterações do agendamento:', dadosAgendamento)
    
    // Atualizar apenas os campos editáveis (título, descrição, cor)
    await atualizarAgendamento(agendamentoParaEdicao.value.id, {
      titulo: dadosAgendamento.titulo,
      descricao: dadosAgendamento.descricao,
      cor: dadosAgendamento.cor
    })
    
    console.log('✅ Agendamento atualizado com sucesso!')
    
    // Fechar modal
    fecharModalEdicao()
    
    // Recarregar agendamentos
    await recarregarAgendamentos()
    
  } catch (error) {
    console.error('❌ Erro ao atualizar agendamento:', error)
  }
}

// Função para abrir modal de confirmação de cancelamento
const abrirModalConfirmacaoCancelamento = (agendamentoId: number) => {
  console.log('🔔 Abrindo modal de confirmação para cancelar agendamento ID:', agendamentoId)
  agendamentoParaCancelar.value = agendamentoId
  modalConfirmacaoCancelamentoAberto.value = true
}

// Função para fechar modal de confirmação de cancelamento
const fecharModalConfirmacaoCancelamento = () => {
  modalConfirmacaoCancelamentoAberto.value = false
  agendamentoParaCancelar.value = null
  loadingCancelamento.value = false
}

// Função para confirmar cancelamento do agendamento
const confirmarCancelamentoAgendamento = async () => {
  if (!agendamentoParaCancelar.value) return
  
  try {
    loadingCancelamento.value = true
    console.log('🗑️ Cancelando agendamento ID:', agendamentoParaCancelar.value)
    
    await cancelarAgendamento(agendamentoParaCancelar.value)
    
    console.log('✅ Agendamento cancelado com sucesso!')
    
    // Fechar modais
    fecharModalConfirmacaoCancelamento()
    fecharModalEdicao()
    
    // Recarregar agendamentos
    await recarregarAgendamentos()
    
  } catch (error) {
    console.error('❌ Erro ao cancelar agendamento:', error)
  } finally {
    loadingCancelamento.value = false
  }
}

// Função para abrir modal de seleção de profissional
const abrirModalSelecionarProfissional = () => {
  console.log('👨‍⚕️ Abrindo modal de seleção de profissional')
  modalSelecionarProfissionalAberto.value = true
}

// Função para fechar modal de seleção de profissional
const fecharModalSelecionarProfissional = () => {
  console.log('❌ Fechando modal de seleção de profissional')
  modalSelecionarProfissionalAberto.value = false
}

// Função para lidar com seleção de profissional
const handleSelecionarProfissional = (profissional: AgProfissional) => {
  console.log('✅ Profissional selecionado:', profissional)
  profissionalSelecionadoId.value = profissional.profissional_id
  
  // Limpar cache e recarregar agendamentos do novo profissional
  limparCache()
  carregarAgendamentos()
}

// Função para lidar com profissionais carregados
const handleProfissionaisCarregados = (dados: AgProfissional[]) => {
  console.log('📋 Profissionais carregados no AgendamentoManager:', dados.length)
  profissionais.value = dados
}

// Carregar dados ao montar o componente
onMounted(() => {
  carregarProfissionais()
  carregarClientes()
})

// Watcher para recarregar agendamentos quando profissional mudar
watch(profissionalAtualId, () => {
  carregarAgendamentos()
}, { immediate: true })

// Watcher para recarregar agendamentos quando a semana mudar
watch(() => agendamentoStore.diasSemana, () => {
  console.log('📅 Semana alterada, recarregando agendamentos...')
  carregarAgendamentos()
}, { deep: true })

// Log de desenvolvimento
console.log('📋 AgendamentoManager carregado')
</script>

<style scoped>
.agendamento-manager {
  height: auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
}

.header-primeira-linha {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-esquerdo {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.header-centro {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-direito {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.header-acoes {
  display: flex;
  gap: 0.5rem;
}

/* Container da lista de dias */
.lista-dias-container {
  width: 100%;
}

/* Corpo do componente */
.corpo {
  flex: 1;
  display: flex;
  overflow: visible;
  min-height: 0;
}

.corpo-esquerdo {
  width: 100px;
  flex-shrink: 0;
}

.corpo-direito {
  flex: 1;
  padding: 0 1rem 1rem 1rem; /* Remove padding-top para colar no header */
  overflow: visible; /* Remove scroll para permitir altura total */
  height: auto;
  min-height: 1500px; /* Altura mínima igual ao ReguaHorarios */
}

.agendamentos-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  height: 1500px; /* Altura fixa igual ao ReguaHorarios */
  margin-top: 0; /* Remove qualquer margin-top para colar no header */
}
</style>