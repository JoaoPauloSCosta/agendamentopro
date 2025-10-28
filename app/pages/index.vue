<template>
  <NuxtLayout>
    <div class="h-full overflow-y-auto">
      <!-- Componente principal de gerenciamento de agendamentos -->
      <AgendamentoManager />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Página principal do dashboard - Agendamentos
// Utiliza o componente AgendamentoManager para gerenciar todos os agendamentos

// Import explícito do componente AgendamentoManager
import AgendamentoManager from '~/components/agendamentos/AgendamentoManager.vue'

// Inicializar o store de agendamento
const agendamentoStore = useAgendamentoStore()

// Log de desenvolvimento

console.log('📅 Store de agendamento inicializado:', {
  dataReferencia: agendamentoStore.formatarData(agendamentoStore.dataReferencia),
  diasSemana: agendamentoStore.diasSemana.map(dia => agendamentoStore.formatarData(dia))
})
</script>