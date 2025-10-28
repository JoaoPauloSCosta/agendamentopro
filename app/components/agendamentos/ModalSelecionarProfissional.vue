<template>
  <BaseModal
    :is-open="isOpen"
    title="Selecionar Profissional"
    size="md"
    :show-default-footer="false"
    @close="handleClose"
  >
    <template #content>
      <div class="modal-content">
        <!-- Loading -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Carregando profissionais...</p>
        </div>

        <!-- Lista de Profissionais -->
        <div v-else-if="profissionais.length > 0" class="profissionais-lista">
          <button
            v-for="profissional in profissionais"
            :key="profissional.profissional_id"
            :class="[
              'profissional-item',
              { 'profissional-item-selecionado': profissional.profissional_id === profissionalSelecionadoId }
            ]"
            @click="selecionarProfissional(profissional)"
          >
            <div class="profissional-info">
              <div class="profissional-nome">
                {{ profissional.nome_profissional }}
              </div>
              <div class="profissional-especialidade">
                {{ profissional.especialidade_nome }}
              </div>
            </div>
            
            <!-- Ícone de check se selecionado -->
            <div v-if="profissional.profissional_id === profissionalSelecionadoId" class="check-icon">
              <svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>
        </div>

        <!-- Sem Profissionais -->
        <div v-else class="sem-profissionais">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p class="sem-profissionais-texto">Nenhum profissional cadastrado</p>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '../BaseModal.vue'
import type { AgProfissional } from '~/types/database'

// Configuração do componente
defineOptions({
  name: 'ModalSelecionarProfissional'
})

// Props
interface Props {
  isOpen: boolean
  profissionais: AgProfissional[]
  profissionalSelecionadoId: number | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// Emits
const emit = defineEmits<{
  close: []
  selecionar: [profissional: AgProfissional]
}>()

// Função para fechar o modal
const handleClose = () => {
  emit('close')
}

// Função para selecionar um profissional
const selecionarProfissional = (profissional: AgProfissional) => {
  console.log('👨‍⚕️ Profissional selecionado:', profissional)
  emit('selecionar', profissional)
  handleClose()
}

// Log de desenvolvimento
console.log('📋 ModalSelecionarProfissional carregado')
</script>

<style scoped>
.modal-content {
  min-height: 200px;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Lista de Profissionais */
.profissionais-lista {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.profissional-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.profissional-item:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.profissional-item-selecionado {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.profissional-info {
  flex: 1;
}

.profissional-nome {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.profissional-especialidade {
  font-size: 0.875rem;
  color: #6b7280;
}

.check-icon {
  flex-shrink: 0;
  margin-left: 1rem;
}

/* Sem Profissionais */
.sem-profissionais {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.sem-profissionais-texto {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Scroll customizado */
.profissionais-lista::-webkit-scrollbar {
  width: 6px;
}

.profissionais-lista::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.profissionais-lista::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.profissionais-lista::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsividade */
@media (max-width: 640px) {
  .profissional-item {
    padding: 0.875rem;
  }

  .profissional-nome {
    font-size: 0.9375rem;
  }

  .profissional-especialidade {
    font-size: 0.8125rem;
  }
}
</style>
