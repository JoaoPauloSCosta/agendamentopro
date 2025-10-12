<template>
  <div class="controlador-semana">
    <!-- Primeira linha: Período da semana -->
    <div class="periodo-semana">
      <span class="texto-periodo">
        De {{ formatarDataCurta(inicioSemana) }} até {{ formatarDataCurta(fimSemana) }}
      </span>
    </div>
    
    <!-- Segunda linha: Botões de navegação -->
    <div class="navegacao-semana">
      <button 
        @click="voltarSemana"
        class="btn-navegacao"
        title="Semana anterior"
      >
        <ChevronLeftIcon class="w-5 h-5" />
      </button>
      
      <button 
        @click="avancarSemana"
        class="btn-navegacao"
        title="Próxima semana"
      >
        <ChevronRightIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

// Configuração do componente
defineOptions({
  name: 'ControladorSemana'
})

// Acessar o store de agendamento
const agendamentoStore = useAgendamentoStore()

// Computed para obter início e fim da semana
const inicioSemana = computed(() => {
  const dias = agendamentoStore.diasSemana
  return dias.length > 0 ? dias[0] : new Date()
})

const fimSemana = computed(() => {
  const dias = agendamentoStore.diasSemana
  return dias.length > 0 ? dias[6] : new Date()
})

// Função para formatar data de forma curta (dd/mm)
const formatarDataCurta = (data: Date) => {
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  })
}

// Funções de navegação (delegam para o store)
const avancarSemana = () => {
  agendamentoStore.avancarSemana()
}

const voltarSemana = () => {
  agendamentoStore.voltarSemana()
}

// Log de desenvolvimento
console.log('📅 ControladorSemana carregado')
</script>

<style scoped>
.controlador-semana {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem;
}

.periodo-semana {
  text-align: center;
  margin-bottom: 0.25rem;
}

.texto-periodo {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: 0.025em;
}

.navegacao-semana {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
}

.btn-navegacao {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn-navegacao:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  border-color: #94a3b8;
  color: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-navegacao:active {
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  transform: translateY(0);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn-navegacao:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6;
  ring-opacity: 0.5;
  ring-offset: 2px;
}

/* Responsividade */
@media (max-width: 640px) {
  .controlador-semana {
    gap: 0.5rem;
    padding: 0.25rem;
  }
  
  .texto-periodo {
    font-size: 0.8rem;
  }
  
  .btn-navegacao {
    width: 2rem;
    height: 2rem;
  }
  
  .navegacao-semana {
    gap: 1rem;
  }
}

/* Animação suave para mudanças de texto */
.texto-periodo {
  transition: all 0.3s ease;
}
</style>