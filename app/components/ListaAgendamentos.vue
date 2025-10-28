<template>
  <div class="lista-agendamentos">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Carregando agendamentos...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <XCircleIcon class="error-icon" />
      <p class="error-text">{{ error }}</p>
      <BaseButton
        label="Tentar Novamente"
        variant="primary"
        size="sm"
        @click="carregarAgendamentos"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="!agendamentos || agendamentos.length === 0" class="empty-container">
      <CalendarDaysIcon class="empty-icon" />
      <h3 class="empty-title">Nenhum agendamento encontrado</h3>
      <p class="empty-text">
        {{ filtros ? 'Tente ajustar os filtros de busca.' : 'Não há agendamentos cadastrados no momento.' }}
      </p>
    </div>

    <!-- Lista de Cards -->
    <div v-else class="cards-grid">
      <CardAgendamento
        v-for="agendamento in agendamentos"
        :key="agendamento.id"
        :agendamento="agendamento"
      />
    </div>

    <!-- Informações de Totais -->
    <div v-if="agendamentos && agendamentos.length > 0" class="totais-info">
      <div class="total-item">
        <span class="total-label">Total de agendamentos:</span>
        <span class="total-value">{{ agendamentos.length }}</span>
      </div>
      <div class="total-item">
        <span class="total-label">Ativos:</span>
        <span class="total-value text-green-600">{{ agendamentosAtivos }}</span>
      </div>
      <div v-if="agendamentosCancelados > 0" class="total-item">
        <span class="total-label">Cancelados:</span>
        <span class="total-value text-red-600">{{ agendamentosCancelados }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CalendarDaysIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import CardAgendamento from './CardAgendamento.vue'
import BaseButton from './BaseButton.vue'
import { useAgendamentos } from '~/composables/useAgendamentos'
import type { AgAgendamentoCompleto, AgRelatorioFiltros } from '~/types/database'

// Configuração do componente
defineOptions({
  name: 'ListaAgendamentos'
})

// Props
interface Props {
  filtros?: AgRelatorioFiltros
}

const props = defineProps<Props>()

// Composable
const { buscarRelatorioAgendamentos } = useAgendamentos()

// Estado reativo
const agendamentos = ref<AgAgendamentoCompleto[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Computed para estatísticas
const agendamentosAtivos = computed(() => {
  return agendamentos.value.filter(a => !a.cancelado).length
})

const agendamentosCancelados = computed(() => {
  return agendamentos.value.filter(a => a.cancelado).length
})

// Função para carregar agendamentos
const carregarAgendamentos = async () => {
  try {
    loading.value = true
    error.value = null
    
    console.log('📊 Carregando agendamentos com filtros:', props.filtros)
    
    const dados = await buscarRelatorioAgendamentos(props.filtros)
    agendamentos.value = dados
    
    console.log('✅ Agendamentos carregados:', dados.length)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar agendamentos'
    console.error('❌ Erro ao carregar agendamentos:', err)
  } finally {
    loading.value = false
  }
}

// Carregar dados ao montar o componente
onMounted(() => {
  carregarAgendamentos()
})

// Watcher para recarregar quando os filtros mudarem
watch(() => props.filtros, () => {
  console.log('🔄 Filtros alterados no ListaAgendamentos, recarregando...')
  carregarAgendamentos()
}, { deep: true })

// Expor função para recarregar (útil para o componente pai)
defineExpose({
  recarregar: carregarAgendamentos
})

// Log de desenvolvimento
console.log('📋 ListaAgendamentos carregado')
</script>

<style scoped>
.lista-agendamentos {
  width: 100%;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Error State */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 0.75rem;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #ef4444;
}

.error-text {
  color: #991b1b;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

/* Empty State */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  background-color: #f9fafb;
  border: 2px dashed #e5e7eb;
  border-radius: 0.75rem;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #d1d5db;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.empty-text {
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
  max-width: 400px;
  margin: 0;
}

/* Grid de Cards - Layout em lista horizontal */
.cards-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
  max-height: calc(100vh - 350px); /* Altura máxima baseada na viewport */
  overflow-y: auto;
  padding-right: 0.5rem; /* Espaço para a scrollbar */
}

/* Scroll customizado */
.cards-grid::-webkit-scrollbar {
  width: 8px;
}

.cards-grid::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.cards-grid::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.cards-grid::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Totais */
.totais-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.total-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.total-label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.total-value {
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 700;
}

.text-green-600 {
  color: #16a34a;
}

.text-red-600 {
  color: #dc2626;
}

/* Responsividade */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .totais-info {
    flex-direction: column;
    gap: 1rem;
  }

  .total-item {
    width: 100%;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .total-item:last-child {
    border-bottom: none;
  }
}

@media (max-width: 400px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
