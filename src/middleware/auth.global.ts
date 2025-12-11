import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuthStore } from '@/stores/useAuthStore'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (to.matched.length === 0) {
    return
  }

  if (to.path === '/' || to.path === '/ResetPassword' || to.path === '/account') {
    return
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/account')
  }
})
