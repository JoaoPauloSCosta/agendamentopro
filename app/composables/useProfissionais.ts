import type { AgEspecialidade, AgAddEspecialidadeResponse, AgProfissional, AgPerfil, AgCliente } from '~/types/database'

export const useProfissionais = () => {
  const supabase = useSupabaseClient()

  // Buscar profissionais
  const buscarProfissionais = async (): Promise<AgProfissional[]> => {
    try {
      // @ts-ignore - RPC function not in generated types
      const { data, error } = await supabase
        .rpc('ag_get_profissionais')

      if (error) {
        console.error('Erro ao buscar profissionais:', error)
        throw new Error(error.message || 'Erro ao buscar profissionais')
      }

      return data || []
    } catch (error) {
      console.error('Erro na função buscarProfissionais:', error)
      throw error
    }
  }

  // Buscar especialidades
  const buscarEspecialidades = async (): Promise<AgEspecialidade[]> => {
    try {
      const { data, error } = await supabase
        .from('ag_especialidades')
        .select('id, nome')
        .order('nome')

      if (error) {
        console.error('Erro ao buscar especialidades:', error)
        throw new Error(error.message || 'Erro ao buscar especialidades')
      }

      return data || []
    } catch (error) {
      console.error('Erro na função buscarEspecialidades:', error)
      throw error
    }
  }

  // Inserir especialidade
  const inserirEspecialidade = async (nomeEspecialidade: string): Promise<AgAddEspecialidadeResponse> => {
    try {

      const { data, error } = await supabase
        // @ts-ignore - RPC function not in generated types
        .rpc('ag_add_especialidade', {
          p_especialidade: nomeEspecialidade
        })

      // Verificação de erro do Supabase
      if (error) {
        console.error('Erro do Supabase:', error)
        return {
          success: false,
          message: String(error?.message || error || 'Erro ao inserir especialidade')
        }
      }

      // Verificação se data existe e não é null
      if (data === null || data === undefined) {
        console.warn('Data é null ou undefined')
        return {
          success: false,
          message: 'Nenhuma resposta do servidor'
        }
      }

      // Se data é um valor primitivo (boolean, string, number)
      if (typeof data !== 'object') {

        // Assumir sucesso se não há erro e há algum retorno
        return {
          success: true,
          message: 'Especialidade inserida com sucesso!'
        }
      }

      // Se data é um objeto, verificar suas propriedades

      const result = data as Record<string, any>

      // Verificar se tem propriedade success
      const hasSuccess = 'success' in result
      const successValue = hasSuccess ? Boolean(result.success) : true

      // Verificar se tem propriedade message
      const hasMessage = 'message' in result
      const messageValue = hasMessage ? String(result.message) : 'Especialidade inserida com sucesso!'

      return {
        success: successValue,
        message: messageValue
      }
    } catch (error: any) {
      console.error('Erro na função inserirEspecialidade:', error)
      return {
        success: false,
        message: String(error?.message || 'Erro interno do sistema')
      }
    }
  }

  // Editar especialidade
  const editarEspecialidade = async (id: number, novoNome: string): Promise<AgAddEspecialidadeResponse> => {
    try {

      const { data, error } = await supabase
        // @ts-ignore - RPC function not in generated types
        .rpc('ag_update_especialidade', {
          p_id: id,
          p_nova_especialidade: novoNome
        })

      // Verificação de erro do Supabase
      if (error) {
        console.error('Erro do Supabase:', error)
        return {
          success: false,
          message: String(error?.message || error || 'Erro ao editar especialidade')
        }
      }

      // Verificação se data existe e não é null
      if (data === null || data === undefined) {
        console.warn('Data é null ou undefined')
        return {
          success: false,
          message: 'Nenhuma resposta do servidor'
        }
      }

      // Se data é um valor primitivo (boolean, string, number)
      if (typeof data !== 'object') {

        // Assumir sucesso se não há erro e há algum retorno
        return {
          success: true,
          message: 'Especialidade editada com sucesso!'
        }
      }

      // Se data é um objeto, verificar suas propriedades

      const result = data as Record<string, any>

      // Verificar se tem propriedade success
      const hasSuccess = 'success' in result
      const successValue = hasSuccess ? Boolean(result.success) : true

      // Verificar se tem propriedade message
      const hasMessage = 'message' in result
      const messageValue = hasMessage ? String(result.message) : 'Especialidade editada com sucesso!'

      return {
        success: successValue,
        message: messageValue
      }
    } catch (error: any) {
      console.error('Erro na função editarEspecialidade:', error)
      return {
        success: false,
        message: String(error?.message || 'Erro interno do sistema')
      }
    }
  }

  // Deletar especialidade
  const deletarEspecialidade = async (id: number): Promise<AgAddEspecialidadeResponse> => {
    try {

      const { error } = await supabase
        .from('ag_especialidades')
        .delete()
        .eq('id', id)

      // Verificação de erro do Supabase
      if (error) {
        console.error('Erro do Supabase:', error)
        return {
          success: false,
          message: String(error?.message || error || 'Erro ao deletar especialidade')
        }
      }

      return {
        success: true,
        message: 'Especialidade deletada com sucesso!'
      }
    } catch (error: any) {
      console.error('Erro na função deletarEspecialidade:', error)
      return {
        success: false,
        message: String(error?.message || 'Erro interno do sistema')
      }
    }
  }

  // Buscar perfis
  const buscarPerfis = async (): Promise<AgPerfil[]> => {
    try {
      // @ts-ignore - RPC function not in generated types
      const { data, error } = await supabase
        .rpc('ag_get_all_profiles_if_admin')

      if (error) {
        console.error('Erro ao buscar perfis:', error)
        throw new Error(error.message || 'Erro ao buscar perfis')
      }

      return data || []
    } catch (error) {
      console.error('Erro na função buscarPerfis:', error)
      throw error
    }
  }

  // Inserir profissional
  const inserirProfissional = async (profileId: number, especialidadeId: number): Promise<AgAddEspecialidadeResponse> => {
    try {

      const { data, error } = await supabase
        .from('ag_profissionais')
        // @ts-ignore - Table types not properly generated
        .insert({
          profile_id: profileId,
          especialidade_id: especialidadeId
        })
        .select()

      // Verificação de erro do Supabase
      if (error) {
        console.error('Erro do Supabase:', error)
        return {
          success: false,
          message: String(error?.message || error || 'Erro ao inserir profissional')
        }
      }

      return {
        success: true,
        message: 'Profissional inserido com sucesso!'
      }
    } catch (error: any) {
      console.error('Erro na função inserirProfissional:', error)
      return {
        success: false,
        message: String(error?.message || 'Erro interno do sistema')
      }
    }
  }

  // Editar profissional
  const editarProfissional = async (profissionalId: number, profileId: number, especialidadeId: number): Promise<AgAddEspecialidadeResponse> => {
    try {

      const { data, error } = await supabase
        .from('ag_profissionais')
        // @ts-ignore - Table types not properly generated
        .update({
          profile_id: profileId,
          especialidade_id: especialidadeId
        })
        .eq('id', profissionalId)
        .select()

      // Verificação de erro do Supabase
      if (error) {
        console.error('Erro do Supabase:', error)
        return {
          success: false,
          message: String(error?.message || error || 'Erro ao editar profissional')
        }
      }

      return {
        success: true,
        message: 'Profissional editado com sucesso!'
      }
    } catch (error: any) {
      console.error('Erro na função editarProfissional:', error)
      return {
        success: false,
        message: String(error?.message || 'Erro interno do sistema')
      }
    }
  }

  // Deletar profissional
  const deletarProfissional = async (profissionalId: number): Promise<AgAddEspecialidadeResponse> => {
    try {

      const { error } = await supabase
        .from('ag_profissionais')
        .delete()
        .eq('id', profissionalId)

      // Verificação de erro do Supabase
      if (error) {
        console.error('Erro do Supabase:', error)
        return {
          success: false,
          message: String(error?.message || error || 'Erro ao deletar profissional')
        }
      }

      return {
        success: true,
        message: 'Profissional deletado com sucesso!'
      }
    } catch (error: any) {
      console.error('Erro na função deletarProfissional:', error)
      return {
        success: false,
        message: String(error?.message || 'Erro interno do sistema')
      }
    }
  }

  // Buscar clientes
  const buscarClientes = async (): Promise<AgCliente[]> => {
    try {
      const { data, error } = await supabase
        .from('ag_clientes')
        .select('*')
        .order('nome')

      if (error) {
        console.error('Erro ao buscar clientes:', error)
        throw new Error(error.message || 'Erro ao buscar clientes')
      }

      return data || []
    } catch (error) {
      console.error('Erro na função buscarClientes:', error)
      throw error
    }
  }

  // Inserir cliente
  const inserirCliente = async (dadosCliente: {
    nome: string
    cpf: string
    endereco?: string | null
    email?: string | null
    telefone?: string | null
  }): Promise<AgAddEspecialidadeResponse> => {
    try {

      const { data, error } = await supabase
        .from('ag_clientes')
        // @ts-ignore - Table types not properly generated
        .insert({
          nome: dadosCliente.nome,
          cpf: dadosCliente.cpf,
          endereco: dadosCliente.endereco || null,
          email: dadosCliente.email || null,
          telefone: dadosCliente.telefone || null
        })
        .select()

      // Verificação de erro do Supabase
      if (error) {
        console.error('Erro do Supabase:', error)

        // Traduzir mensagens de erro específicas
        let errorMessage = String(error?.message || error || 'Erro ao inserir cliente')

        // Verificar se é erro de CPF duplicado
        if (error.code === '23505' && error.message?.includes('cpf')) {
          errorMessage = 'CPF já cadastrado'
        }

        return {
          success: false,
          message: errorMessage
        }
      }

      return {
        success: true,
        message: 'Cliente inserido com sucesso!'
      }
    } catch (error: any) {
      console.error('Erro na função inserirCliente:', error)
      return {
        success: false,
        message: String(error?.message || 'Erro interno do sistema')
      }
    }
  }

  // Editar cliente
  const editarCliente = async (clienteId: number, dadosCliente: {
    nome: string
    cpf: string
    endereco?: string | null
    email?: string | null
    telefone?: string | null
  }): Promise<AgAddEspecialidadeResponse> => {
    try {

      const { data, error } = await supabase
        .from('ag_clientes')
        // @ts-ignore - Table types not properly generated
        .update({
          nome: dadosCliente.nome,
          cpf: dadosCliente.cpf,
          endereco: dadosCliente.endereco || null,
          email: dadosCliente.email || null,
          telefone: dadosCliente.telefone || null
        })
        .eq('id', clienteId)
        .select()

      // Verificação de erro do Supabase
      if (error) {
        console.error('Erro do Supabase:', error)

        // Traduzir mensagens de erro específicas
        let errorMessage = String(error?.message || error || 'Erro ao editar cliente')

        // Verificar se é erro de CPF duplicado
        if (error.code === '23505' && error.message?.includes('cpf')) {
          errorMessage = 'CPF já cadastrado'
        }

        return {
          success: false,
          message: errorMessage
        }
      }

      return {
        success: true,
        message: 'Cliente editado com sucesso!'
      }
    } catch (error: any) {
      console.error('Erro na função editarCliente:', error)
      return {
        success: false,
        message: String(error?.message || 'Erro interno do sistema')
      }
    }
  }

  // Deletar cliente
  const deletarCliente = async (clienteId: number): Promise<AgAddEspecialidadeResponse> => {
    try {

      const { error } = await supabase
        .from('ag_clientes')
        .delete()
        .eq('id', clienteId)

      // Verificação de erro do Supabase
      if (error) {
        console.error('Erro do Supabase:', error)
        return {
          success: false,
          message: String(error?.message || error || 'Erro ao deletar cliente')
        }
      }

      return {
        success: true,
        message: 'Cliente deletado com sucesso!'
      }
    } catch (error: any) {
      console.error('Erro na função deletarCliente:', error)
      return {
        success: false,
        message: String(error?.message || 'Erro interno do sistema')
      }
    }
  }

  return {
    buscarProfissionais,
    buscarEspecialidades,
    inserirEspecialidade,
    editarEspecialidade,
    deletarEspecialidade,
    buscarPerfis,
    inserirProfissional,
    editarProfissional,
    deletarProfissional,
    buscarClientes,
    inserirCliente,
    editarCliente,
    deletarCliente
  }
}