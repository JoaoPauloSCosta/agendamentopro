<template>
  <NuxtLayout>
    <div class="p-8">
      <!-- Header -->
      <div class="header-container">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Agendamentos</h1>
        
        <!-- Filtros -->
        <div class="filtros-container">
          <!-- Primeira linha: Seletores -->
          <div class="filtros-linha-principal">
            <!-- Filtro de Cliente -->
            <div class="filtro-item filtro-seletor">
              <SeletorClienteFiltro
                ref="seletorClienteRef"
                v-model="clienteSelecionadoId"
                @cliente-selecionado="handleClienteSelecionado"
              />
            </div>

            <!-- Filtro de Profissional -->
            <div class="filtro-item filtro-seletor">
              <label for="profissional" class="block text-sm font-medium text-gray-700 mb-2">
                Profissional
              </label>
              <select
                id="profissional"
                v-model="profissionalSelecionadoId"
                class="select-profissional"
                :disabled="carregandoProfissionais"
              >
                <option value="">
                  {{ carregandoProfissionais ? 'Carregando...' : 'Todos os profissionais' }}
                </option>
                <option
                  v-for="profissional in profissionais"
                  :key="profissional.profissional_id"
                  :value="profissional.profissional_id"
                >
                  {{ profissional.nome_profissional }}
                </option>
              </select>
            </div>

            <!-- Botão Limpar Filtros -->
            <div class="filtro-item filtro-botao">
              <button
                type="button"
                class="btn-limpar-filtros"
                @click="limparFiltros"
              >
                Limpar Filtros
              </button>
            </div>
          </div>

          <!-- Segunda linha: Checkbox -->
          <div class="filtros-linha-secundaria">
            <label class="filtro-label">
              <input
                v-model="ocultarCancelados"
                type="checkbox"
                class="filtro-checkbox"
              />
              <span>Ocultar cancelados</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Lista de Agendamentos -->
      <ListaAgendamentos 
        ref="listaAgendamentosRef"
        :filtros="filtrosAtivos"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import ListaAgendamentos from '~/components/ListaAgendamentos.vue'
import SeletorClienteFiltro from '~/components/agendamentos/SeletorClienteFiltro.vue'
import { useProfissionais } from '~/composables/useProfissionais'
import type { AgRelatorioFiltros, AgProfissional, AgCliente } from '~/types/database'

// Configuração da página
definePageMeta({
  title: 'Agendamentos - AgendaPro'
})

// SEO
useHead({
  title: 'Agendamentos - AgendaPro',
  meta: [
    {
      name: 'description',
      content: 'Visualize e gerencie todos os agendamentos do sistema.'
    }
  ]
})

// Composables
const { buscarProfissionais } = useProfissionais()

// Referências para componentes
const listaAgendamentosRef = ref()
const seletorClienteRef = ref()

// Estado dos filtros
const ocultarCancelados = ref(false) // Padrão: não ocultar (mostrar todos)
const clienteSelecionadoId = ref<string>('')
const profissionalSelecionadoId = ref<string>('')

// Estado para dados
const profissionais = ref<AgProfissional[]>([])
const carregandoProfissionais = ref(false)

// Computed para filtros ativos
const filtrosAtivos = computed<AgRelatorioFiltros>(() => {
  const filtros: AgRelatorioFiltros = {
    incluirCancelados: !ocultarCancelados.value // Inverte a lógica
  }

  // Adicionar filtro de cliente se selecionado
  if (clienteSelecionadoId.value) {
    filtros.clienteId = parseInt(clienteSelecionadoId.value)
  }

  // Adicionar filtro de profissional se selecionado
  if (profissionalSelecionadoId.value) {
    filtros.profissionalId = parseInt(profissionalSelecionadoId.value)
  }

  return filtros
})

// Função para carregar profissionais em segundo plano
const carregarProfissionais = async () => {
  try {
    carregandoProfissionais.value = true
    console.log('🔍 Carregando profissionais em segundo plano...')
    
    const dados = await buscarProfissionais()
    profissionais.value = dados
    
    console.log('✅ Profissionais carregados:', dados.length)
    console.log('📋 Dados dos profissionais:', dados)
    
    // Log detalhado de cada profissional
    dados.forEach((prof, index) => {
      console.log(`Profissional ${index + 1}:`, {
        id: prof.profissional_id,
        nome: prof.nome_profissional,
        especialidade: prof.especialidade_nome
      })
    })
  } catch (error) {
    console.error('❌ Erro ao carregar profissionais:', error)
    profissionais.value = []
  } finally {
    carregandoProfissionais.value = false
  }
}

// Handler para quando um cliente é selecionado
const handleClienteSelecionado = (cliente: AgCliente | null) => {
  console.log('👤 Cliente selecionado:', cliente)
}

// Função para limpar todos os filtros
const limparFiltros = () => {
  // Limpar seleção de cliente usando o método do componente
  if (seletorClienteRef.value) {
    seletorClienteRef.value.resetar()
  }
  
  // Limpar outros filtros
  clienteSelecionadoId.value = ''
  profissionalSelecionadoId.value = ''
  ocultarCancelados.value = false
  
  console.log('🧹 Filtros limpos')
}

// Watcher para log de debug dos filtros
watch(filtrosAtivos, (novosFiltros) => {
  console.log('🔄 Filtros alterados na página')
  console.log('📋 Filtros ativos:', novosFiltros)
  
  // Log do profissional selecionado
  if (novosFiltros.profissionalId) {
    const profSelecionado = profissionais.value.find(p => p.profissional_id === novosFiltros.profissionalId)
    console.log('👨‍⚕️ Profissional selecionado:', {
      id: profSelecionado?.profissional_id,
      nome: profSelecionado?.nome_profissional,
      profile_id: profSelecionado?.profile_id
    })
  }
}, { deep: true })

// Carregar dados ao montar o componente
onMounted(() => {
  // Carregar profissionais em segundo plano
  carregarProfissionais()
})

// Log de desenvolvimento
console.log('📅 Página de Agendamentos carregada')
</script>

<style scoped>
.header-container {
  margin-bottom: 2rem;
}

.filtros-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.filtros-linha-principal {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
}

.filtros-linha-secundaria {
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.5rem;
}

.filtro-item {
  display: flex;
  flex-direction: column;
}

.filtro-seletor {
  min-width: 0;
  flex: 1;
}

.filtro-botao {
  display: flex;
  align-items: flex-end;
}

.select-profissional {
  width: 100%;
  min-width: 200px;
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #ffffff;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

.select-profissional:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-color: #3b82f6;
}

.select-profissional:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

.select-profissional option {
  padding: 0.75rem 0.5rem;
  color: #1f2937;
  background-color: #ffffff;
  font-size: 0.875rem;
  line-height: 1.5;
}

.filtro-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  user-select: none;
}

.filtro-checkbox {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  cursor: pointer;
  accent-color: #3b82f6;
}

.filtro-checkbox:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.btn-limpar-filtros {
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  height: fit-content;
}

.btn-limpar-filtros:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.btn-limpar-filtros:active {
  background-color: #f3f4f6;
}

/* Responsividade */
@media (max-width: 1024px) {
  .filtros-linha-principal {
    grid-template-columns: 1fr 1fr;
  }
  
  .filtro-botao {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
  
  .btn-limpar-filtros {
    width: auto;
  }
}

@media (max-width: 640px) {
  .filtros-linha-principal {
    grid-template-columns: 1fr;
  }
  
  .filtro-seletor {
    min-width: 100%;
  }
  
  .select-profissional {
    min-width: 100%;
  }
  
  .btn-limpar-filtros {
    width: 100%;
  }
}
</style>