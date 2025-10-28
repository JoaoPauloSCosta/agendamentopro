<template>
  <div class="item-agendamento">
    <div class="agendamento-content">
      <div v-if="slotsOcupados.length > 0" class="slots-container">
        <SlotAgendamento
          v-for="(slot, index) in slotsOcupados"
          :key="`slot-${index}`"
          :inicio="slot.inicio"
          :fim="slot.fim"
          :titulo="slot.titulo"
          :descricao="slot.descricao"
          :ocupado="slot.ocupado"
          :cor="slot.cor"
          :agendamento-id="slot.agendamentoId"
          @click="handleSlotClick"
        />
      </div>
      <div v-else class="sem-agendamentos">
        <p class="agendamento-placeholder">Nenhum agendamento</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SlotAgendamento from './SlotAgendamento.vue'
import type { AgAgendamento } from '~/types/database'

// Configuração do componente
defineOptions({
  name: 'ItemAgendamento'
})

// Props - recebe uma data e lista de agendamentos
interface Props {
  data: Date
  agendamentos: AgAgendamento[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'slot-click': [agendamentoId: number]
}>()

// Função para lidar com clique no slot
const handleSlotClick = (agendamentoId?: number) => {
  if (agendamentoId) {
    console.log('📅 Agendamento clicado - ID:', agendamentoId)
    emit('slot-click', agendamentoId)
  }
}

// Interface para os slots de agendamento
interface SlotAgendamento {
  inicio: Date
  fim: Date
  titulo: string
  descricao: string
  ocupado: boolean
  cor: string
  agendamentoId?: number
}

// Função para converter AgAgendamento para SlotAgendamento
const converterAgendamentoParaSlot = (agendamento: AgAgendamento): SlotAgendamento | null => {
  try {
    // Verificar se os dados necessários existem
    if (!agendamento.data || !agendamento.hora_inicio || !agendamento.hora_fim) {
      console.warn('⚠️ Agendamento com dados incompletos:', agendamento)
      return null
    }

    // Converter strings de data/hora para objetos Date com fuso horário brasileiro
    const dataAgendamento = new Date(agendamento.data + 'T00:00:00-03:00')
    const [horaInicio, minutoInicio] = agendamento.hora_inicio.split(':').map(Number)
    const [horaFim, minutoFim] = agendamento.hora_fim.split(':').map(Number)

    // Verificar se os valores são válidos
    if (isNaN(horaInicio) || isNaN(minutoInicio) || isNaN(horaFim) || isNaN(minutoFim)) {
      console.warn('⚠️ Horários inválidos no agendamento:', agendamento)
      return null
    }

    const inicio = new Date(dataAgendamento)
    inicio.setHours(horaInicio, minutoInicio, 0, 0)

    const fim = new Date(dataAgendamento)
    fim.setHours(horaFim, minutoFim, 0, 0)

    console.log('🔄 Slot convertido:', {
      titulo: agendamento.titulo,
      inicio: inicio.toLocaleString('pt-BR'),
      fim: fim.toLocaleString('pt-BR'),
      cor: agendamento.cor
    })

    return {
      inicio,
      fim,
      titulo: agendamento.titulo || 'Agendamento',
      descricao: agendamento.descricao || '',
      ocupado: true,
      cor: agendamento.cor || '#FEF2F2',
      agendamentoId: agendamento.id
    }
  } catch (error) {
    console.error('❌ Erro ao converter agendamento:', error, agendamento)
    return null
  }
}

// Computed para obter slots ocupados do dia atual
const slotsOcupados = computed(() => {
  if (!props.agendamentos.length) return []

  // Filtrar agendamentos do dia atual
  // Usar fuso horário brasileiro para comparação
  const dataAtual = new Date(props.data.getTime() - (props.data.getTimezoneOffset() * 60000))
    .toISOString().split('T')[0] // YYYY-MM-DD
  
  console.log('📅 Data atual para comparação:', dataAtual)
  console.log('📋 Agendamentos recebidos:', props.agendamentos)
  
  const agendamentosDoDia = props.agendamentos.filter(agendamento => {
    if (!agendamento.data) return false
    
    // Ajustar data do agendamento para fuso horário brasileiro
    const dataAgendamento = new Date(agendamento.data + 'T00:00:00-03:00')
      .toISOString().split('T')[0]
    
    console.log('🔍 Comparando:', dataAgendamento, '===', dataAtual, '?', dataAgendamento === dataAtual)
    
    return dataAgendamento === dataAtual
  })

  console.log('✅ Agendamentos do dia encontrados:', agendamentosDoDia)

  // Converter para slots e filtrar nulos
  const slots = agendamentosDoDia
    .map(converterAgendamentoParaSlot)
    .filter((slot): slot is SlotAgendamento => slot !== null)
    
  console.log('🎯 Slots finais:', slots)
  
  return slots
})

// Log de desenvolvimento
console.log('📅 ItemAgendamento carregado para data:', props.data.toLocaleDateString('pt-BR'))
</script>

<style scoped>
.item-agendamento {
  width: 100%;
  height: 1500px; /* Altura fixa igual ao ReguaHorarios: 15 horários × 100px = 1500px */
  margin-bottom: 0.5rem;
  margin-top: 0; /* Remove qualquer margin-top para colar no header */
  overflow: hidden;
  transition: box-shadow 0.2s ease;
  background-color: #f1f5f9;
  border: none;
}


.agendamento-content {
  padding: 0;
  height: 100%; /* Usar 100% para ocupar todo o espaço disponível */
  position: relative;
}

.slots-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.sem-agendamentos {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}

.agendamento-placeholder {
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
  font-style: italic;
}

/* Responsividade */
@media (max-width: 768px) {
  .agendamento-content {
    padding: 0.75rem;
    min-height: 60px;
  }
  
  .agendamento-placeholder {
    font-size: 0.8125rem;
  }
}
</style>