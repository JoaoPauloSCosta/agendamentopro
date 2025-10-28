<template>
  <div 
    class="slot-agendamento ocupado"
    :style="{
      height: `${calcularAltura()}px`,
      top: `${calcularPosicaoTop()}px`,
      position: 'absolute',
      width: '100%',
      backgroundColor: cor,
      border: `1px solid ${cor}`
    }"
    @click="handleClick"
  >
    <!-- Horário do agendamento -->
    <div class="horario">
      {{ formatarHorario(inicio) }} - {{ formatarHorario(fim) }}
    </div>
    
    <!-- Conteúdo do agendamento -->
    <div class="conteudo">
      <h4 class="titulo">{{ titulo }}</h4>
      <!-- Mostrar descrição apenas se houver espaço suficiente, limitada a uma linha -->
      <p v-if="temEspacoParaDescricao" class="descricao">{{ descricaoUmaLinha }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Configuração do componente
defineOptions({
  name: 'SlotAgendamento'
})

// Props do componente
interface Props {
  inicio: Date      // Data/hora de início do agendamento
  fim: Date         // Data/hora de fim do agendamento  
  titulo: string    // Título do agendamento
  descricao: string // Descrição do agendamento
  ocupado?: boolean // Status se o slot está ocupado (padrão: false)
  cor?: string      // Cor do agendamento (hexadecimal)
  agendamentoId?: number // ID do agendamento para edição
}

const props = withDefaults(defineProps<Props>(), {
  ocupado: false,
  cor: '#FEF2F2',
  agendamentoId: undefined
})

// Emits
const emit = defineEmits<{
  click: [agendamentoId?: number]
}>()

// Função para lidar com o clique
const handleClick = () => {

  emit('click', props.agendamentoId)
}

// Formatação de horário
const formatarHorario = (data: Date): string => {
  return data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Função para calcular duração do slot
const calcularDuracao = (): number => {
  return Math.round((props.fim.getTime() - props.inicio.getTime()) / (1000 * 60)) // em minutos
}

// Constantes para sincronização com ReguaHorarios
const ALTURA_HORARIO_REGUA = 100 // altura de cada item da régua em px (100px por hora)
const HORA_INICIO = 8 // primeira hora da régua
const MINUTOS_POR_PIXEL = 60 / ALTURA_HORARIO_REGUA // quantos minutos cada pixel representa (0.6 min/px)

// Função para calcular altura proporcional baseada na duração
const calcularAltura = (): number => {
  const duracaoMinutos = calcularDuracao()
  return duracaoMinutos / MINUTOS_POR_PIXEL
}

// Função para calcular posição vertical baseada no horário de início
const calcularPosicaoTop = (): number => {
  const horaInicio = props.inicio.getHours()
  const minutoInicio = props.inicio.getMinutes()
  
  // Calcular quantos minutos desde o início da régua (8h)
  const minutosTotais = (horaInicio - HORA_INICIO) * 60 + minutoInicio
  
  // Converter para pixels
  return minutosTotais / MINUTOS_POR_PIXEL
}

// Computed para verificar se há espaço suficiente para mostrar a descrição
const temEspacoParaDescricao = computed(() => {
  const alturaSlot = calcularAltura()
  // Altura mínima necessária: horário (18px) + título (18px) + descrição (16px) + paddings
  const alturaMinimaNecessaria = 60
  return alturaSlot >= alturaMinimaNecessaria
})

// Computed para verificar se a descrição cabe em uma linha
const descricaoUmaLinha = computed(() => {
  if (!props.descricao) return ''
  
  // Estimar se a descrição cabe em uma linha (aproximadamente 25-30 caracteres)
  const limiteCaracteres = 30
  
  if (props.descricao.length <= limiteCaracteres) {
    return props.descricao
  } else {
    // Truncar e adicionar reticências
    return props.descricao.substring(0, limiteCaracteres - 3) + '...'
  }
})
</script>

<style scoped>
.slot-agendamento {
  background-color: #f8fafc;
  border-radius: 0.375rem;
  padding: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
  box-sizing: border-box;
  overflow: hidden;
}

.ocupado {
  background-color: #fef2f2;
}

.horario {
  font-weight: 600;
  color: #475569;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.conteudo {
  flex: 1;
  overflow: hidden;
}

.titulo {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.125rem 0;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.descricao {
  font-size: 0.6875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* Força uma única linha */
}
</style>