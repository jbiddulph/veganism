<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../../../stores/user'

definePageMeta({
  layout: 'default'
})

const store = useUserStore()
const email = ref('')
const password = ref('')
const mode = ref<'login' | 'register'>('login')

async function submit() {
  if (mode.value === 'login') {
    await store.login(email.value, password.value)
    await navigateTo('/account')
  } else {
    const result = await store.register(email.value, password.value)
    if (result) {
      // Show registration success message instead of redirecting
      alert('Registration successful! Please check your email to verify your account before logging in.')
      mode.value = 'login'
      email.value = ''
      password.value = ''
    }
  }
}
</script>

<template>
  <div class="max-w-md mx-auto my-10 p-6 border border-gray-200 rounded-lg shadow-sm">
    <h1 class="text-2xl font-bold mb-4">{{ mode === 'login' ? 'Login' : 'Register' }}</h1>
    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input 
          v-model="email" 
          type="email" 
          required 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input 
          v-model="password" 
          type="password" 
          required 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
        />
      </div>
      <p v-if="store.error" class="text-red-600 text-sm">{{ store.error }}</p>
      <button 
        :disabled="store.loading" 
        type="submit" 
        class="w-full py-2 px-4 border-0 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ store.loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create account') }}
      </button>
    </form>
    <div class="mt-3 text-center">
      <button 
        @click="mode = mode === 'login' ? 'register' : 'login'" 
        class="bg-none border-none text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
      >
        {{ mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login' }}
      </button>
    </div>
    <div v-if="mode === 'login'" class="mt-2 text-center">
      <NuxtLink to="/auth/forgot-password" class="text-blue-600 hover:text-blue-800 transition-colors">
        Forgot password?
      </NuxtLink>
    </div>
  </div>
  <div class="text-center">
    <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 transition-colors">Back home</NuxtLink>
  </div>
</template>


