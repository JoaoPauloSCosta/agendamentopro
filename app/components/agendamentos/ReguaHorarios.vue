<template>
  <div class="regua-horarios">
    <div class="horarios-lista">
      <div 
        v-for="horario in horarios" 
        :key="horario"
        class="horario-item"
      >
        {{ horario }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuração do componente
defineOptions({
  name: 'ReguaHorarios'
})

import { computed } from 'vue'

// Gerar lista de horários das 8h às 22h
const horarios = computed(() => {
  const listaHorarios: string[] = []
  
  for (let hora = 8; hora <= 22; hora++) {
    listaHorarios.push(`${hora.toString().padStart(2, '0')}:00`)
  }
  
  return listaHorarios
})

// Log de desenvolvimento
console.log('⏰ ReguaHorarios carregado')
</script>

<style scoped>
.regua-horarios {
  width: 100%;
  height: 100%;
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.horarios-lista {
  display: flex;
  flex-direction: column;
  height: 1500px; /* Altura fixa: 15 horários × 100px = 1500px */
}

.horario-item {
  padding: 0.125rem 0.125rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.625rem;
  font-weight: 500;
  color: #64748b;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.horario-item:hover {
  background-color: #e2e8f0;
  color: #374151;
}

.horario-item:last-child {
  border-bottom: none;
}

/* Responsividade */
@media (max-width: 768px) {
  .horario-item {
    padding: 0.5rem;
    font-size: 0.75rem;
    min-height: 50px;
  }
}
</style>