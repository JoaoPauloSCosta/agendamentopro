<template>
  <div class="base-input-wrapper">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-neutral-700 mb-2"
      :class="{ 'text-error-600': hasError }"
    >
      {{ label }}
      <span v-if="required" class="text-error-500 ml-1">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Icon Left -->
      <div
        v-if="iconLeft"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component
          :is="iconLeft"
          class="h-5 w-5 text-neutral-400"
          :class="{ 'text-error-500': hasError }"
        />
      </div>

      <!-- Input Element -->
      <input
        :id="inputId"
        ref="inputRef"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :minlength="minlength"
        :min="min"
        :max="max"
        :step="step"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />

      <!-- Icon Right / Clear Button -->
      <div
        v-if="iconRight || (clearable && modelValue)"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <!-- Clear Button -->
        <button
          v-if="clearable && modelValue && !iconRight"
          type="button"
          class="text-neutral-400 hover:text-neutral-600 focus:outline-none"
          @click="clearInput"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Icon Right -->
        <component
          v-else-if="iconRight"
          :is="iconRight"
          class="h-5 w-5 text-neutral-400"
          :class="{ 'text-error-500': hasError }"
        />
      </div>

      <!-- Password Toggle -->
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none"
        @click="togglePasswordVisibility"
      >
        <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
        </svg>
      </button>
    </div>

    <!-- Helper Text / Error Message -->
    <div v-if="helperText || errorMessage" class="mt-2">
      <p
        v-if="errorMessage"
        class="text-sm text-error-600"
      >
        {{ errorMessage }}
      </p>
      <p
        v-else-if="helperText"
        class="text-sm text-neutral-500"
      >
        {{ helperText }}
      </p>
    </div>

    <!-- Character Count -->
    <div
      v-if="maxlength && showCharCount"
      class="mt-1 text-right"
    >
      <span
        class="text-xs"
        :class="characterCountClasses"
      >
        {{ characterCount }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  /** Valor do input (v-model) */
  modelValue?: string | number
  /** Tipo do input */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  /** Label do input */
  label?: string
  /** Placeholder */
  placeholder?: string
  /** Texto de ajuda */
  helperText?: string
  /** Mensagem de erro */
  errorMessage?: string
  /** Input desabilitado */
  disabled?: boolean
  /** Input somente leitura */
  readonly?: boolean
  /** Campo obrigatório */
  required?: boolean
  /** Ícone à esquerda */
  iconLeft?: string
  /** Ícone à direita */
  iconRight?: string
  /** Botão de limpar */
  clearable?: boolean
  /** Tamanho do input */
  size?: 'sm' | 'md' | 'lg'
  /** Autocomplete */
  autocomplete?: string
  /** Comprimento máximo */
  maxlength?: number
  /** Comprimento mínimo */
  minlength?: number
  /** Valor mínimo (para number) */
  min?: number
  /** Valor máximo (para number) */
  max?: number
  /** Step (para number) */
  step?: number
  /** Mostrar contador de caracteres */
  showCharCount?: boolean
  /** ID fixo para evitar problemas de hidratação */
  id?: string
}

interface Emits {
  /** Atualização do v-model */
  'update:modelValue': [value: string | number]
  /** Evento de blur */
  blur: [event: FocusEvent]
  /** Evento de focus */
  focus: [event: FocusEvent]
  /** Evento de keydown */
  keydown: [event: KeyboardEvent]
  /** Input foi limpo */
  clear: []
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  label: '',
  placeholder: '',
  helperText: '',
  errorMessage: '',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  size: 'md',
  autocomplete: 'off',
  showCharCount: false,
  id: undefined
})

const emit = defineEmits<Emits>()

// Refs
const inputRef = ref<HTMLInputElement>()
const showPassword = ref(false)

// ID fixo para evitar problemas de hidratação
const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)

// Tipo do input (para password toggle)
const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

// Verificar se há erro
const hasError = computed(() => !!props.errorMessage)

// Contador de caracteres
const characterCount = computed(() => {
  return String(props.modelValue).length
})

const characterCountClasses = computed(() => {
  if (!props.maxlength) return 'text-neutral-500'
  
  const count = characterCount.value
  const max = props.maxlength
  const percentage = (count / max) * 100
  
  if (percentage >= 100) return 'text-error-600'
  if (percentage >= 80) return 'text-warning-600'
  return 'text-neutral-500'
})

// Classes do input
const inputClasses = computed(() => {
  const baseClasses = [
    'input',
    'block',
    'w-full',
    'border',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-1',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:bg-neutral-50'
  ]

  // Tamanhos
  const sizeClasses = {
    sm: ['px-3', 'py-2', 'text-sm'],
    md: ['px-4', 'py-3', 'text-sm'],
    lg: ['px-4', 'py-4', 'text-base']
  }

  // Estados
  const stateClasses = []
  if (hasError.value) {
    stateClasses.push(
      'border-error-300',
      'text-error-900',
      'placeholder-error-400',
      'focus:ring-error-500',
      'focus:border-error-500'
    )
  } else {
    stateClasses.push(
      'border-neutral-300',
      'text-neutral-900',
      'placeholder-neutral-400',
      'focus:ring-primary-500',
      'focus:border-primary-500'
    )
  }

  // Padding para ícones
  const paddingClasses = []
  if (props.iconLeft) {
    paddingClasses.push('pl-10')
  }
  if (props.iconRight || (props.clearable && props.modelValue) || props.type === 'password') {
    paddingClasses.push('pr-10')
  }

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...stateClasses,
    ...paddingClasses
  ]
})

// Handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value
  
  if (props.type === 'number') {
    value = target.valueAsNumber || 0
  }
  
  emit('update:modelValue', value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const clearInput = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Métodos públicos
const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

const select = () => {
  inputRef.value?.select()
}

// Expor métodos
defineExpose({
  focus,
  blur,
  select,
  inputRef
})
</script>

<style scoped>
/* Estilos adicionais se necessário */
.base-input-wrapper {
  @apply w-full;
}

/* Remove spinner do input number */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>