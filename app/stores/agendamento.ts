import { defineStore } from 'pinia'

export const useAgendamentoStore = defineStore('agendamento', () => {
  // Data de referência - inicializada com a data atual
  const dataReferencia = ref(new Date())

  // Computed para calcular os dias da semana baseado na data de referência
  const diasSemana = computed(() => {
    const dias = []
    const dataRef = new Date(dataReferencia.value)
    
    // Encontrar o domingo da semana da data de referência
    const diaDaSemana = dataRef.getDay() // 0 = domingo, 1 = segunda, etc.
    const domingo = new Date(dataRef)
    domingo.setDate(dataRef.getDate() - diaDaSemana)
    
    // Gerar os 7 dias da semana (domingo a sábado)
    for (let i = 0; i < 7; i++) {
      const dia = new Date(domingo)
      dia.setDate(domingo.getDate() + i)
      dias.push(new Date(dia))
    }
    
    return dias
  })

  // Função para avançar uma semana (soma 7 dias)
  const avancarSemana = () => {
    const novaData = new Date(dataReferencia.value)
    novaData.setDate(novaData.getDate() + 7)
    dataReferencia.value = novaData
  }

  // Função para voltar uma semana (subtrai 7 dias)
  const voltarSemana = () => {
    const novaData = new Date(dataReferencia.value)
    novaData.setDate(novaData.getDate() - 7)
    dataReferencia.value = novaData
  }

  // Função auxiliar para formatar data (opcional)
  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Função auxiliar para obter nome do dia da semana (opcional)
  const obterNomeDia = (data: Date) => {
    const nomes = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    return nomes[data.getDay()]
  }

  return {
    // Estados - dataReferencia deve ser mutável para permitir alterações diretas
    dataReferencia,
    diasSemana: readonly(diasSemana),
    
    // Ações
    avancarSemana,
    voltarSemana,
    
    // Utilitários
    formatarData,
    obterNomeDia
  }
})