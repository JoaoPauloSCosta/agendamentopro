<template>
  <BaseModal
    :is-open="isOpen"
    :title="title"
    :icon="ExclamationTriangleIcon"
    icon-variant="error"
    confirm-text="Confirmar"
    cancel-text="Cancelar"
    confirm-variant="danger"
    :loading="loading"
    @close="handleCancel"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <!-- Mensagem -->
    <div class="text-center">
      <p class="text-gray-700">{{ message }}</p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  title?: string
  message: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Confirmar Ação',
  loading: false
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>