import { useAuthStore } from '@/stores/useAuthStore'
import { defineNuxtRouteMiddleware, navigateTo, useCookie, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const token = useCookie('auth-token')
  const config = useRuntimeConfig()

  let path = to.path
  const baseUrl = config.app.baseURL
  
  if (baseUrl && path.startsWith(baseUrl)) {
    path = path.replace(baseUrl, '/')
  }
  path = path.replace(/\/+$/, '') || '/'

  const publicPages = ['/', '/account', '/reset-password']
  if (publicPages.includes(path)) return

  if (!authStore.isAuthenticated && token.value) {
    authStore.user = token.value
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/account')
  }
})