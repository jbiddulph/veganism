export default defineNuxtRouteMiddleware(async (to) => {
  // Protect routes that require authentication
  const user = await $fetch('/api/auth/me').catch(() => null)
  if (!user) {
    return navigateTo('/auth/login')
  }
})
