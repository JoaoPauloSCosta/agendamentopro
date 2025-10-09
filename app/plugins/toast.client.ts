import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    // Configurações do Toast
    position: POSITION.TOP_RIGHT,
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
    // Estilos customizados usando o system design
    toastClassName: "custom-toast",
    bodyClassName: ["custom-toast-body"],
    progressClassName: "custom-toast-progress",
    // Configurações de transição
    transition: "Vue-Toastification__bounce",
    maxToasts: 20,
    newestOnTop: true
  })
})