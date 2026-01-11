export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const token = useCookie('auth-token')

  const path = to.path.replace(/\/$/, '') || '/'
  const publicPages = ['/', '/account', '/reset-password']

  if (publicPages.includes(path)) return

  if (!authStore.isAuthenticated && token.value) {
    authStore.authorise(token.value)
    return
  }

  if (!authStore.isAuthenticated && !token.value) {
    return navigateTo('/account')
  }
})