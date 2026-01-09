// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const token = useCookie('auth-token')

  const path = to.path.toLowerCase()
  const publicPages = ['/', '/account', '/reset-password']

  if (publicPages.includes(path)) return

  if (!authStore.isAuthenticated && token.value) {
    authStore.user = token.value as string
    return
  }

  if (!authStore.isAuthenticated && !token.value) {
    return navigateTo('/account')
  }
})
