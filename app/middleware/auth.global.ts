export default defineNuxtRouteMiddleware(async (to) => {
  // Protect routes under /account
  if (to.path.startsWith('/account')) {
    try {
      const user = await $fetch('/api/auth/me')
      if (!user) {
        // On server side, we can't access localStorage, so we need to let the client handle it
        if (process.server) {
          return // Allow the request to proceed to the client
        }
        
        // On client side, try localStorage backup
        if (process.client) {
          const storedToken = localStorage.getItem('vegan_session_token')
          if (storedToken) {
            try {
              const user = await $fetch('/api/auth/restore-session', {
                method: 'POST',
                body: { token: storedToken }
              })
              return // Allow access
            } catch (restoreError) {
              localStorage.removeItem('vegan_session_token')
            }
          }
        }
        
        return navigateTo('/auth/login')
      }
    } catch (error) {
      // On server side, we can't access localStorage, so we need to let the client handle it
      if (process.server) {
        return // Allow the request to proceed to the client
      }
      
      // On client side, try localStorage backup
      if (process.client) {
        const storedToken = localStorage.getItem('vegan_session_token')
        if (storedToken) {
          try {
            const user = await $fetch('/api/auth/restore-session', {
              method: 'POST',
              body: { token: storedToken }
            })
            return // Allow access
          } catch (restoreError) {
            localStorage.removeItem('vegan_session_token')
          }
        }
      }
      
      return navigateTo('/auth/login')
    }
  }
})


