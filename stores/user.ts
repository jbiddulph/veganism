import { defineStore } from 'pinia'

type User = { id: string; email: string; emailVerified: boolean }
type LoginResponse = { id: string; email: string; emailVerified: boolean; sessionToken?: string }

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    loading: false as boolean,
    error: null as string | null
  }),
  actions: {
    setUser(user: User | null) {
      this.user = user
      // Store session token in localStorage as backup
      if (user && process.client) {
        localStorage.setItem('vegan_session_token', user.id)
      } else if (process.client) {
        localStorage.removeItem('vegan_session_token')
      }
    },
    async fetchMe() {
      this.loading = true
      this.error = null
      try {
        const me = await $fetch<User>('/api/auth/me')
        this.user = me
        return me
      } catch (e: any) {
        this.user = null
        this.error = e?.data?.statusMessage || e?.message || 'Failed to fetch user'
        return null
      } finally {
        this.loading = false
      }
    },
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<LoginResponse>('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })
        this.user = { id: response.id, email: response.email, emailVerified: response.emailVerified }
        
        // Store session token in localStorage as backup
        if (response.sessionToken && process.client) {
          localStorage.setItem('vegan_session_token', response.sessionToken)
        }
        
        return this.user
      } catch (e: any) {
        this.error = e?.data?.statusMessage || e?.message || 'Login failed'
        throw e
      } finally {
        this.loading = false
      }
    },
    async register(email: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const me = await $fetch<User>('/api/auth/register', {
          method: 'POST',
          body: { email, password }
        })
        this.user = me
        return me
      } catch (e: any) {
        this.error = e?.data?.statusMessage || e?.message || 'Registration failed'
        throw e
      } finally {
        this.loading = false
      }
    },
    async logout() {
      this.loading = true
      this.error = null
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
        this.user = null
        
        // Clear localStorage
        if (process.client) {
          localStorage.removeItem('vegan_session_token')
        }
      } catch (e: any) {
        this.error = e?.data?.statusMessage || e?.message || 'Logout failed'
      } finally {
        this.loading = false
      }
    }
  }
})


