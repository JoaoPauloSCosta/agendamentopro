export default defineNuxtPlugin(async () => {
  const userStore = useUserStore()
  
  // Inicializa o store de usuário
  await userStore.initialize()
})