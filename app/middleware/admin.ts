export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()
  
  // Se não estiver autenticado, redirecionar para login
  if (!user.value) {
    return navigateTo('/login')
  }

  // Verificar se é admin
  const supabase = useSupabaseClient()
  
  try {
    // @ts-ignore - RPC function not in generated types
    const { data, error } = await supabase.rpc('ag_isadmin', {
      p_user_id: user.value.id
    })

    if (error) {
      console.error('Erro ao verificar admin:', error)
      return navigateTo('/')
    }

    // Se não for admin, redirecionar para index
    if (!data?.isadmin) {
      console.log('Usuário não é admin, redirecionando...')
      return navigateTo('/')
    }

    // Se for admin, permitir acesso
    console.log('Usuário é admin, permitindo acesso')
  } catch (err) {
    console.error('Erro no middleware admin:', err)
    return navigateTo('/')
  }
})
