<script setup>
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()

// Test session directly
async function testSession() {
  console.log('🧪 Testing session...')
  try {
    const response = await $fetch('/api/auth/me')
    console.log('✅ Session test successful:', response)
    return response
  } catch (error) {
    console.log('❌ Session test failed:', error)
    return null
  }
}

// Test user store
function testUserStore() {
  console.log('🧪 User store state:', {
    user: userStore.user,
    loading: userStore.loading,
    error: userStore.error
  })
}

// Check cookies
async function checkCookies() {
  console.log('🍪 Document cookies:', document.cookie)
  console.log('🍪 All cookies:', document.cookie.split(';').map(c => c.trim()))
}

onMounted(() => {
  testUserStore()
  testSession()
})
</script>

<template>
  <div class="max-w-4xl mx-auto my-10 p-5">
    <h1 class="text-3xl font-bold mb-6">Debug Page</h1>
    
    <div class="mb-5">
      <h2 class="text-xl font-semibold mb-3">User Store State</h2>
      <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">{{ JSON.stringify(userStore, null, 2) }}</pre>
    </div>
    
    <div class="mb-5">
      <h2 class="text-xl font-semibold mb-3">Actions</h2>
      <div class="space-x-3">
        <button 
          @click="testSession" 
          class="px-4 py-2 bg-blue-600 text-white border-0 rounded hover:bg-blue-700 transition-colors"
        >
          Test Session API
        </button>
        <button 
          @click="testUserStore" 
          class="px-4 py-2 bg-green-600 text-white border-0 rounded hover:bg-green-700 transition-colors"
        >
          Test User Store
        </button>
        <button 
          @click="checkCookies" 
          class="px-4 py-2 bg-yellow-600 text-white border-0 rounded hover:bg-yellow-700 transition-colors"
        >
          Check Cookies
        </button>
      </div>
    </div>
    
    <div class="mb-5">
      <h2 class="text-xl font-semibold mb-3">Navigation</h2>
      <div class="space-x-3">
        <NuxtLink to="/account" class="text-blue-600 hover:text-blue-800 transition-colors">Go to Account</NuxtLink>
        <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-800 transition-colors">Go to Login</NuxtLink>
      </div>
    </div>
  </div>
</template>
