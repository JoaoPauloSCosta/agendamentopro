<template>
  <div class="lista-dias">
    <div class="dias-container">
      <DiaItem 
        v-for="(dia, index) in dias" 
        :key="index"
        :data="dia"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Importar o componente DiaItem
import DiaItem from './DiaItem.vue'

// Configuração do componente
defineOptions({
  name: 'ListaDias'
})

// Props - recebe a lista de dias
interface Props {
  dias: Date[]
}

const props = defineProps<Props>()
</script>

<style scoped>
.lista-dias {
  width: calc(100% - 100px);
  background-color: transparent;
  padding: 0;
  margin-left: 100px;
}

.dias-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  max-width: 100%;
}

/* Responsividade */
@media (max-width: 768px) {
  .lista-dias {
    padding: 0.75rem;
  }
  
  .dias-container {
    gap: 0.25rem;
  }
}
</style>