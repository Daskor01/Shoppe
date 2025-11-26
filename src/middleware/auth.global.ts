export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  if (to.path === '/' || to.path === '/ResetPassword' || to.path === '/account') {
    return
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/account')
  }
})
