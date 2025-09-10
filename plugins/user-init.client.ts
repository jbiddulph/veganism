export default defineNuxtPlugin(async () => {
  const userStore = useUserStore()
  
  // Only run on client side and if user is not already loaded
  if (process.client && !userStore.user) {
    console.log('🔄 User init plugin: Attempting to restore user session...')
    try {
      const user = await userStore.fetchMe()
      if (user) {
        console.log('✅ User init plugin: User restored successfully', user)
      } else {
        console.log('❌ User init plugin: No user found in session')
      }
    } catch (error) {
      // Silently fail - user might not be logged in
      console.log('❌ User init plugin: No active session found', error.message)
    }
  } else {
    console.log('ℹ️ User init plugin: Skipping - user already loaded or server side')
  }
})
