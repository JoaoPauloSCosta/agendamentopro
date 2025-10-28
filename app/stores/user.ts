import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import type { AgProfile, UserWithProfile } from '~/types/database'

interface UserState {
  user: User | null
  profile: AgProfile | null
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    profile: null,
    loading: false,
    error: null
  }),

  getters: {
    // Verifica se o usuário está autenticado
    isAuthenticated: (state): boolean => !!state.user,
    
    // Retorna o usuário completo com perfil
    userWithProfile: (state): UserWithProfile | null => {
      if (!state.user) return null
      return {
        id: state.user.sub,
        email: state.user.email,
        profile: state.profile
      }
    },

    // Retorna o nome do usuário (do perfil ou email)
    displayName: (state): string => {
      if (state.profile?.nome) return state.profile.nome
      if (state.user?.email) return state.user.email
      return 'Usuário'
    },

    // Retorna o role do usuário
    userRole: (state): string => {
      return state.profile?.role || 'user'
    },

    // Verifica se é admin
    isAdmin: (state): boolean => {
      return state.profile?.role === 'admin'
    }
  },

  actions: {
    // Define o usuário autenticado
    setUser(user: User | null) {
      this.user = user
      if (!user) {
        this.profile = null
      }
    },

    // Busca o perfil do usuário na tabela ag_profiles
    async fetchProfile() {
      if (!this.user?.sub) {
        this.error = 'Usuário não autenticado ou ID inválido'

        return
      }

      try {
        this.loading = true
        this.error = null

        const supabase = useSupabaseClient()
        
        const { data, error } = await supabase
          .from('ag_profiles')
          .select('*')
          .eq('user_id', this.user.sub)
          .single()

        if (error) {
          // Se não encontrar o perfil, não é necessariamente um erro
          if (error.code === 'PGRST116') {

            this.profile = null
          } else {
            console.error('Erro na query do perfil:', error)
            throw error
          }
        } else {

          this.profile = data
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Erro ao buscar perfil'
        console.error('Erro ao buscar perfil:', err)
      } finally {
        this.loading = false
      }
    },

    // Cria um novo perfil para o usuário
    async createProfile(profileData: { nome?: string; role?: string }) {
      if (!this.user) {
        this.error = 'Usuário não autenticado'
        return
      }

      try {
        this.loading = true
        this.error = null

        const supabase = useSupabaseClient()
        
        const { data, error } = await supabase
          .from('ag_profiles')
          .insert({
            user_id: this.user.sub,
            nome: profileData.nome,
            role: profileData.role || 'user'
          })
          .select()
          .single()

        if (error) throw error

        this.profile = data
        return data
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Erro ao criar perfil'
        console.error('Erro ao criar perfil:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Atualiza o perfil do usuário
    async updateProfile(updates: { nome?: string; role?: string }) {
      if (!this.user || !this.profile) {
        this.error = 'Usuário ou perfil não encontrado'
        return
      }

      try {
        this.loading = true
        this.error = null

        const supabase = useSupabaseClient()
        
        const { data, error } = await supabase
          .from('ag_profiles')
          .update(updates)
          .eq('user_id', this.user.sub)
          .select()
          .single()

        if (error) throw error

        this.profile = data
        return data
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Erro ao atualizar perfil'
        console.error('Erro ao atualizar perfil:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Limpa o estado do usuário (logout)
    clearUser() {
      this.user = null
      this.profile = null
      this.error = null
      this.loading = false
    },

    // Inicializa o store com o usuário atual
    async initialize() {
      const supabase = useSupabaseClient()
      const user = useSupabaseUser()


      // Define o usuário inicial
      this.setUser(user.value)

      // Se há usuário, busca o perfil
      if (user.value) {

        await this.fetchProfile()
      }

      // Observa mudanças no usuário
      watch(user, async (newUser) => {

        this.setUser(newUser)
        if (newUser) {

          await this.fetchProfile()
        }
      })
    }
  }
})