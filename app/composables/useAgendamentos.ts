import { ref } from 'vue'
import type { AgAgendamento, AgAgendamentoInsert, AgAgendamentoCompleto, AgRelatorioFiltros } from '~/types/database'

/**
 * Interface para cache de agendamentos por semana
 */
interface CacheAgendamentos {
  [chaveCache: string]: {
    dados: AgAgendamento[]
    timestamp: number
  }
}

/**
 * Composable para gerenciar agendamentos
 */
export const useAgendamentos = () => {
  // Estado reativo
  const agendamentos = ref<AgAgendamento[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Cache de agendamentos por semana
  const cache = ref<CacheAgendamentos>({})
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos em millisegundos

  // Cliente Supabase
  const supabase = useSupabaseClient()

  /**
   * Gera chave única para o cache baseada no profissional e período da semana
   */
  const gerarChaveCache = (profissionalId: number, inicioSemana: Date, fimSemana: Date): string => {
    const inicio = inicioSemana.toISOString().split('T')[0]
    const fim = fimSemana.toISOString().split('T')[0]
    return `${profissionalId}_${inicio}_${fim}`
  }

  /**
   * Verifica se o cache é válido (não expirou)
   */
  const cacheValido = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_DURATION
  }

  /**
   * Busca agendamentos por profissional e período da semana
   * Filtra apenas agendamentos não cancelados (cancelado = false)
   * Implementa cache para evitar buscas desnecessárias
   * 
   * @param profissionalId - ID do profissional
   * @param inicioSemana - Data de início da semana
   * @param fimSemana - Data de fim da semana
   * @returns Promise<AgAgendamento[]> - Lista de agendamentos
   */
  const buscarAgendamentosPorProfissionalESemana = async (
    profissionalId: number, 
    inicioSemana: Date, 
    fimSemana: Date
  ): Promise<AgAgendamento[]> => {
    try {
      loading.value = true
      error.value = null

      // Gerar chave do cache
      const chaveCache = gerarChaveCache(profissionalId, inicioSemana, fimSemana)
      
      // Verificar se existe no cache e se é válido
      const dadosCache = cache.value[chaveCache]
      if (dadosCache && cacheValido(dadosCache.timestamp)) {
        console.log('📦 Usando dados do cache para:', chaveCache)
        agendamentos.value = dadosCache.dados
        return dadosCache.dados
      }

      console.log('🔍 Buscando agendamentos para profissional:', profissionalId)
      console.log('📅 Período:', inicioSemana.toLocaleDateString('pt-BR'), 'até', fimSemana.toLocaleDateString('pt-BR'))

      // Converter datas para formato ISO (YYYY-MM-DD) para a query
      const dataInicio = inicioSemana.toISOString().split('T')[0]
      const dataFim = fimSemana.toISOString().split('T')[0]

      const { data, error: supabaseError } = await supabase
        .from('ag_agendamentos')
        .select(`
          *,
          cliente:ag_clientes(
            id,
            nome,
            cpf,
            email,
            telefone
          )
        `)
        .eq('profissional_id', profissionalId)
        .eq('cancelado', false) // Apenas agendamentos não cancelados
        .gte('data', dataInicio) // Maior ou igual à data de início
        .lte('data', dataFim) // Menor ou igual à data de fim
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true })

      if (supabaseError) {
        console.error('❌ Erro ao buscar agendamentos:', supabaseError)
        error.value = supabaseError.message
        throw supabaseError
      }

      console.log('✅ Agendamentos encontrados:', data?.length || 0)
      
      const resultados = data || []
      
      // Salvar no cache
      cache.value[chaveCache] = {
        dados: resultados,
        timestamp: Date.now()
      }
      
      // Atualizar estado reativo
      agendamentos.value = resultados
      
      return resultados
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar agendamentos'
      console.error('❌ Erro na busca de agendamentos:', errorMessage)
      error.value = errorMessage
      agendamentos.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca agendamentos por profissional (função original mantida para compatibilidade)
   * @deprecated Use buscarAgendamentosPorProfissionalESemana para melhor performance
   */
  const buscarAgendamentosPorProfissional = async (profissionalId: number): Promise<AgAgendamento[]> => {
    try {
      loading.value = true
      error.value = null

      console.log('🔍 Buscando agendamentos para profissional:', profissionalId)

      const { data, error: supabaseError } = await supabase
        .from('ag_agendamentos')
        .select('*')
        .eq('profissional_id', profissionalId)
        .eq('cancelado', false) // Apenas agendamentos não cancelados
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true })

      if (supabaseError) {
        console.error('❌ Erro ao buscar agendamentos:', supabaseError)
        error.value = supabaseError.message
        throw supabaseError
      }

      console.log('✅ Agendamentos encontrados:', data?.length || 0)
      
      // Atualizar estado reativo
      agendamentos.value = data || []
      
      return data || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar agendamentos'
      console.error('❌ Erro na busca de agendamentos:', errorMessage)
      error.value = errorMessage
      agendamentos.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Limpa o cache (útil para forçar nova busca)
   */
  const limparCache = () => {
    console.log('🗑️ Limpando cache de agendamentos...')
    cache.value = {}
    // Também limpar o estado reativo para forçar nova busca
    agendamentos.value = []
    console.log('✅ Cache limpo e estado reativo resetado')
  }

  /**
   * Insere um novo agendamento no banco de dados
   * 
   * @param dadosAgendamento - Dados do agendamento para inserção
   * @returns Promise<AgAgendamento> - Agendamento criado
   */
  const inserirAgendamento = async (dadosAgendamento: {
    profissionalId: string | null
    clienteId: string
    titulo: string
    descricao?: string
    data: string
    horaInicio: string
    horaFim: string
    cor: string
  }): Promise<AgAgendamento> => {
    try {
      loading.value = true
      error.value = null

      console.log('📝 Inserindo novo agendamento:', dadosAgendamento)

      // Obter o usuário atual
      const user = useSupabaseUser()
      const userStore = useUserStore()
      
      console.log('👤 useSupabaseUser():', user.value)
      console.log('👤 userStore.user:', userStore.user)
      console.log('👤 userStore.isAuthenticated:', userStore.isAuthenticated)
      
      // Tentar obter o userId de diferentes fontes
      let userId = user.value?.id || user.value?.sub || userStore.user?.id || userStore.user?.sub
      
      console.log('👤 User ID atual:', userId)

      if (!userId) {
        const errorMessage = 'Usuário não autenticado. Faça login para continuar.'
        console.error('❌', errorMessage)
        console.error('❌ Debug - user.value:', user.value)
        console.error('❌ Debug - userStore:', {
          user: userStore.user,
          isAuthenticated: userStore.isAuthenticated,
          profile: userStore.profile
        })
        error.value = errorMessage
        
        // Redirecionar para login se não estiver autenticado
        await navigateTo('/login')
        throw new Error(errorMessage)
      }

      // Preparar dados para inserção no formato esperado pelo Supabase
      // Ajustar data para fuso horário brasileiro (GMT-3)
      const dataLocal = new Date(dadosAgendamento.data + 'T00:00:00')
      
      // Para salvar no banco com timezone -03:00, precisamos ajustar a data
      // Se queremos que apareça como -03:00 no banco, não precisamos fazer conversão
      // Vamos apenas formatar a data e adicionar o timezone brasileiro nos horários
      const dataFormatada = dadosAgendamento.data // Manter a data original
      
      // Ajustar os horários para incluir o timezone brasileiro (apenas se não tiver timezone)
      const horaInicioComTimezone = dadosAgendamento.horaInicio.includes('-') || dadosAgendamento.horaInicio.includes('+') 
        ? dadosAgendamento.horaInicio 
        : dadosAgendamento.horaInicio + '-03:00'
      const horaFimComTimezone = dadosAgendamento.horaFim.includes('-') || dadosAgendamento.horaFim.includes('+') 
        ? dadosAgendamento.horaFim 
        : dadosAgendamento.horaFim + '-03:00'
      
      console.log('🕐 Data original:', dadosAgendamento.data)
      console.log('🕐 Data formatada final:', dataFormatada)
      console.log('🕐 Hora início com timezone:', horaInicioComTimezone)
      console.log('🕐 Hora fim com timezone:', horaFimComTimezone)

      const agendamentoParaInserir: AgAgendamentoInsert = {
        user_id: userId,
        profissional_id: dadosAgendamento.profissionalId || null,
        cliente_id: parseInt(dadosAgendamento.clienteId),
        data: dataFormatada,
        hora_inicio: horaInicioComTimezone,
        hora_fim: horaFimComTimezone,
        titulo: dadosAgendamento.titulo,
        descricao: dadosAgendamento.descricao || null,
        cancelado: false,
        cor: dadosAgendamento.cor
        // id e created_at são preenchidos automaticamente pelo Supabase
      }

      console.log('🔄 Dados formatados para inserção:', agendamentoParaInserir)

      const { data, error: supabaseError } = await supabase
        .from('ag_agendamentos')
        .insert(agendamentoParaInserir)
        .select()
        .single()

      if (supabaseError) {
        console.error('❌ Erro ao inserir agendamento:', supabaseError)
        error.value = supabaseError.message
        throw supabaseError
      }

      if (!data) {
        const errorMessage = 'Nenhum dado retornado após inserção'
        console.error('❌', errorMessage)
        error.value = errorMessage
        throw new Error(errorMessage)
      }

      console.log('✅ Agendamento inserido com sucesso:', data)
      
      // Limpar cache para forçar nova busca na próxima consulta
      limparCache()
      console.log('🗑️ Cache limpo após inserção do agendamento')
      console.log('🔍 Estado do cache após limpeza:', Object.keys(cache.value))
      
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao inserir agendamento'
      console.error('❌ Erro na inserção de agendamento:', errorMessage)
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Atualiza um agendamento existente no banco de dados
   * 
   * @param agendamentoId - ID do agendamento a ser atualizado
   * @param dadosAtualizacao - Dados para atualização (título, descrição, cor)
   * @returns Promise<AgAgendamento> - Agendamento atualizado
   */
  const atualizarAgendamento = async (agendamentoId: number, dadosAtualizacao: {
    titulo?: string
    descricao?: string
    cor?: string
  }): Promise<AgAgendamento> => {
    try {
      loading.value = true
      error.value = null

      console.log('📝 Atualizando agendamento ID:', agendamentoId, 'com dados:', dadosAtualizacao)

      // Obter o usuário atual
      const user = useSupabaseUser()
      const userStore = useUserStore()
      
      let userId = user.value?.id || user.value?.sub || userStore.user?.id || userStore.user?.sub

      if (!userId) {
        const errorMessage = 'Usuário não autenticado. Faça login para continuar.'
        console.error('❌', errorMessage)
        error.value = errorMessage
        await navigateTo('/login')
        throw new Error(errorMessage)
      }

      // Primeiro, verificar se o agendamento existe e pertence ao usuário
      const { data: agendamentoExistente, error: errorVerificacao } = await supabase
        .from('ag_agendamentos')
        .select('id, user_id')
        .eq('id', agendamentoId)
        .single()

      if (errorVerificacao || !agendamentoExistente) {
        const errorMessage = 'Agendamento não encontrado'
        console.error('❌', errorMessage, errorVerificacao)
        error.value = errorMessage
        throw new Error(errorMessage)
      }

      if (agendamentoExistente.user_id !== userId) {
        const errorMessage = 'Você não tem permissão para atualizar este agendamento'
        console.error('❌', errorMessage)
        error.value = errorMessage
        throw new Error(errorMessage)
      }

      const { data, error: supabaseError } = await supabase
        .from('ag_agendamentos')
        .update(dadosAtualizacao)
        .eq('id', agendamentoId)
        .select(`
          *,
          cliente:ag_clientes(
            id,
            nome,
            cpf,
            email,
            telefone
          )
        `)
        .single()

      if (supabaseError) {
        console.error('❌ Erro ao atualizar agendamento:', supabaseError)
        error.value = supabaseError.message
        throw supabaseError
      }

      if (!data) {
        const errorMessage = 'Nenhum dado retornado após atualização'
        console.error('❌', errorMessage)
        error.value = errorMessage
        throw new Error(errorMessage)
      }

      console.log('✅ Agendamento atualizado com sucesso:', data)
      
      // Limpar cache para forçar nova busca na próxima consulta
      limparCache()
      console.log('🗑️ Cache limpo após atualização do agendamento')
      
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao atualizar agendamento'
      console.error('❌ Erro na atualização de agendamento:', errorMessage)
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Cancela um agendamento (marca como cancelado)
   * 
   * @param agendamentoId - ID do agendamento a ser cancelado
   * @returns Promise<AgAgendamento> - Agendamento cancelado
   */
  const cancelarAgendamento = async (agendamentoId: number): Promise<AgAgendamento> => {
    try {
      loading.value = true
      error.value = null

      console.log('🗑️ Cancelando agendamento ID:', agendamentoId)

      // Obter o usuário atual
      const user = useSupabaseUser()
      const userStore = useUserStore()
      
      let userId = user.value?.id || user.value?.sub || userStore.user?.id || userStore.user?.sub

      if (!userId) {
        const errorMessage = 'Usuário não autenticado. Faça login para continuar.'
        console.error('❌', errorMessage)
        error.value = errorMessage
        await navigateTo('/login')
        throw new Error(errorMessage)
      }

      const { data, error: supabaseError } = await supabase
        .from('ag_agendamentos')
        .update({
          cancelado: true,
          cancelado_as: new Date().toISOString()
        })
        .eq('id', agendamentoId)
        .eq('user_id', userId) // Garantir que só pode cancelar seus próprios agendamentos
        .select()
        .single()

      if (supabaseError) {
        console.error('❌ Erro ao cancelar agendamento:', supabaseError)
        error.value = supabaseError.message
        throw supabaseError
      }

      if (!data) {
        const errorMessage = 'Nenhum dado retornado após cancelamento'
        console.error('❌', errorMessage)
        error.value = errorMessage
        throw new Error(errorMessage)
      }

      console.log('✅ Agendamento cancelado com sucesso:', data)
      
      // Limpar cache para forçar nova busca na próxima consulta
      limparCache()
      console.log('🗑️ Cache limpo após cancelamento do agendamento')
      
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao cancelar agendamento'
      console.error('❌ Erro no cancelamento de agendamento:', errorMessage)
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca relatório completo de agendamentos com filtros
   * Utiliza a função RPC fn_agendamentos_completos que já traz todos os dados relacionados
   * 
   * @param filtros - Filtros opcionais para a busca
   * @returns Promise<AgAgendamentoCompleto[]> - Lista de agendamentos completos
   */
  const buscarRelatorioAgendamentos = async (filtros?: AgRelatorioFiltros): Promise<AgAgendamentoCompleto[]> => {
    try {
      loading.value = true
      error.value = null

      console.log('📊 Buscando relatório de agendamentos com filtros:', filtros)

      // Chamar a função RPC do Supabase
      const { data, error: supabaseError } = await supabase.rpc('fn_agendamentos_completos')

      if (supabaseError) {
        console.error('❌ Erro ao buscar relatório de agendamentos:', supabaseError)
        error.value = supabaseError.message
        throw supabaseError
      }

      console.log('✅ Relatório de agendamentos encontrado:', data?.length || 0, 'registros')
      
      let resultados = data || []

      // Aplicar filtros no lado do cliente (já que a RPC retorna todos os dados)
      if (filtros) {
        // Filtro por data de início
        if (filtros.dataInicio) {
          resultados = resultados.filter((ag: AgAgendamentoCompleto) => 
            ag.data && ag.data >= filtros.dataInicio!
          )
          console.log('📅 Filtro data início aplicado:', filtros.dataInicio)
        }

        // Filtro por data de fim
        if (filtros.dataFim) {
          resultados = resultados.filter((ag: AgAgendamentoCompleto) => 
            ag.data && ag.data <= filtros.dataFim!
          )
          console.log('📅 Filtro data fim aplicado:', filtros.dataFim)
        }

        // Filtro por profissional
        if (filtros.profissionalId) {
          console.log('👨‍⚕️ Filtrando por profissional ID:', filtros.profissionalId)
          console.log('📊 Total de agendamentos antes do filtro:', resultados.length)
          
          // Log dos primeiros 3 agendamentos para debug
          resultados.slice(0, 3).forEach((ag: AgAgendamentoCompleto, index: number) => {
            console.log(`Agendamento ${index + 1}:`, {
              id: ag.id,
              profissional_id: ag.profissional_id,
              profissional_nome: ag.profissional_nome,
              cliente_nome: ag.cliente_nome
            })
          })
          
          resultados = resultados.filter((ag: AgAgendamentoCompleto) => 
            ag.profissional_id === filtros.profissionalId
          )
          console.log('✅ Filtro profissional aplicado. Resultados:', resultados.length)
        }

        // Filtro por cliente
        if (filtros.clienteId) {
          resultados = resultados.filter((ag: AgAgendamentoCompleto) => 
            ag.cliente_id === filtros.clienteId
          )
          console.log('👤 Filtro cliente ID aplicado:', filtros.clienteId)
        }

        // Filtro por especialidade
        if (filtros.especialidadeId) {
          resultados = resultados.filter((ag: AgAgendamentoCompleto) => 
            ag.profissional_especialidade_id === filtros.especialidadeId
          )
          console.log('🏥 Filtro especialidade ID aplicado:', filtros.especialidadeId)
        }

        // Filtro para incluir ou não cancelados (padrão: não incluir)
        if (!filtros.incluirCancelados) {
          resultados = resultados.filter((ag: AgAgendamentoCompleto) => !ag.cancelado)
          console.log('🚫 Excluindo agendamentos cancelados')
        } else {
          console.log('✅ Incluindo agendamentos cancelados')
        }
      } else {
        // Se não há filtros, por padrão não incluir cancelados
        resultados = resultados.filter((ag: AgAgendamentoCompleto) => !ag.cancelado)
        console.log('🚫 Sem filtros - excluindo agendamentos cancelados por padrão')
      }

      // Ordenar por data e hora (do mais atual para o mais antigo)
      resultados.sort((a: AgAgendamentoCompleto, b: AgAgendamentoCompleto) => {
        // Ordenar por data primeiro (decrescente)
        if (a.data && b.data) {
          const dataCompare = b.data.localeCompare(a.data) // Invertido para decrescente
          if (dataCompare !== 0) return dataCompare
        }
        
        // Se as datas são iguais, ordenar por hora_inicio (decrescente)
        if (a.hora_inicio && b.hora_inicio) {
          return b.hora_inicio.localeCompare(a.hora_inicio) // Invertido para decrescente
        }
        
        return 0
      })

      console.log('✅ Filtros aplicados. Total de registros:', resultados.length)
      
      return resultados
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar relatório de agendamentos'
      console.error('❌ Erro na busca de relatório de agendamentos:', errorMessage)
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  // Retornar estado e funções
  return {
    // Estado reativo
    agendamentos: readonly(agendamentos),
    loading: readonly(loading),
    error: readonly(error),
    
    // Funções
    buscarAgendamentosPorProfissional,
    buscarAgendamentosPorProfissionalESemana,
    inserirAgendamento,
    atualizarAgendamento,
    cancelarAgendamento,
    limparCache,
    buscarRelatorioAgendamentos
  }
}

/**
 * EXEMPLOS DE USO DA FUNÇÃO buscarRelatorioAgendamentos:
 * 
 * NOTA: Esta função utiliza a RPC fn_agendamentos_completos do Supabase
 * que respeita as políticas RLS (Row Level Security) do banco de dados.
 * Os filtros são aplicados no lado do cliente após buscar os dados.
 * 
 * // 1. Buscar todos os agendamentos não cancelados (padrão)
 * const relatorio = await buscarRelatorioAgendamentos()
 * 
 * // 2. Buscar agendamentos de um período específico
 * const relatorio = await buscarRelatorioAgendamentos({
 *   dataInicio: '2025-01-01',
 *   dataFim: '2025-01-31'
 * })
 * 
 * // 3. Buscar agendamentos de um profissional específico
 * const relatorio = await buscarRelatorioAgendamentos({
 *   profissionalId: 1
 * })
 * 
 * // 4. Buscar agendamentos de um cliente específico
 * const relatorio = await buscarRelatorioAgendamentos({
 *   clienteId: 5
 * })
 * 
 * // 5. Buscar agendamentos de uma especialidade específica
 * const relatorio = await buscarRelatorioAgendamentos({
 *   especialidadeId: 2
 * })
 * 
 * // 6. Buscar incluindo agendamentos cancelados
 * const relatorio = await buscarRelatorioAgendamentos({
 *   incluirCancelados: true
 * })
 * 
 * // 7. Buscar com múltiplos filtros combinados
 * const relatorio = await buscarRelatorioAgendamentos({
 *   dataInicio: '2025-01-01',
 *   dataFim: '2025-01-31',
 *   profissionalId: 1,
 *   especialidadeId: 2,
 *   incluirCancelados: false
 * })
 * 
 * // ESTRUTURA DO RETORNO (AgAgendamentoCompleto):
 * // {
 * //   id: 1,
 * //   created_at: '2025-01-15T10:00:00',
 * //   user_id: 'uuid-do-usuario',
 * //   profissional_id: 1,
 * //   cliente_id: 5,
 * //   data: '2025-01-20',
 * //   hora_inicio: '14:00:00-03:00',
 * //   hora_fim: '15:00:00-03:00',
 * //   titulo: 'Consulta',
 * //   descricao: 'Consulta de rotina',
 * //   cancelado: false,
 * //   cancelado_as: null,
 * //   cor: '#fee2e2',
 * //   cliente_nome: 'João Silva',
 * //   cliente_cpf: '123.456.789-00',
 * //   profissional_profile_id: 10,
 * //   profissional_nome: 'Dra. Maria Santos',
 * //   profissional_especialidade_id: 2,
 * //   profissional_especialidade_nome: 'Cardiologia'
 * // }
 */