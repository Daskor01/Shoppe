import { defineNuxtPlugin } from 'nuxt/app'
import { useAuthStore } from '@/stores/useAuthStore'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  authStore.initialize()
})
