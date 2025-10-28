import type { User } from '@supabase/supabase-js'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Estado de loading
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Função de login com email e senha
   */
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        error.value = authError.message
        return { success: false, error: authError.message }
      }

      // Redirecionar para a página index após login bem-sucedido
      await navigateTo('/')

      return { success: true, user: data.user }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Função de logout
   */
  const logout = async () => {
    try {
      isLoading.value = true
      error.value = null

      const { error: authError } = await supabase.auth.signOut()

      if (authError) {
        error.value = authError.message
        return { success: false, error: authError.message }
      }

      // Redirecionar para a página de login após logout
      await navigateTo('/login')

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Função para verificar se o usuário está autenticado
   */
  const isAuthenticated = computed(() => !!user.value)

  /**
   * Função para obter dados do usuário atual
   */
  const getCurrentUser = () => {
    return user.value
  }

  /**
   * Função para alterar a senha do usuário
   */
  const changePassword = async (newPassword: string) => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: authError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (authError) {
        error.value = authError.message
        return { success: false, error: authError.message }
      }

      return { success: true, message: 'Senha alterada com sucesso!' }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar senha'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Função para alterar o nome do usuário
   */
  const updateUserName = async (newName: string) => {
    try {
      isLoading.value = true
      error.value = null

      // @ts-ignore - RPC function not in generated types
      const { data, error: rpcError } = await supabase.rpc('ag_update_infos_user', {
        new_name: newName
      })

      if (rpcError) {
        console.error(rpcError)
        error.value = rpcError.message
        return { success: false, message: rpcError.message }
      }

      return data as { success: boolean; message: string }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar nome'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Função para solicitar recuperação de senha
   */
  const requestPasswordReset = async (email: string) => {
    try {
      isLoading.value = true
      error.value = null

      const config = useRuntimeConfig()
      const baseUrl = config.public.siteUrl || 'http://localhost:3000'

      const { data, error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/recuperar-senha`,
      })

      if (authError) {
        error.value = authError.message
        return { success: false, error: authError.message }
      }

      return { success: true, message: 'Email de recuperação enviado com sucesso!' }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao solicitar recuperação de senha'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Função para verificar se o usuário é admin
   */
  const checkIsAdmin = async (userId: string) => {
    try {
      // @ts-ignore - RPC function not in generated types
      const { data, error: rpcError } = await supabase.rpc('ag_isadmin', {
        p_user_id: userId
      })

      if (rpcError) {
        console.error('Erro ao verificar admin:', rpcError)
        return { isAdmin: false }
      }

      return data as { isadmin: boolean }
    } catch (err) {
      console.error('Erro na função checkIsAdmin:', err)
      return { isadmin: false }
    }
  }

  return {
    // Estados
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isAuthenticated,

    // Métodos
    login,
    logout,
    getCurrentUser,
    changePassword,
    updateUserName,
    requestPasswordReset,
    checkIsAdmin,
  }
}