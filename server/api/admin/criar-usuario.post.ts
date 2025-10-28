import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    try {
        // Obter dados do body
        const body = await readBody(event)
        const { email, senha, nome, role } = body

        // Validações básicas
        if (!email || !senha || !nome || !role) {
            return {
                success: false,
                message: 'Email, senha, nome e role são obrigatórios'
            }
        }

        if (senha.length < 6) {
            return {
                success: false,
                message: 'A senha deve ter no mínimo 6 caracteres'
            }
        }

        // Obter cliente Supabase com privilégios de admin
        const supabaseAdmin = await serverSupabaseServiceRole(event)

        // 1. Criar usuário no auth.users usando admin API
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: senha,
            email_confirm: true // Confirmar email automaticamente
        })

        if (authError) {
            console.error('Erro ao criar usuário no auth:', authError)
            return {
                success: false,
                message: authError.message || 'Erro ao criar usuário'
            }
        }

        if (!authData.user) {
            return {
                success: false,
                message: 'Usuário não foi criado'
            }
        }

        console.log('Usuário criado no auth:', authData.user.id)

        // 2. Inserir perfil na tabela ag_profiles
        const { data: profileData, error: profileError } = await supabaseAdmin
            .from('ag_profiles')
            // @ts-ignore - Table types not properly generated
            .insert({
                user_id: authData.user.id,
                nome,
                email,
                role
            })
            .select()
            .single()

        if (profileError) {
            console.error('Erro ao criar perfil:', profileError)

            // Se falhar ao criar o perfil, deletar o usuário criado
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id)

            return {
                success: false,
                message: 'Erro ao criar perfil do usuário'
            }
        }

        console.log('Perfil criado:', profileData)

        return {
            success: true,
            message: 'Usuário criado com sucesso!',
            data: {
                userId: authData.user.id,
                profileId: (profileData as any).id
            }
        }
    } catch (error: any) {
        console.error('Erro na função criar-usuario:', error)
        return {
            success: false,
            message: error.message || 'Erro interno do servidor'
        }
    }
})
