// Tipos do banco de dados

export interface AgProfile {
  id: number
  created_at: string
  user_id: string | null
  nome: string | null
  role: string | null
}

// Tipo para inserção (sem campos auto-gerados)
export interface AgProfileInsert {
  user_id?: string | null
  nome?: string | null
  role?: string | null
}

// Tipo para atualização (todos os campos opcionais)
export interface AgProfileUpdate {
  user_id?: string | null
  nome?: string | null
  role?: string | null
}

// Enum para roles
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

// Tipo para o usuário completo (auth + profile)
export interface UserWithProfile {
  id: string
  email?: string
  profile?: AgProfile | null
}

// Tipo para especialidades
export interface AgEspecialidade {
  id: number
  nome: string | null
}

// Tipo para resposta da função ag_add_especialidade
export interface AgAddEspecialidadeResponse {
  success: boolean
  message: string
}

// Tipo para profissionais (retorno da RPC ag_get_profissionais)
export interface AgProfissional {
  profissional_id: number
  profile_id: number
  nome_profissional: string
  especialidade_id: number
  especialidade_nome: string
}

// Tipo para perfis (retorno da RPC ag_get_all_profiles_if_admin)
export interface AgPerfil {
  id: number
  nome: string
}

// Tipo para clientes
export interface AgCliente {
  id: number
  created_at: string
  cpf: string | null
  nome: string | null
  endereco: string | null
  email: string | null
  telefone: string | null
}