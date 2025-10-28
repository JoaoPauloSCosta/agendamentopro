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
  created_at: string
  user_id: string
  nome: string
  role: string
  email: string
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

// Tipo para agendamentos
export interface AgAgendamento {
  id: number
  created_at: string
  user_id: string | null
  profissional_id: number | null
  cliente_id: number | null
  data: string | null // date em formato ISO string
  hora_inicio: string | null // time with time zone em formato ISO string
  hora_fim: string | null // time with time zone em formato ISO string
  titulo: string | null
  descricao: string | null
  cancelado: boolean | null
  cancelado_as: string | null // timestamp without time zone em formato ISO string
  cor: string | null // cor em formato hexadecimal
  cliente?: AgCliente | null // dados do cliente quando incluído via JOIN
}

// Tipo para inserção de agendamento (sem campos auto-gerados)
export interface AgAgendamentoInsert {
  user_id?: string | null
  profissional_id?: number | null
  cliente_id?: number | null
  data?: string | null
  hora_inicio?: string | null
  hora_fim?: string | null
  titulo?: string | null
  descricao?: string | null
  cancelado?: boolean | null
  cancelado_as?: string | null
  cor?: string | null
}

// Tipo para atualização de agendamento (todos os campos opcionais)
export interface AgAgendamentoUpdate {
  user_id?: string | null
  profissional_id?: number | null
  cliente_id?: number | null
  data?: string | null
  hora_inicio?: string | null
  hora_fim?: string | null
  titulo?: string | null
  descricao?: string | null
  cancelado?: boolean | null
  cancelado_as?: string | null
  cor?: string | null
}

// Tipo para relatório completo de agendamentos (view ag_view_agendamentos_complete)
export interface AgAgendamentoCompleto {
  id: number
  created_at: string
  user_id: string | null
  profissional_id: number | null
  cliente_id: number | null
  data: string | null // date em formato ISO string
  hora_inicio: string | null // time with time zone em formato ISO string
  hora_fim: string | null // time with time zone em formato ISO string
  titulo: string | null
  descricao: string | null
  cancelado: boolean | null
  cancelado_as: string | null // timestamp without time zone em formato ISO string
  cor: string | null // cor em formato hexadecimal
  cliente_nome: string | null
  cliente_cpf: string | null
  profissional_profile_id: number | null
  profissional_nome: string | null
  profissional_especialidade_id: number | null
  profissional_especialidade_nome: string | null
}

// Tipo para filtros de relatório de agendamentos
export interface AgRelatorioFiltros {
  dataInicio?: string | null // YYYY-MM-DD
  dataFim?: string | null // YYYY-MM-DD
  profissionalId?: number | null
  clienteId?: number | null
  especialidadeId?: number | null
  incluirCancelados?: boolean
}