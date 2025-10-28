<template>
  <button
    :id="buttonId"
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!-- Icon Left Slot -->
    <span v-if="$slots.iconLeft && !loading" class="mr-2">
      <slot name="iconLeft" />
    </span>

    <!-- Icon Left Prop -->
    <component
      v-else-if="iconLeft && !loading"
      :is="iconLeft"
      class="w-4 h-4 mr-2"
    />

    <!-- Slot Content -->
    <slot>{{ label }}</slot>

    <!-- Icon Right Slot -->
    <span v-if="$slots.iconRight && !loading" class="ml-2">
      <slot name="iconRight" />
    </span>

    <!-- Icon Right Prop -->
    <component
      v-else-if="iconRight && !loading"
      :is="iconRight"
      class="w-4 h-4 ml-2"
    />
  </button>
</template>

<script setup lang="ts">
interface Props {
  /** Texto do botão (usado se não houver slot) */
  label?: string
  /** Variante visual do botão */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  /** Tamanho do botão */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Tipo do botão HTML */
  type?: 'button' | 'submit' | 'reset'
  /** Estado desabilitado */
  disabled?: boolean
  /** Estado de carregamento */
  loading?: boolean
  /** Ícone à esquerda */
  iconLeft?: object | Function
  /** Ícone à direita */
  iconRight?: object | Function
  /** Largura total */
  fullWidth?: boolean
  /** ID fixo para evitar problemas de hidratação */
  id?: string
}

interface Emits {
  /** Evento de clique */
  click: [event: MouseEvent]
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
  id: undefined
})

const emit = defineEmits<Emits>()

// ID único para o botão - usar undefined se não fornecido para evitar problemas de hidratação
const buttonId = computed(() => props.id)

// Classes computadas baseadas no system design
const buttonClasses = computed(() => {
  const baseClasses = [
    'btn',
    'inline-flex',
    'items-center',
    'font-medium',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:transform-none'
  ]

  // Variantes
  const variantClasses = {
    primary: [
      'btn-primary',
      'bg-primary-500',
      'text-white',
      'hover:bg-primary-600',
      'focus:ring-primary-500',
      'shadow-button'
    ],
    secondary: [
      'btn-secondary',
      'bg-neutral-100',
      'text-neutral-700',
      'border',
      'border-neutral-200',
      'hover:bg-neutral-200',
      'hover:border-neutral-300',
      'focus:ring-neutral-500'
    ],
    ghost: [
      'btn-ghost',
      'bg-transparent',
      'text-primary-600',
      'hover:bg-primary-50',
      'focus:ring-primary-500'
    ],
    danger: [
      'bg-error-500',
      'text-white',
      'hover:bg-error-600',
      'focus:ring-error-500',
      'shadow-button'
    ],
    success: [
      'bg-success-500',
      'text-white',
      'hover:bg-success-600',
      'focus:ring-success-500',
      'shadow-button'
    ]
  }

  // Tamanhos
  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm', 'rounded-md'],
    md: ['px-4', 'py-2', 'text-sm', 'rounded-lg'],
    lg: ['px-6', 'py-3', 'text-base', 'rounded-lg'],
    xl: ['px-8', 'py-4', 'text-lg', 'rounded-xl']
  }

  // Largura total
  const widthClasses = props.fullWidth ? ['w-full'] : []

  // Estados especiais
  const stateClasses = []
  if (props.loading) {
    stateClasses.push('cursor-wait')
  }
  if (props.disabled && !props.loading) {
    stateClasses.push('cursor-not-allowed')
  }

  return [
    ...baseClasses,
    ...variantClasses[props.variant],
    ...sizeClasses[props.size],
    ...widthClasses,
    ...stateClasses
  ]
})

// Handler de clique
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* Estilos adicionais se necessário */
.btn:active:not(:disabled) {
  transform: translateY(1px);
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
}
</style>