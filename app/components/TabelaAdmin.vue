<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header da Tabela -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Usuários do Sistema</h2>
          <p class="text-sm text-gray-600 mt-1">
            Gerencie os usuários e suas permissões
          </p>
        </div>
        <BaseButton variant="primary" size="md" :icon-left="PlusIcon" @click="abrirModalNovoUsuario">
          Adicionar Usuário
        </BaseButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-sm text-gray-600">Carregando usuários...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-8 text-center">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Tabela -->
    <div v-else-if="perfis.length > 0" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="perfil in perfis" :key="perfil.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ perfil.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ perfil.nome || 'Sem nome' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-600">
                {{ perfil.email || 'Sem email' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                perfil.role === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              ]">
                {{ perfil.role || 'user' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="abrirModalDeletar(perfil)" class="text-red-600 hover:text-red-900 transition-colors"
                title="Deletar usuário">
                <TrashIcon class="h-5 w-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="p-8 text-center">
      <p class="text-gray-600">Nenhum usuário encontrado</p>
    </div>

    <!-- Footer com total -->
    <div v-if="perfis.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <p class="text-sm text-gray-600">
        Total de usuários: <span class="font-semibold">{{ perfis.length }}</span>
      </p>
    </div>

    <!-- Modal Confirmação Deletar -->
    <ModalConfirmacao :is-open="modalDeletarAberto" title="Deletar Usuário"
      :message="`Tem certeza que deseja deletar o usuário '${usuarioParaDeletar?.nome}'? Esta ação não pode ser desfeita.`"
      :loading="deletandoUsuario" @confirm="handleDeletarUsuario" @cancel="fecharModalDeletar" />

    <!-- Modal Novo Usuário -->
    <BaseModal :is-open="modalNovoUsuarioAberto" title="Novo Usuário" confirm-text="Criar Conta" cancel-text="Cancelar"
      :loading="criandoUsuario" :confirm-disabled="criandoUsuario" @confirm="handleCriarUsuario"
      @cancel="fecharModalNovoUsuario" @close="fecharModalNovoUsuario">
      <div class="space-y-4">
        <!-- Nome -->
        <div>
          <BaseInput id="novo-usuario-nome" v-model="novoUsuario.nome" label="Nome"
            placeholder="Digite o nome do usuário" :icon-left="UserIcon" required />
        </div>

        <!-- Email -->
        <div>
          <BaseInput id="novo-usuario-email" v-model="novoUsuario.email" type="email" label="Email"
            placeholder="Digite o email do usuário" :icon-left="EnvelopeIcon" required />
        </div>

        <!-- Senha -->
        <div>
          <BaseInput id="novo-usuario-senha" v-model="novoUsuario.senha" type="password" label="Senha"
            placeholder="Digite a senha" :icon-left="LockClosedIcon"
            helper-text="A senha deve ter no mínimo 6 caracteres" required />
        </div>

        <!-- Confirmar Senha -->
        <div>
          <BaseInput id="novo-usuario-confirmar-senha" v-model="novoUsuario.confirmarSenha" type="password"
            label="Confirmar Senha" placeholder="Digite a senha novamente" :icon-left="LockClosedIcon" required />
        </div>

        <!-- Tipo de Usuário -->
        <div>
          <label for="novo-usuario-role" class="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Usuário
            <span class="text-red-500 ml-1">*</span>
          </label>
          <select id="novo-usuario-role" v-model="novoUsuario.role"
            class="block w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            required>
            <option value="">Selecione o tipo</option>
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, UserIcon, EnvelopeIcon, LockClosedIcon, ShieldCheckIcon, TrashIcon } from '@heroicons/vue/24/outline'
import type { AgPerfil } from '~/types/database'
import { useToast } from 'vue-toastification'

// Composable
const { buscarPerfis } = useProfissionais()
const toast = useToast()

// Estado
const perfis = ref<AgPerfil[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Estado do modal novo usuário
const modalNovoUsuarioAberto = ref(false)
const criandoUsuario = ref(false)
const novoUsuario = ref({
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  role: ''
})

// Estado do modal deletar
const modalDeletarAberto = ref(false)
const deletandoUsuario = ref(false)
const usuarioParaDeletar = ref<AgPerfil | null>(null)

// Erros de validação
const errosValidacao = reactive({
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  role: ''
})

// Carregar perfis
const carregarPerfis = async () => {
  try {
    loading.value = true
    error.value = null
    perfis.value = await buscarPerfis()
    console.log('Perfis carregados:', perfis.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar usuários'
    console.error('Erro ao carregar perfis:', err)
  } finally {
    loading.value = false
  }
}

// Funções do modal
const abrirModalNovoUsuario = () => {
  modalNovoUsuarioAberto.value = true
}

const fecharModalNovoUsuario = () => {
  modalNovoUsuarioAberto.value = false
  // Limpar campos
  novoUsuario.value = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    role: ''
  }
}

const handleCriarUsuario = async () => {
  // Limpar erros anteriores
  errosValidacao.nome = ''
  errosValidacao.email = ''
  errosValidacao.senha = ''
  errosValidacao.confirmarSenha = ''
  errosValidacao.role = ''

  // Validações
  if (!novoUsuario.value.nome.trim()) {
    errosValidacao.nome = 'O nome é obrigatório'
    toast.error('O nome é obrigatório')
    return
  }

  if (!novoUsuario.value.email.trim()) {
    errosValidacao.email = 'O email é obrigatório'
    toast.error('O email é obrigatório')
    return
  }

  if (!novoUsuario.value.senha) {
    errosValidacao.senha = 'A senha é obrigatória'
    toast.error('A senha é obrigatória')
    return
  }

  if (novoUsuario.value.senha.length < 6) {
    errosValidacao.senha = 'A senha deve ter no mínimo 6 caracteres'
    toast.error('A senha deve ter no mínimo 6 caracteres')
    return
  }

  if (novoUsuario.value.senha !== novoUsuario.value.confirmarSenha) {
    errosValidacao.confirmarSenha = 'As senhas não coincidem'
    toast.error('As senhas não coincidem')
    return
  }

  if (!novoUsuario.value.role) {
    errosValidacao.role = 'Selecione o tipo de usuário'
    toast.error('Selecione o tipo de usuário')
    return
  }

  try {
    criandoUsuario.value = true

    // Chamar API do servidor
    const response = await $fetch('/api/admin/criar-usuario', {
      method: 'POST',
      body: {
        email: novoUsuario.value.email.trim(),
        senha: novoUsuario.value.senha,
        nome: novoUsuario.value.nome.trim(),
        role: novoUsuario.value.role
      }
    }) as any

    if (response.success) {
      toast.success(response.message || 'Usuário criado com sucesso!')
      fecharModalNovoUsuario()
      // Recarregar lista de usuários
      await carregarPerfis()
    } else {
      toast.error(response.message || 'Erro ao criar usuário')
    }
  } catch (err: any) {
    console.error('Erro ao criar usuário:', err)
    toast.error(err.data?.message || 'Erro ao criar usuário')
  } finally {
    criandoUsuario.value = false
  }
}

// Funções do modal deletar
const abrirModalDeletar = (perfil: AgPerfil) => {
  usuarioParaDeletar.value = perfil
  modalDeletarAberto.value = true
}

const fecharModalDeletar = () => {
  modalDeletarAberto.value = false
  usuarioParaDeletar.value = null
}

const handleDeletarUsuario = async () => {
  if (!usuarioParaDeletar.value) return

  try {
    deletandoUsuario.value = true

    // Chamar API do servidor
    const response = await $fetch(`/api/admin/deletar-usuario?user_id=${usuarioParaDeletar.value.user_id}`, {
      method: 'DELETE'
    }) as any

    if (response.success) {
      toast.success(response.message || 'Usuário deletado com sucesso!')
      fecharModalDeletar()
      // Recarregar lista de usuários
      await carregarPerfis()
    } else {
      toast.error(response.message || 'Erro ao deletar usuário')
    }
  } catch (err: any) {
    console.error('Erro ao deletar usuário:', err)
    toast.error(err.data?.message || 'Erro ao deletar usuário')
  } finally {
    deletandoUsuario.value = false
  }
}

// Carregar ao montar o componente
onMounted(() => {
  carregarPerfis()
})
</script>
