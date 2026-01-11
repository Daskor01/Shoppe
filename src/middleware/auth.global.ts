import { useAuthStore } from '@/stores/useAuthStore'
import { defineNuxtRouteMiddleware, navigateTo, useCookie } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const token = useCookie('auth-token')
  const config = useRuntimeConfig()

  let path = to.path
  if (config.app.baseURL && path.startsWith(config.app.baseURL)) {
    path = path.replace(config.app.baseURL, '/')
  }

  path = path.replace(/\/+$/, '') || '/'

  const publicPages = ['/', '/account', '/reset-password']

  if (publicPages.includes(path)) return

  if (!authStore.isAuthenticated && token.value) {
    authStore.authorise(token.value)
    return
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/account')
  }
})