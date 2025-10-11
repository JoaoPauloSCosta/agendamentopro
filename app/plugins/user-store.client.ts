export default defineNuxtPlugin(async () => {
  const userStore = useUserStore()
  
  // Inicializa o store de usuário
  await userStore.initialize()
  
  console.log('🔐 Store de usuário inicializado!')
})