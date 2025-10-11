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
  const getCurrentUser = (): User | null => {
    return user.value
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
  }
}