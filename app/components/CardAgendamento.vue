<template>
  <div 
    class="card-agendamento"
    :style="{ borderLeftColor: agendamento.cor || '#3b82f6' }"
  >
    <!-- Coluna 0: ID -->
    <div class="coluna coluna-id">
      <span class="id-texto">#{{ agendamento.id }}</span>
    </div>

    <!-- Coluna 1: Data e Hora -->
    <div class="coluna coluna-data">
      <div class="data-hora-container">
        <div class="data-info">
          <CalendarIcon class="icon" />
          <span class="data-texto">{{ formatarData(agendamento.data) }}</span>
        </div>
        <div class="hora-info">
          <ClockIcon class="icon" />
          <span class="hora-texto">{{ formatarHorario(agendamento.hora_inicio) }} - {{ formatarHorario(agendamento.hora_fim) }}</span>
        </div>
      </div>
    </div>

    <!-- Coluna 2: Título e Descrição -->
    <div class="coluna coluna-titulo">
      <h3 class="titulo">{{ agendamento.titulo }}</h3>
      <p v-if="agendamento.descricao" class="descricao-texto">{{ agendamento.descricao }}</p>
    </div>

    <!-- Coluna 3: Cliente -->
    <div class="coluna coluna-cliente">
      <div class="info-label">
        <UserIcon class="icon-small" />
        <span>Cliente</span>
      </div>
      <div class="info-value">
        {{ agendamento.cliente_nome || 'Não informado' }}
      </div>
    </div>

    <!-- Coluna 4: Profissional -->
    <div class="coluna coluna-profissional">
      <div class="info-label">
        <UserCircleIcon class="icon-small" />
        <span>Profissional</span>
      </div>
      <div class="info-value">
        {{ agendamento.profissional_nome || 'Não informado' }}
      </div>
      <div class="especialidade-texto">
        {{ agendamento.profissional_especialidade_nome || '' }}
      </div>
    </div>

    <!-- Coluna 5: Status -->
    <div class="coluna coluna-status">
      <div class="status-badge" :class="agendamento.cancelado ? 'cancelado' : 'ativo'">
        {{ agendamento.cancelado ? 'Cancelado' : 'Ativo' }}
      </div>
      <div v-if="agendamento.cancelado && agendamento.cancelado_as" class="cancelado-info">
        <span class="cancelado-data">{{ formatarDataHora(agendamento.cancelado_as) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  UserCircleIcon, 
  BeakerIcon,
  DocumentTextIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'
import type { AgAgendamentoCompleto } from '~/types/database'

// Configuração do componente
defineOptions({
  name: 'CardAgendamento'
})

// Props
interface Props {
  agendamento: AgAgendamentoCompleto
}

const props = defineProps<Props>()

// Funções de formatação
const formatarData = (data: string | null): string => {
  if (!data) return 'Data não informada'
  
  const dataObj = new Date(data + 'T00:00:00')
  return dataObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatarHorario = (horario: string | null): string => {
  if (!horario) return '--:--'
  
  // Extrair apenas HH:MM
  const partes = horario.split(':')
  if (partes.length >= 2) {
    return `${partes[0]}:${partes[1]}`
  }
  
  return horario
}

const formatarDataHora = (dataHora: string | null): string => {
  if (!dataHora) return 'Data não informada'
  
  const dataObj = new Date(dataHora)
  return dataObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.card-agendamento {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: white;
  border-radius: 0.5rem;
  border-left: 4px solid;
  padding: 0.875rem 1.25rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  min-height: 70px;
}

.card-agendamento:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateX(2px);
}

/* Colunas */
.coluna {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.coluna-id {
  min-width: 60px;
  flex-shrink: 0;
  justify-content: center;
}

.coluna-data {
  min-width: 180px;
  flex-shrink: 0;
}

.coluna-titulo {
  flex: 1;
  min-width: 200px;
  gap: 0.125rem; /* Reduz espaçamento entre título e descrição */
}

.coluna-cliente {
  min-width: 140px;
  flex-shrink: 0;
}

.coluna-profissional {
  min-width: 160px;
  flex-shrink: 0;
}

.coluna-status {
  min-width: 120px;
  flex-shrink: 0;
  align-items: flex-end;
}

/* Data e Hora */
.data-hora-container {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.data-info,
.hora-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.data-texto {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.hora-texto {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
}

/* ID */
.id-texto {
  font-size: 0.875rem;
  font-weight: 700;
  color: #6b7280;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
}

/* Título */
.titulo {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  color: #6b7280;
}

.icon-small {
  width: 0.75rem;
  height: 0.75rem;
  flex-shrink: 0;
  color: #9ca3af;
}

/* Status Badge */
.status-badge {
  padding: 0.375rem 0.875rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  text-align: center;
}

.status-badge.ativo {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.cancelado {
  background-color: #fee2e2;
  color: #991b1b;
}

.cancelado-info {
  margin-top: 0.25rem;
}

.cancelado-data {
  font-size: 0.6875rem;
  color: #9ca3af;
  text-align: right;
}

/* Info Labels e Values */
.info-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #9ca3af;
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  margin-bottom: 0.125rem;
}

.info-value {
  color: #1f2937;
  font-size: 0.875rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.especialidade-texto {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 0.125rem;
}

/* Descrição */
.descricao-texto {
  color: #6b7280;
  font-size: 0.8125rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  margin-top: 0.125rem; /* Espaçamento mínimo do título */
}

/* Responsividade */
@media (max-width: 1200px) {
  .card-agendamento {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .coluna-id {
    flex: 0 0 auto;
  }

  .coluna-data,
  .coluna-titulo {
    flex: 1 1 45%;
  }

  .coluna-cliente,
  .coluna-profissional {
    flex: 1 1 30%;
  }

  .coluna-status {
    flex: 1 1 100%;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .card-agendamento {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
  }

  .coluna {
    width: 100%;
    min-width: auto;
  }

  .coluna-id {
    width: auto;
  }

  .coluna-status {
    align-items: flex-start;
  }

  .status-badge {
    width: fit-content;
  }

  .cancelado-data {
    text-align: left;
  }
}
</style>
