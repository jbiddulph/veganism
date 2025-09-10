<script setup>
import { useUserStore } from '../stores/user'

// Ensure user state is restored on app initialization
const userStore = useUserStore()

// Only run on client side
if (process.client) {
  // Small delay to ensure everything is initialized
  nextTick(async () => {
    if (!userStore.user) {
      try {
        await userStore.fetchMe()
      } catch (error) {
        // No active session found
      }
    }
  })
}
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
