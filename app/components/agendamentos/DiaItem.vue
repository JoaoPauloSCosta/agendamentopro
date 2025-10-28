<template>
  <div class="dia-item">
    <div class="dia-numero">
      {{ formatarDia(data) }}
    </div>
    <div class="dia-nome">
      {{ obterNomeDia(data) }}
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuração do componente
defineOptions({
  name: 'DiaItem'
})

// Props - recebe uma data
interface Props {
  data: Date
}

const props = defineProps<Props>()

// Função para formatar o dia (apenas número)
const formatarDia = (data: Date): string => {
  return data.getDate().toString()
}

// Função para obter nome do dia da semana abreviado
const obterNomeDia = (data: Date): string => {
  const nomesDias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
  return nomesDias[data.getDay()] || ''
}
</script>

<style scoped>
.dia-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.75rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
  background-color: #cbd5e1;

  min-height: 60px;
  justify-content: center;
}



.dia-numero {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.dia-nome {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;
}

/* Estado ativo/selecionado */
.dia-item.ativo {
  background-color: #3b82f6;
  border-color: #2563eb;
  color: white;
}

.dia-item.ativo .dia-numero {
  color: white;
}

.dia-item.ativo .dia-nome {
  color: #dbeafe;
}

.dia-item.ativo:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}
</style>