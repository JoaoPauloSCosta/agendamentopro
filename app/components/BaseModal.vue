<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <!-- Backdrop -->
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="handleBackdropClick"
      ></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
      >&#8203;</span>

      <!-- Modal panel -->
      <div
        class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        :class="modalSizeClasses"
      >
        <!-- Header -->
        <div
          v-if="$slots.header || title"
          class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <!-- Icon -->
              <div
                v-if="icon"
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                :class="iconBgClasses"
              >
                <component
                  :is="icon"
                  class="h-6 w-6"
                  :class="iconClasses"
                  aria-hidden="true"
                />
              </div>
              
              <!-- Title -->
              <div class="mt-3 text-center sm:mt-0 sm:text-left" :class="{ 'sm:ml-4': icon }">
                <h3
                  v-if="title"
                  id="modal-title"
                  class="text-lg leading-6 font-medium text-gray-900"
                >
                  {{ title }}
                </h3>
                <slot name="header" />
              </div>
            </div>

            <!-- Close button -->
            <button
              v-if="showCloseButton"
              type="button"
              class="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="handleClose"
            >
              <span class="sr-only">Fechar</span>
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
          <slot name="content">
            <slot />
          </slot>
        </div>

        <!-- Footer -->
        <div
          v-if="$slots.footer || showDefaultFooter"
          class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200"
        >
          <slot name="footer">
            <!-- Default footer buttons -->
            <template v-if="showDefaultFooter">
              <BaseButton
                v-if="confirmText"
                :variant="confirmVariant"
                :loading="loading"
                :disabled="confirmDisabled"
                class="w-full sm:w-auto sm:ml-3"
                @click="handleConfirm"
              >
                {{ confirmText }}
              </BaseButton>
              
              <BaseButton
                v-if="cancelText"
                variant="secondary"
                :disabled="loading"
                class="mt-3 w-full sm:mt-0 sm:w-auto"
                @click="handleCancel"
              >
                {{ cancelText }}
              </BaseButton>
            </template>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import BaseButton from './BaseButton.vue'

interface Props {
  isOpen?: boolean
  title?: string
  icon?: any
  iconVariant?: 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  showDefaultFooter?: boolean
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  confirmDisabled?: boolean
  loading?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  iconVariant: 'info',
  size: 'md',
  showCloseButton: true,
  showDefaultFooter: true,
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  confirmVariant: 'primary',
  confirmDisabled: false,
  loading: false,
  closeOnBackdrop: true,
  closeOnEscape: true
})

interface Emits {
  close: []
  confirm: []
  cancel: []
}

const emit = defineEmits<Emits>()

// Computed classes
const modalSizeClasses = computed(() => {
  const sizeMap = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
    full: 'sm:max-w-full sm:m-4'
  }
  return sizeMap[props.size]
})

const iconBgClasses = computed(() => {
  const variantMap = {
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
    info: 'bg-blue-100'
  }
  return variantMap[props.iconVariant]
})

const iconClasses = computed(() => {
  const variantMap = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600'
  }
  return variantMap[props.iconVariant]
})

// Event handlers
const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleClose()
  }
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape && props.isOpen) {
    handleClose()
  }
}

// Lifecycle
onMounted(() => {
  if (props.closeOnEscape) {
    document.addEventListener('keydown', handleEscapeKey)
  }
})

onUnmounted(() => {
  if (props.closeOnEscape) {
    document.removeEventListener('keydown', handleEscapeKey)
  }
})
</script>

<style scoped>
/* Adicionar animações se necessário */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>