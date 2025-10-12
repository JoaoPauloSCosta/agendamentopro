<template>
  <div class="item-agendamento">
    <div class="agendamento-header">
      <span class="agendamento-data">{{ formatarData(data) }}</span>
    </div>
    <div class="agendamento-content">
      <p class="agendamento-placeholder">Slots de agendamento para {{ formatarData(data) }}</p>
      <!-- Aqui serão listados os slots de agendamento futuramente -->
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuração do componente
defineOptions({
  name: 'ItemAgendamento'
})

// Props - recebe uma data
interface Props {
  data: Date
}

const props = defineProps<Props>()

// Função para formatar a data
const formatarData = (data: Date): string => {
  return data.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit'
  })
}

// Log de desenvolvimento
console.log('📅 ItemAgendamento carregado para:', formatarData(props.data))
</script>

<style scoped>
.item-agendamento {
  width: 100%;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.item-agendamento:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.agendamento-header {
  background-color: #f9fafb;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.agendamento-data {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: capitalize;
}

.agendamento-content {
  padding: 1rem;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agendamento-placeholder {
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
  font-style: italic;
}

/* Responsividade */
@media (max-width: 768px) {
  .agendamento-header {
    padding: 0.5rem 0.75rem;
  }
  
  .agendamento-content {
    padding: 0.75rem;
    min-height: 60px;
  }
  
  .agendamento-data {
    font-size: 0.8125rem;
  }
  
  .agendamento-placeholder {
    font-size: 0.8125rem;
  }
}
</style>