import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuthStore } from '@/stores/useAuthStore'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  const guestOnlyPages = ['/account', '/reset-password']

  if (authStore.isAuthenticated && guestOnlyPages.includes(to.path)) {
    return navigateTo('/')
  }
})
