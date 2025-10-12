<template>
  <div class="profissional-atual">
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
  </div>
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
  
  // Se o usuário tem um perfil, tentar encontrar o profissional correspondente
  if (userStore.profile?.id) {
    const profissionalLogado = profissionais.value.find(
      prof => prof.profile_id === userStore.profile?.id
    )
    
    if (profissionalLogado) {
      console.log('👨‍⚕️ Profissional logado encontrado:', profissionalLogado)
      return profissionalLogado
    }
  }
  
  // Se não encontrou o profissional logado, retorna o primeiro da lista
  console.log('👨‍⚕️ Usando primeiro profissional da lista:', profissionais.value[0])
  return profissionais.value[0]
})

// Função para carregar profissionais
const carregarProfissionais = async () => {
  try {
    loading.value = true
    console.log('🔍 Buscando profissionais...')
    console.log('👤 Usuário logado - Profile ID:', userStore.profile?.id)
    
    const dados = await buscarProfissionais()
    profissionais.value = dados
    
    console.log('📋 Profissionais carregados:', dados.length)
    console.log('🎯 Profissional atual selecionado:', profissionalAtual.value)
  } catch (error) {
    console.error('❌ Erro ao carregar profissionais:', error)
  } finally {
    loading.value = false
  }
}

// Carregar dados ao montar o componente
onMounted(() => {
  carregarProfissionais()
})

// Log de desenvolvimento
console.log('👨‍⚕️ ProfissionalAtual carregado')
</script>

<style scoped>
.profissional-atual {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.5rem 1rem;
  min-width: 200px;
}

.profissional-info,
.sem-profissional {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
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