import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Obter user_id da query
    const query = getQuery(event)
    const userId = query.user_id as string

    // Validação básica
    if (!userId) {
      return {
        success: false,
        message: 'user_id é obrigatório'
      }
    }

    // Obter cliente Supabase com privilégios de admin
    const supabaseAdmin = await serverSupabaseServiceRole(event)

    // 1. Deletar perfil da tabela ag_profiles
    // O CASCADE na foreign key vai deletar automaticamente quando deletarmos o usuário
    // Mas vamos deletar explicitamente para ter controle
    const { error: profileError } = await supabaseAdmin
      .from('ag_profiles')
      .delete()
      .eq('user_id', userId)

    if (profileError) {
      console.error('Erro ao deletar perfil:', profileError)
      return {
        success: false,
        message: 'Erro ao deletar perfil do usuário'
      }
    }

    console.log('Perfil deletado para user_id:', userId)

    // 2. Deletar usuário do auth.users usando admin API
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('Erro ao deletar usuário do auth:', authError)
      return {
        success: false,
        message: authError.message || 'Erro ao deletar usuário'
      }
    }

    console.log('Usuário deletado do auth:', userId)

    return {
      success: true,
      message: 'Usuário deletado com sucesso!'
    }
  } catch (error: any) {
    console.error('Erro na função deletar-usuario:', error)
    return {
      success: false,
      message: error.message || 'Erro interno do servidor'
    }
  }
})
