<script setup lang="ts">
import { useUserStore } from '../../stores/user'

const store = useUserStore()

// Check if user is logged in on page load
onMounted(() => {
  store.fetchMe()
})
</script>

<template>
  <div class="max-w-4xl mx-auto my-10 p-5">
    <h1 class="text-4xl font-bold mb-4">Welcome to Vegan App</h1>
    <p class="text-lg text-gray-600 mb-8">This is your Nuxt 4 application with authentication system.</p>
    
    <div v-if="store.user" class="my-5 p-5 bg-blue-50 border border-blue-200 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">Welcome back, {{ store.user.email }}!</h2>
      <p class="text-gray-700 mb-4">You are logged in and your email is {{ store.user.emailVerified ? 'verified' : 'not verified' }}.</p>
      <div class="flex space-x-3">
        <NuxtLink 
          to="/account" 
          class="inline-block px-4 py-2 bg-green-600 text-white no-underline rounded hover:bg-green-700 transition-colors"
        >
          Go to Account
        </NuxtLink>
        <button 
          @click="store.logout" 
          class="px-4 py-2 bg-red-500 text-white border-0 rounded cursor-pointer hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
    
    <div v-else class="my-5 p-5 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">Get Started</h2>
      <p class="text-gray-700 mb-4">Please log in or create an account to access the full features.</p>
      <div>
        <NuxtLink 
          to="/auth/login" 
          class="inline-block px-4 py-2 bg-green-600 text-white no-underline rounded hover:bg-green-700 transition-colors"
        >
          Login / Register
        </NuxtLink>
      </div>
    </div>
    
    <div class="mt-10">
      <h2 class="text-2xl font-semibold mb-4">Available Pages</h2>
      <ul class="list-none p-0 space-y-2">
        <li>
          <NuxtLink to="/auth/login" class="text-blue-600 no-underline hover:text-blue-800 transition-colors">
            /auth/login - Login and Registration
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/account" class="text-blue-600 no-underline hover:text-blue-800 transition-colors">
            /account - User Account (Protected)
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/auth/forgot-password" class="text-blue-600 no-underline hover:text-blue-800 transition-colors">
            /auth/forgot-password - Password Reset
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/debug" class="text-blue-600 no-underline hover:text-blue-800 transition-colors">
            /debug - Debug Page
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
