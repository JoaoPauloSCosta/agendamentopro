export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()

  // Se não estiver autenticado, redirecionar para login
  if (!user.value) {
    return navigateTo('/login')
  }

  // Verificar se é admin
  const supabase = useSupabaseClient()

  try {
    // Obter o ID do usuário (pode ser 'id' ou 'sub' dependendo do tipo)
    const userId = (user.value as any).id || (user.value as any).sub
    
    if (!userId) {
      console.error('ID do usuário não encontrado')
      return navigateTo('/')
    }

    // @ts-ignore - RPC function not in generated types
    const { data, error } = await supabase.rpc('ag_isadmin', {
      p_user_id: userId
    })

    if (error) {
      console.error('Erro ao verificar admin:', error)
      return navigateTo('/')
    }

    // Se não for admin, redirecionar para index
    const result = data as { isadmin: boolean } | null
    if (!result?.isadmin) {
      return navigateTo('/')
    }

    // Se for admin, permitir acesso
  } catch (err) {
    console.error('Erro no middleware admin:', err)
    return navigateTo('/')
  }
})
