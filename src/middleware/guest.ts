export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  const guestOnlyPages = ['/account', '/reset-password']

  if (authStore.isAuthenticated && guestOnlyPages.includes(to.path)) {
    return navigateTo('/')
  }
})
