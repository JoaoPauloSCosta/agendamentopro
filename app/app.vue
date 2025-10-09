<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
/* Estilos customizados para Vue Toastification */
.custom-toast {
  @apply rounded-lg shadow-lg border;
}

.custom-toast.Vue-Toastification__toast--success {
  @apply bg-success-50 border-success-200 text-success-800;
}

.custom-toast.Vue-Toastification__toast--error {
  @apply bg-danger-50 border-danger-200 text-danger-800;
}

.custom-toast.Vue-Toastification__toast--warning {
  @apply bg-warning-50 border-warning-200 text-warning-800;
}

.custom-toast.Vue-Toastification__toast--info {
  @apply bg-primary-50 border-primary-200 text-primary-800;
}

.custom-toast-body {
  @apply font-medium text-sm;
}

.custom-toast-progress {
  @apply h-1;
}

.custom-toast-progress.Vue-Toastification__toast--success .Vue-Toastification__progress-bar {
  @apply bg-success-500;
}

.custom-toast-progress.Vue-Toastification__toast--error .Vue-Toastification__progress-bar {
  @apply bg-danger-500;
}

.custom-toast-progress.Vue-Toastification__toast--warning .Vue-Toastification__progress-bar {
  @apply bg-warning-500;
}

.custom-toast-progress.Vue-Toastification__toast--info .Vue-Toastification__progress-bar {
  @apply bg-primary-500;
}
</style>
