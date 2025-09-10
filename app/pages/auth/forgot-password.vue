<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const message = ref('')
const loading = ref(false)

async function sendResetEmail() {
  if (!email.value) {
    message.value = 'Email is required'
    return
  }

  loading.value = true
  try {
    const result = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    message.value = result.message
  } catch (e: any) {
    message.value = e?.data?.statusMessage || e?.message || 'Failed to send reset email'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto my-10 p-6 border border-gray-200 rounded-lg shadow-sm">
    <h1 class="text-2xl font-bold mb-4">Forgot Password</h1>
    <p class="text-gray-600 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
    <form @submit.prevent="sendResetEmail" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input 
          v-model="email" 
          type="email" 
          required 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
        />
      </div>
      <p v-if="message" class="text-green-600 text-sm">{{ message }}</p>
      <button 
        :disabled="loading" 
        type="submit" 
        class="w-full py-2 px-4 border-0 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ loading ? 'Sending...' : 'Send Reset Link' }}
      </button>
    </form>
    <div class="mt-4 text-center">
      <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-800 transition-colors">Back to Login</NuxtLink>
    </div>
  </div>
</template>
