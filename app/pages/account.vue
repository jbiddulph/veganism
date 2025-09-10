<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '../../stores/user'

const store = useUserStore()

// Handle authentication - middleware should handle most cases, this is a fallback
onMounted(async () => {
  // First check if user is already in the store
  if (store.user) {
    return
  }
  
  // Try to fetch user from server
  try {
    const user = await store.fetchMe()
    if (user) {
      return
    }
  } catch (error) {
    // Server fetch failed, try localStorage backup
  }
  
  // If server fetch failed, try localStorage backup
  if (process.client) {
    const storedToken = localStorage.getItem('vegan_session_token')
    if (storedToken) {
      try {
        const user = await $fetch('/api/auth/restore-session', {
          method: 'POST',
          body: { token: storedToken }
        })
        store.setUser(user)
        return
      } catch (restoreError) {
        localStorage.removeItem('vegan_session_token')
      }
    }
  }
  
  // If all else fails, redirect to login
  await navigateTo('/auth/login')
})

async function logout() {
  await store.logout()
  await navigateTo('/auth/login')
}

async function resendVerification() {
  if (!store.user?.email) return
  try {
    await $fetch('/api/auth/send-verification', {
      method: 'POST',
      body: { email: store.user.email }
    })
    alert('Verification email sent!')
  } catch (e: any) {
    alert(e?.data?.statusMessage || e?.message || 'Failed to send verification email')
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto my-10">
    <h1 class="text-3xl font-bold mb-6">Account</h1>
    <div v-if="store.user" class="space-y-4">
      <p><strong>User ID:</strong> {{ store.user.id }}</p>
      <p><strong>Email:</strong> {{ store.user.email }}</p>
      <p><strong>Email Verified:</strong> 
        <span :class="store.user.emailVerified ? 'text-green-600' : 'text-red-600'">
          {{ store.user.emailVerified ? 'Yes' : 'No' }}
        </span>
      </p>
      <div v-if="!store.user.emailVerified" class="my-3 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
        <p class="m-0 text-yellow-800">Your email is not verified. Please check your inbox for a verification link.</p>
        <button 
          @click="resendVerification" 
          :disabled="store.loading" 
          class="mt-2 px-3 py-1.5 border-0 rounded bg-yellow-500 text-white disabled:opacity-50"
        >
          {{ store.loading ? 'Sending...' : 'Resend Verification Email' }}
        </button>
      </div>
      <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
        Logout
      </button>
    </div>
    <div v-else>
      <p>Loading or not authenticated.</p>
    </div>
  </div>
</template>


