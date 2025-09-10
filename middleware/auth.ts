export default defineNuxtRouteMiddleware(async (to) => {
  // Import the user store
  const userStore = useUserStore()
  
  // First check if user is already in the store
  if (userStore.user) {
    return
  }
  
  // If not in store, check server-side session
  try {
    const user = await $fetch('/api/auth/me')
    
    // Populate the user store with the authenticated user
    userStore.setUser(user)
  } catch (error) {
    // Check localStorage as backup
    if (process.client) {
      const storedToken = localStorage.getItem('vegan_session_token')
      if (storedToken) {
        try {
          // Try to restore the session using the stored token
          const user = await $fetch('/api/auth/restore-session', {
            method: 'POST',
            body: { token: storedToken }
          })
          userStore.setUser(user)
          return
        } catch (restoreError) {
          localStorage.removeItem('vegan_session_token')
        }
      }
    }
    
    return navigateTo('/auth/login')
  }
})
