import { ref, computed } from 'vue'

export interface AgendamentoExistente {
  id?: number
  data: string
  hora_inicio: string
  hora_fim: string
  data_agendamento?: string
}

export const useValidacaoHorarios = (agendamentosExistentes: AgendamentoExistente[] = []) => {
  // Gerar todos os horários possíveis (08:00 às 22:00)
  const gerarTodosHorarios = (): string[] => {
    const horas: string[] = []
    for (let i = 8; i <= 22; i++) {
      horas.push(`${i.toString().padStart(2, '0')}:00`)
      if (i < 22) {
        horas.push(`${i.toString().padStart(2, '0')}:30`)
      }
    }
    return horas
  }

  // Função para obter todos os slots de 30 minutos ocupados de uma data específica
  const obterSlotsOcupadosDoDia = (data: string): string[] => {
    if (!data) return []
    
    // Verificar se agendamentosExistentes existe e é um array
    if (!agendamentosExistentes || !Array.isArray(agendamentosExistentes)) {
      console.log('⚠️ agendamentosExistentes não é um array válido:', agendamentosExistentes)
      return []
    }
    
    const slotsOcupados: string[] = []
    const todosHorarios = gerarTodosHorarios()
    
    console.log('🔍 Verificando agendamentos para data:', data)
    console.log('📋 Total de agendamentos existentes:', agendamentosExistentes.length)
    
    // Para cada agendamento do dia, marcar todos os slots ocupados
    agendamentosExistentes
      .filter(agendamento => {
        if (!agendamento || !agendamento.data) return false
        
        // Converter a data do agendamento para formato YYYY-MM-DD
        const dataAgendamento = agendamento.data
        console.log('📅 Comparando:', dataAgendamento, 'com', data)
        
        return dataAgendamento === data
      })
      .forEach(agendamento => {
        console.log('🎯 Processando agendamento:', agendamento)
        
        const inicio = agendamento.hora_inicio
        const fim = agendamento.hora_fim
        
        if (!inicio || !fim) {
          console.log('⚠️ Agendamento sem horário válido:', agendamento)
          return
        }
        
        // Extrair apenas a parte do horário (HH:MM) se vier com timezone
        const inicioLimpo = inicio.includes('T') ? inicio.split('T')[1].substring(0, 5) : inicio.substring(0, 5)
        const fimLimpo = fim.includes('T') ? fim.split('T')[1].substring(0, 5) : fim.substring(0, 5)
        
        console.log('⏰ Horários processados - Início:', inicioLimpo, 'Fim:', fimLimpo)
        
        // Encontrar todos os slots entre início e fim (inclusive início, exclusive fim)
        todosHorarios.forEach(slot => {
          if (slot >= inicioLimpo && slot < fimLimpo) {
            if (!slotsOcupados.includes(slot)) {
              slotsOcupados.push(slot)
              console.log('🚫 Slot ocupado adicionado:', slot)
            }
          }
        })
      })
    
    console.log('🕒 Slots ocupados finais para', data, ':', slotsOcupados)
    return slotsOcupados
  }

  // Horários disponíveis (08:00 às 22:00) - filtrados por conflitos
  const obterHorasDisponiveis = (data: string): string[] => {
    const todasHoras = gerarTodosHorarios()
    
    // Se não há data selecionada, retorna todos os horários
    if (!data) return todasHoras
    
    // Obter slots ocupados do dia
    const slotsOcupados = obterSlotsOcupadosDoDia(data)
    
    // Filtrar horários que não estão ocupados
    return todasHoras.filter(hora => !slotsOcupados.includes(hora))
  }

  // Horários fim disponíveis (baseado na hora início) - filtrados por conflitos
  const obterHorasFimDisponiveis = (data: string, horaInicio: string): string[] => {
    if (!horaInicio) return []
    
    const todasHoras = gerarTodosHorarios()
    const horaInicioIndex = todasHoras.indexOf(horaInicio)
    if (horaInicioIndex === -1) return []
    
    // Horários após a hora início
    const horasAposInicio = todasHoras.slice(horaInicioIndex + 1)
    
    // Se não há data selecionada, retorna todos os horários após início
    if (!data) return horasAposInicio
    
    // Obter slots ocupados do dia
    const slotsOcupados = obterSlotsOcupadosDoDia(data)
    
    // Filtrar horários que não estão ocupados
    return horasAposInicio.filter(hora => !slotsOcupados.includes(hora))
  }

  // Função para verificar se um horário está ocupado
  const verificarHorarioOcupado = (data: string, horaInicio: string, horaFim: string): boolean => {
    if (!data || !horaInicio || !horaFim) return false
    
    // Filtrar agendamentos da data selecionada
    const agendamentosDoDia = agendamentosExistentes.filter(agendamento => {
      const dataAgendamento = agendamento.data_agendamento 
        ? new Date(agendamento.data_agendamento).toISOString().split('T')[0]
        : agendamento.data
      return dataAgendamento === data
    })
    
    // Verificar se há conflito com algum agendamento existente
    return agendamentosDoDia.some(agendamento => {
      const inicioExistente = agendamento.hora_inicio
      const fimExistente = agendamento.hora_fim
      
      // Verificar sobreposição de horários
      // Há conflito se:
      // 1. O novo início está entre o início e fim existente
      // 2. O novo fim está entre o início e fim existente  
      // 3. O novo horário engloba completamente o existente
      // 4. O existente engloba completamente o novo
      return (
        (horaInicio >= inicioExistente && horaInicio < fimExistente) ||
        (horaFim > inicioExistente && horaFim <= fimExistente) ||
        (horaInicio <= inicioExistente && horaFim >= fimExistente) ||
        (inicioExistente <= horaInicio && fimExistente >= horaFim)
      )
    })
  }

  // Função para obter horários ocupados de uma data específica
  const obterHorariosOcupadosDoDia = (data: string): Array<{inicio: string, fim: string}> => {
    if (!data) return []
    
    return agendamentosExistentes
      .filter(agendamento => {
        const dataAgendamento = agendamento.data_agendamento 
          ? new Date(agendamento.data_agendamento).toISOString().split('T')[0]
          : agendamento.data
        return dataAgendamento === data
      })
      .map(agendamento => ({
        inicio: agendamento.hora_inicio,
        fim: agendamento.hora_fim
      }))
  }

  // Função para validar se um horário é válido
  const validarHorario = (data: string, horaInicio: string, horaFim: string): { valido: boolean, erro?: string } => {
    if (!data || !horaInicio || !horaFim) {
      return { valido: false, erro: 'Todos os campos de horário são obrigatórios' }
    }

    // Verificar se hora fim é posterior à hora início
    if (horaFim <= horaInicio) {
      return { valido: false, erro: 'Hora fim deve ser posterior à hora início' }
    }

    // Verificar se há conflito com horários existentes
    if (verificarHorarioOcupado(data, horaInicio, horaFim)) {
      return { valido: false, erro: 'Este horário conflita com um agendamento existente' }
    }

    return { valido: true }
  }

  return {
    gerarTodosHorarios,
    obterSlotsOcupadosDoDia,
    obterHorasDisponiveis,
    obterHorasFimDisponiveis,
    verificarHorarioOcupado,
    obterHorariosOcupadosDoDia,
    validarHorario
  }
}