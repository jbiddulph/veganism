<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const token = route.query.token as string
const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const loading = ref(false)

onMounted(() => {
  if (!token) {
    message.value = 'No reset token provided'
  }
})

async function resetPassword() {
  if (!token) {
    message.value = 'No reset token provided'
    return
  }

  if (!password.value) {
    message.value = 'Password is required'
    return
  }

  if (password.value !== confirmPassword.value) {
    message.value = 'Passwords do not match'
    return
  }

  loading.value = true
  try {
    const result = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token, password: password.value }
    })
    message.value = result.message
    if (result.message.includes('successfully')) {
      setTimeout(() => {
        navigateTo('/auth/login')
      }, 2000)
    }
  } catch (e: any) {
    message.value = e?.data?.statusMessage || e?.message || 'Password reset failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto my-10 p-6 border border-gray-200 rounded-lg shadow-sm">
    <h1 class="text-2xl font-bold mb-4">Reset Password</h1>
    <form @submit.prevent="resetPassword" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <input 
          v-model="password" 
          type="password" 
          required 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <input 
          v-model="confirmPassword" 
          type="password" 
          required 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
        />
      </div>
      <p 
        v-if="message" 
        :class="message.includes('successfully') ? 'text-green-600' : 'text-red-600'"
        class="text-sm"
      >
        {{ message }}
      </p>
      <button 
        :disabled="loading || !token" 
        type="submit" 
        class="w-full py-2 px-4 border-0 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ loading ? 'Resetting...' : 'Reset Password' }}
      </button>
    </form>
    <div class="mt-4 text-center">
      <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-800 transition-colors">Back to Login</NuxtLink>
    </div>
  </div>
</template>
