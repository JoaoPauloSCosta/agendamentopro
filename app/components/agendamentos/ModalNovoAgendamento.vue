<template>
  <BaseModal
    :is-open="isOpen"
    :title="modoEdicao ? 'Editar Agendamento' : 'Novo Agendamento'"
    size="lg"
    :loading="loading"
    confirm-text="Salvar"
    cancel-text="Cancelar"
    @close="handleClose"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #content>
      <form @submit.prevent="handleConfirm" class="space-y-6">
        <!-- Profissional (Somente Leitura) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Profissional
          </label>
          <div class="flex items-center bg-gray-50 border border-gray-200 rounded-md p-3">
            <div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-3">
              <UserIcon class="w-4 h-4 text-blue-600" />
            </div>
            <div class="flex-1">
              <ProfissionalAtual 
                :profissional-selecionado-id="profissionalIdParaExibir" 
                :desabilitar-click="true"
              />
            </div>
          </div>
        </div>

        <!-- Cliente (desabilitado no modo de edição) -->
        <SeletorCliente
          ref="seletorClienteRef"
          v-model="formData.clienteId"
          :erro="erros.clienteId"
          :disabled="modoEdicao"
          @cliente-selecionado="onClienteSelecionado"
        />

        <!-- Título -->
        <div>
          <label for="titulo" class="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <BaseInput
            id="titulo"
            v-model="formData.titulo"
            type="text"
            placeholder="Digite o título do agendamento"
            :class="erros.titulo ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''"
            required
          />
          <!-- Mensagem de erro para título -->
          <p v-if="erros.titulo" class="mt-1 text-sm text-red-600">
            {{ erros.titulo }}
          </p>
        </div>

        <!-- Descrição -->
        <div>
          <label for="descricao" class="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            id="descricao"
            v-model="formData.descricao"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Digite uma descrição opcional"
          ></textarea>
        </div>

        <!-- Cor do Agendamento -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Cor do Agendamento
          </label>
          <div class="grid grid-cols-6 gap-3">
            <div
              v-for="cor in coresDisponiveis"
              :key="cor.valor"
              class="relative"
            >
              <input
                :id="`cor-${cor.nome}`"
                v-model="formData.cor"
                :value="cor.valor"
                type="radio"
                name="cor"
                class="sr-only"
              />
              <label
                :for="`cor-${cor.nome}`"
                class="flex flex-col items-center cursor-pointer group rounded-lg"
              >
                <div
                  class="w-10 h-10 rounded-lg transition-all duration-200 group-hover:scale-110"
                  :class="formData.cor === cor.valor ? 'ring-2 ring-gray-300' : ''"
                  :style="{ backgroundColor: cor.valor }"
                ></div>
                <span class="text-xs text-gray-600 mt-1 text-center">{{ cor.nome }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Data (desabilitada no modo de edição) -->
        <div>
          <label for="data" class="block text-sm font-medium text-gray-700 mb-2">
            Data *
          </label>
          <select
            id="data"
            v-model="formData.data"
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="erros.data ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'"
            :disabled="modoEdicao"
            required
            @change="onDataChange"
          >
            <option value="">Selecione uma data</option>
            <option
              v-for="(dia, index) in diasSemana"
              :key="index"
              :value="formatarDataParaInput(dia)"
            >
              {{ formatarDiaCompleto(dia) }}
            </option>
          </select>
          <!-- Mensagem de erro para data -->
          <p v-if="erros.data" class="mt-1 text-sm text-red-600">
            {{ erros.data }}
          </p>
        </div>

        <!-- Horários (desabilitados no modo de edição) -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Hora Início -->
          <div>
            <label for="horaInicio" class="block text-sm font-medium text-gray-700 mb-2">
              Hora Início *
            </label>
            <select
              v-if="!modoEdicao"
              id="horaInicio"
              v-model="formData.horaInicio"
              class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="erros.horaInicio ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'"
              required
              @change="onHoraInicioChange"
            >
              <option value="">Selecione</option>
              <option
                v-for="hora in horasDisponiveis"
                :key="hora"
                :value="hora"
              >
                {{ hora }}
              </option>
            </select>
            <!-- Campo desabilitado no modo de edição -->
            <input
              v-else
              id="horaInicio"
              :value="formatarHorario(formData.horaInicio)"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              disabled
              readonly
            />
            <!-- Mensagem de erro para hora início -->
            <p v-if="erros.horaInicio" class="mt-1 text-sm text-red-600">
              {{ erros.horaInicio }}
            </p>
          </div>

          <!-- Hora Fim -->
          <div>
            <label for="horaFim" class="block text-sm font-medium text-gray-700 mb-2">
              Hora Fim *
            </label>
            <select
              v-if="!modoEdicao"
              id="horaFim"
              v-model="formData.horaFim"
              class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="erros.horaFim ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'"
              required
            >
              <option value="">Selecione</option>
              <option
                v-for="hora in horasFimDisponiveis"
                :key="hora"
                :value="hora"
              >
                {{ hora }}
              </option>
            </select>
            <!-- Campo desabilitado no modo de edição -->
            <input
              v-else
              id="horaFim"
              :value="formatarHorario(formData.horaFim)"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              disabled
              readonly
            />
            <!-- Mensagem de erro para hora fim -->
            <p v-if="erros.horaFim" class="mt-1 text-sm text-red-600">
              {{ erros.horaFim }}
            </p>
          </div>
        </div>

        <!-- Mensagem de erro geral -->
        <div v-if="erros.geral" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ erros.geral }}</p>
        </div>

        <!-- Mensagem de sucesso -->
        <div v-if="sucesso" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p class="text-sm text-green-600">✅ Agendamento criado com sucesso!</p>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-between items-center gap-8">
        <!-- Botão de cancelar agendamento (apenas no modo de edição) -->
        <BaseButton
          v-if="modoEdicao"
          label="Cancelar Agendamento"
          variant="danger"
          size="md"
          :loading="loading || loadingAgendamento"
          :disabled="loading || loadingAgendamento"
          @click="handleCancelarAgendamento"
        />
        <div v-else></div>
        
        <!-- Botão principal -->
        <BaseButton
          :label="loading || loadingAgendamento ? (modoEdicao ? 'Salvando...' : 'Criando...') : (modoEdicao ? 'Salvar Alterações' : 'Criar Agendamento')"
          variant="primary"
          size="md"
          :loading="loading || loadingAgendamento"
          :disabled="loading || loadingAgendamento"
          @click="handleConfirm"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { UserIcon } from '@heroicons/vue/24/outline'
import BaseModal from '../BaseModal.vue'
import BaseInput from '../BaseInput.vue'
import ProfissionalAtual from './ProfissionalAtual.vue'
import SeletorCliente from './SeletorCliente.vue'
import { useAgendamentoStore } from '~/stores/agendamento'
import { useValidacaoHorarios } from '~/composables/useValidacaoHorarios'
import { useAgendamentos } from '~/composables/useAgendamentos'
import { useToast } from 'vue-toastification'
import type { AgCliente } from '~/types/database'

// Configuração do componente
defineOptions({
  name: 'ModalNovoAgendamento'
})

// Props
interface Props {
  isOpen?: boolean
  profissionalId?: number | null
  agendamentosExistentes?: any[]
  modoEdicao?: boolean
  agendamentoParaEdicao?: any
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  profissionalId: null,
  agendamentosExistentes: () => [],
  modoEdicao: false,
  agendamentoParaEdicao: null
})

// Emits
interface Emits {
  close: []
  confirm: [data: any]
  cancel: []
  'cancelar-agendamento': [agendamentoId: number]
}

const emit = defineEmits<Emits>()

// Store e Composables
const agendamentoStore = useAgendamentoStore()
const { inserirAgendamento, loading: loadingAgendamento, error: errorAgendamento } = useAgendamentos()
const toast = useToast()

// Criar validação de horários reativa baseada nos agendamentos existentes
const validacaoHorarios = computed(() => {
  console.log('🔄 Recriando validacaoHorarios com agendamentos:', props.agendamentosExistentes?.length || 0)
  return useValidacaoHorarios(props.agendamentosExistentes || [])
})

// Refs
const seletorClienteRef = ref()

// Estado reativo
const loading = ref(false)
const erros = ref<Record<string, string>>({})
const clienteSelecionado = ref<AgCliente | null>(null)
const sucesso = ref(false)

// Cores disponíveis baseadas no sistema de design (tons levemente mais escuros)
const coresDisponiveis = ref([
  { nome: 'Rosa', valor: '#fee2e2' },
  { nome: 'Azul', valor: '#dbeafe' },
  { nome: 'Verde', valor: '#dcfce7' },
  { nome: 'Amarelo', valor: '#fef3c7' },
  { nome: 'Roxo', valor: '#f3e8ff' },
  { nome: 'Laranja', valor: '#ffedd5' },
  { nome: 'Cinza', valor: '#f1f5f9' },
  { nome: 'Indigo', valor: '#e0e7ff' },
  { nome: 'Teal', valor: '#ccfbf1' },
  { nome: 'Pink', valor: '#fce7f3' },
  { nome: 'Lime', valor: '#ecfccb' },
  { nome: 'Cyan', valor: '#cffafe' }
])

const formData = ref({
  clienteId: '',
  titulo: '',
  descricao: '',
  data: '',
  horaInicio: '',
  horaFim: '',
  cor: '#fee2e2' // Cor padrão (Rosa) - tom levemente mais escuro
})

// Computed para dias da semana
const diasSemana = computed(() => {
  return agendamentoStore.diasSemana
})

// Computed para o ID do profissional a ser exibido
// No modo de edição, usa o profissional do agendamento
// No modo de criação, usa o profissional da prop (agenda atual)
const profissionalIdParaExibir = computed(() => {
  if (props.modoEdicao && props.agendamentoParaEdicao?.profissional_id) {
    console.log('📝 Modo edição - usando profissional do agendamento:', props.agendamentoParaEdicao.profissional_id)
    return props.agendamentoParaEdicao.profissional_id
  }
  
  console.log('🆕 Modo criação - usando profissional da agenda atual:', props.profissionalId)
  return props.profissionalId
})

// Horários disponíveis usando o composable
const horasDisponiveis = computed(() => {
  console.log('⏰ Calculando horas disponíveis para data:', formData.value.data)
  console.log('📋 Agendamentos existentes para filtro:', props.agendamentosExistentes?.length || 0)
  
  if (!validacaoHorarios.value) {
    console.log('⚠️ validacaoHorarios não disponível')
    return []
  }
  
  const horas = validacaoHorarios.value.obterHorasDisponiveis(formData.value.data)
  console.log('✅ Horas disponíveis calculadas:', horas)
  return horas
})

// Horários fim disponíveis usando o composable
const horasFimDisponiveis = computed(() => {
  console.log('⏰ Calculando horas fim disponíveis para:', formData.value.data, formData.value.horaInicio)
  
  if (!validacaoHorarios.value) {
    console.log('⚠️ validacaoHorarios não disponível')
    return []
  }
  
  const horas = validacaoHorarios.value.obterHorasFimDisponiveis(formData.value.data, formData.value.horaInicio)
  console.log('✅ Horas fim disponíveis calculadas:', horas)
  return horas
})

// Funções utilitárias
const formatarDiaCompleto = (data: Date) => {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  
  const diaSemana = diasSemana[data.getDay()]
  const dia = data.getDate().toString().padStart(2, '0')
  const mes = meses[data.getMonth()]
  
  return `${diaSemana}, ${dia} ${mes}`
}

// Função para formatar data para input mantendo timezone local
const formatarDataParaInput = (data: Date) => {
  const ano = data.getFullYear()
  const mes = (data.getMonth() + 1).toString().padStart(2, '0')
  const dia = data.getDate().toString().padStart(2, '0')
  
  return `${ano}-${mes}-${dia}`
}

// Função para formatar horário removendo segundos e timezone
const formatarHorario = (horario: string | null): string => {
  if (!horario) return ''
  
  // Se o horário contém segundos ou timezone, extrair apenas HH:MM
  if (horario.includes(':')) {
    const partes = horario.split(':')
    if (partes.length >= 2) {
      return `${partes[0]}:${partes[1]}`
    }
  }
  
  return horario
}

// Event handlers
const onClienteSelecionado = (cliente: AgCliente | null) => {
  clienteSelecionado.value = cliente
}

const onDataChange = () => {
  // Limpar horários quando a data muda
  formData.value.horaInicio = ''
  formData.value.horaFim = ''
  // Limpar erros relacionados a horários
  delete erros.value.horaInicio
  delete erros.value.horaFim
}

const onHoraInicioChange = () => {
  // Limpar hora fim quando hora início muda
  formData.value.horaFim = ''
  delete erros.value.horaFim
}

// Função de validação
const validarFormulario = (): boolean => {
  erros.value = {}
  let valido = true

  // Validar cliente
  if (!formData.value.clienteId) {
    erros.value.clienteId = 'Cliente é obrigatório'
    valido = false
  }

  // Validar título
  if (!formData.value.titulo.trim()) {
    erros.value.titulo = 'Título é obrigatório'
    valido = false
  }

  // Validar data
  if (!formData.value.data) {
    erros.value.data = 'Data é obrigatória'
    valido = false
  }

  // Validar horários
  if (!formData.value.horaInicio) {
    erros.value.horaInicio = 'Hora início é obrigatória'
    valido = false
  }

  if (!formData.value.horaFim) {
    erros.value.horaFim = 'Hora fim é obrigatória'
    valido = false
  }

  // Validar horários usando o composable - APENAS para novos agendamentos
  if (!props.modoEdicao && formData.value.data && formData.value.horaInicio && formData.value.horaFim) {
    console.log('🔍 Validando horário com validacaoHorarios:', validacaoHorarios.value)
    
    if (validacaoHorarios.value) {
      const resultadoValidacao = validacaoHorarios.value.validarHorario(
        formData.value.data,
        formData.value.horaInicio,
        formData.value.horaFim
      )
      
      console.log('📋 Resultado da validação de horário:', resultadoValidacao)
      
      if (!resultadoValidacao.valido) {
        erros.value.horaInicio = resultadoValidacao.erro || 'Horário inválido'
        valido = false
      }
    } else {
      console.log('⚠️ validacaoHorarios não disponível para validação')
    }
  } else if (props.modoEdicao) {
    console.log('✅ Modo edição: pulando validação de conflitos de horário')
  }

  return valido
}

// Handlers do modal
const handleConfirm = async () => {
  console.log('🚀 Iniciando handleConfirm...')
  
  if (!validarFormulario()) {
    console.log('❌ Formulário inválido:', erros.value)
    return
  }

  try {
    loading.value = true
    sucesso.value = false
    
    // Validar dados antes de enviar
    if (!props.profissionalId) {
      throw new Error('ID do profissional não encontrado')
    }
    
    if (!formData.value.clienteId) {
      throw new Error('Cliente não selecionado')
    }
    
    const dadosAgendamento = {
      profissionalId: props.profissionalId,
      clienteId: formData.value.clienteId,
      titulo: formData.value.titulo,
      descricao: formData.value.descricao,
      data: formData.value.data,
      horaInicio: formData.value.horaInicio,
      horaFim: formData.value.horaFim,
      cor: formData.value.cor
    }

    console.log('📝 Dados do agendamento:', dadosAgendamento)
    console.log('🔍 Validando dados:', {
      profissionalId: !!dadosAgendamento.profissionalId,
      clienteId: !!dadosAgendamento.clienteId,
      titulo: !!dadosAgendamento.titulo,
      data: !!dadosAgendamento.data,
      horaInicio: !!dadosAgendamento.horaInicio,
      horaFim: !!dadosAgendamento.horaFim
    })
    
    // Inserir agendamento usando o composable
    console.log('📤 Chamando inserirAgendamento...')
    const agendamentoCriado = await inserirAgendamento(dadosAgendamento)
    
    console.log('✅ Agendamento criado com sucesso:', agendamentoCriado)
    sucesso.value = true
    
    // Mostrar toast de sucesso - movido para antes do emit para garantir que apareça
    console.log('🍞 Mostrando toast de sucesso...')
    toast.success('Agendamento criado com sucesso!', {
      timeout: 3000
    })
    
    // Aguardar um pouco antes de emitir o evento para garantir que o toast apareça
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Emitir evento de confirmação com os dados do agendamento criado
    console.log('📡 Emitindo evento confirm...')
    console.log('📦 Dados sendo emitidos:', agendamentoCriado)
    emit('confirm', agendamentoCriado)
    console.log('✅ Evento confirm emitido com sucesso!')
    
    // Resetar formulário após sucesso
    console.log('🔄 Resetando formulário...')
    resetForm()
    
    console.log('✅ handleConfirm finalizado com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro detalhado ao criar agendamento:', {
      error,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined,
      errorAgendamento: errorAgendamento.value
    })
    
    // Mostrar toast de erro também
    const errorMessage = error instanceof Error ? error.message : 'Erro ao criar agendamento. Tente novamente.'
    toast.error(errorMessage, {
      timeout: 4000
    })
    
    // Mostrar erro específico se disponível
    if (errorAgendamento.value) {
      erros.value.geral = errorAgendamento.value
    } else {
      erros.value.geral = errorMessage
    }
  } finally {
    loading.value = false
    console.log('🏁 handleConfirm finalizado (finally)')
  }
}

const handleClose = () => {
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
}

// Função para cancelar agendamento
const handleCancelarAgendamento = () => {
  if (props.agendamentoParaEdicao?.id) {
    console.log('🗑️ Cancelando agendamento ID:', props.agendamentoParaEdicao.id)
    emit('cancelar-agendamento', props.agendamentoParaEdicao.id)
  }
}

const resetForm = () => {
  formData.value = {
    clienteId: '',
    titulo: '',
    descricao: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    cor: '#fef2f2' // Cor padrão (Rosa)
  }
  // Resetar também os campos do seletor de cliente
  clienteSelecionado.value = null
  if (seletorClienteRef.value) {
    seletorClienteRef.value.resetar()
  }
  erros.value = {}
  sucesso.value = false
}

// Watchers
watch(() => props.isOpen, (novoValor) => {
  if (novoValor) {
    if (props.modoEdicao && props.agendamentoParaEdicao) {
      // Carregar dados do agendamento para edição
      nextTick(() => {
        carregarDadosEdicao()
      })
    } else {
      resetForm()
    }
  }
})

// Função para carregar dados no modo de edição
const carregarDadosEdicao = async () => {
  if (props.agendamentoParaEdicao) {
    console.log('📝 Carregando dados para edição:', props.agendamentoParaEdicao)
    
    // Carregar dados do formulário
    formData.value = {
      clienteId: props.agendamentoParaEdicao.cliente_id || '',
      titulo: props.agendamentoParaEdicao.titulo || '',
      descricao: props.agendamentoParaEdicao.descricao || '',
      data: props.agendamentoParaEdicao.data || '',
      horaInicio: props.agendamentoParaEdicao.hora_inicio || '',
      horaFim: props.agendamentoParaEdicao.hora_fim || '',
      cor: props.agendamentoParaEdicao.cor || '#fef2f2'
    }
    
    // Se há um cliente_id, buscar o cliente correspondente
    if (props.agendamentoParaEdicao.cliente_id && seletorClienteRef.value) {
      let clienteEncontrado = props.agendamentoParaEdicao.cliente
      
      // Se não temos os dados do cliente via JOIN, buscar manualmente
      if (!clienteEncontrado && props.agendamentoParaEdicao.cliente_id) {
        console.log('🔍 Cliente não encontrado via JOIN, buscando manualmente...')
        try {
          const { buscarClientes } = useProfissionais()
          const todosClientes = await buscarClientes()
          clienteEncontrado = todosClientes.find(c => c.id === props.agendamentoParaEdicao.cliente_id)
          console.log('👤 Cliente encontrado manualmente:', clienteEncontrado)
        } catch (error) {
          console.error('❌ Erro ao buscar cliente:', error)
        }
      }
      
      if (clienteEncontrado) {
        console.log('👤 Definindo cliente no seletor:', clienteEncontrado)
        seletorClienteRef.value.definirCliente(clienteEncontrado)
      } else {
        console.warn('⚠️ Cliente não encontrado para ID:', props.agendamentoParaEdicao.cliente_id)
      }
    }
  }
}

// Lifecycle
onMounted(() => {
  console.log('🚀 ModalNovoAgendamento montado')
})
</script>