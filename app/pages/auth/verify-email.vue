<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const token = route.query.token as string
const message = ref('')
const loading = ref(false)

async function verifyEmail() {
  if (!token) {
    message.value = 'No verification token provided'
    return
  }

  loading.value = true
  try {
    const result = await $fetch('/api/auth/verify-email', {
      method: 'POST',
      body: { token }
    })
    message.value = result.message
  } catch (e: any) {
    message.value = e?.data?.statusMessage || e?.message || 'Verification failed'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (token) {
    verifyEmail()
  }
})
</script>

<template>
  <div class="max-w-md mx-auto my-10 p-6 border border-gray-200 rounded-lg shadow-sm">
    <h1 class="text-2xl font-bold mb-4">Email Verification</h1>
    <div v-if="loading">
      <p class="text-gray-600">Verifying your email...</p>
    </div>
    <div v-else>
      <p class="mb-4">{{ message }}</p>
      <div v-if="message.includes('successfully')" class="mt-4">
        <NuxtLink 
          to="/auth/login" 
          class="inline-block px-4 py-2 bg-green-600 text-white no-underline rounded hover:bg-green-700 transition-colors"
        >
          Go to Login
        </NuxtLink>
      </div>
    </div>
    <div class="mt-4">
      <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 transition-colors">Back home</NuxtLink>
    </div>
  </div>
</template>
