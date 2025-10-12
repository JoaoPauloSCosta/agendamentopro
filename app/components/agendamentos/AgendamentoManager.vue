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
          <ProfissionalAtual />
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
        <ListaDias :dias="agendamentoStore.diasSemana" />
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
            :key="index"
            :data="dia"
          />
        </div>
      </div>
    </div>
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
// Importar o store de agendamento
import { useAgendamentoStore } from '~/stores/agendamento'

// Configuração do componente
defineOptions({
  name: 'AgendamentoManager'
})

// Store de agendamento
const agendamentoStore = useAgendamentoStore()

// Função para criar novo agendamento
const criarNovoAgendamento = () => {
  console.log('🆕 Criar novo agendamento')
  // TODO: Implementar lógica para abrir modal ou navegar para formulário
}

// Log de desenvolvimento
console.log('📋 AgendamentoManager carregado')
</script>

<style scoped>
.agendamento-manager {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
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
  overflow: hidden;
}

.corpo-esquerdo {
  width: 100px;
  flex-shrink: 0;
  height: 100%;
}

.corpo-direito {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.agendamentos-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  height: 100%;
}
</style>