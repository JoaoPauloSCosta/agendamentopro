<template>
  <button 
    class="profissional-atual"
    :class="{ 'cursor-default': desabilitarClick }"
    :disabled="loading"
    @click="handleClick"
  >
    <div v-if="loading" class="loading">
      <div class="loading-text">Carregando...</div>
    </div>
    
    <div v-else-if="profissionalAtual" class="profissional-info">
      <div class="nome-profissional">
        {{ profissionalAtual.nome_profissional }}
      </div>
      <div class="especialidade">
        {{ profissionalAtual.especialidade_nome }}
      </div>
    </div>
    
    <div v-else class="sem-profissional">
      <div class="nome-profissional">Nenhum profissional</div>
      <div class="especialidade">Cadastrado</div>
    </div>

    <!-- Ícone de dropdown -->
    <div v-if="!loading" class="dropdown-icon">
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { AgProfissional } from '~/types/database'
import { useProfissionais } from '~/composables/useProfissionais'
import { useUserStore } from '~/stores/user'

// Configuração do componente
defineOptions({
  name: 'ProfissionalAtual'
})

// Props
interface Props {
  profissionalSelecionadoId?: number | null
  desabilitarClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  desabilitarClick: false
})

// Emits
const emit = defineEmits<{
  click: []
  'profissionais-carregados': [profissionais: AgProfissional[]]
}>()

// Estado reativo
const profissionais = ref<AgProfissional[]>([])
const loading = ref(true)

// Stores
const userStore = useUserStore()

// Composable para buscar profissionais
const { buscarProfissionais } = useProfissionais()

// Computed para encontrar o profissional atual
const profissionalAtual = computed(() => {
  if (profissionais.value.length === 0) return null
  
  // Se há um profissional selecionado via prop, usar ele
  if (props.profissionalSelecionadoId) {
    const profissionalSelecionado = profissionais.value.find(
      prof => prof.profissional_id === props.profissionalSelecionadoId
    )
    
    if (profissionalSelecionado) {

      return profissionalSelecionado
    }
  }
  
  // Se o usuário tem um perfil, tentar encontrar o profissional correspondente
  if (userStore.profile?.id) {
    const profissionalLogado = profissionais.value.find(
      prof => prof.profile_id === userStore.profile?.id
    )
    
    if (profissionalLogado) {

      return profissionalLogado
    }
  }
  
  // Se não encontrou o profissional logado, retorna o primeiro da lista

  return profissionais.value[0]
})

// Função para carregar profissionais
const carregarProfissionais = async () => {
  try {
    loading.value = true


    const dados = await buscarProfissionais()
    profissionais.value = dados


    // Emitir evento com os profissionais carregados
    emit('profissionais-carregados', dados)
  } catch (error) {
    console.error('❌ Erro ao carregar profissionais:', error)
  } finally {
    loading.value = false
  }
}

// Função para lidar com clique
const handleClick = () => {
  if (!loading.value && !props.desabilitarClick) {

    emit('click')
  }
}

// Carregar dados ao montar o componente
onMounted(() => {
  carregarProfissionais()
})

// Log de desenvolvimento

</script>

<style scoped>
.profissional-atual {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  padding: 0.5rem 1rem;
  min-width: 200px;
  background-color: transparent;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 0.75rem;
}

.profissional-atual:hover:not(:disabled):not(.cursor-default) {
  background-color: #f3f4f6;
  border-color: #e5e7eb;
}

.profissional-atual.cursor-default {
  cursor: default;
}

.profissional-atual.cursor-default .dropdown-icon {
  display: none;
}

.profissional-atual:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.profissional-info,
.sem-profissional {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  flex: 1;
}

.dropdown-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nome-profissional {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.especialidade {
  font-size: 0.9rem;
  font-weight: 400;
  color: #6b7280;
  text-transform: capitalize;
  line-height: 1.2;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.loading-text {
  font-size: 0.9rem;
  color: #6b7280;
  font-style: italic;
}

.sem-profissional .nome-profissional {
  color: #9ca3af;
}

.sem-profissional .especialidade {
  color: #d1d5db;
}

/* Responsividade */
@media (max-width: 768px) {
  .profissional-atual {
    min-width: 150px;
    padding: 0.25rem 0.5rem;
  }
  
  .nome-profissional {
    font-size: 1rem;
  }
  
  .especialidade {
    font-size: 0.8rem;
  }
}
</style>