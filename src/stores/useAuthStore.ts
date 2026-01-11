import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRuntimeConfig, navigateTo, useCookie } from 'nuxt/app'
import { useApi } from '@/composables/useApi'
import type { ApiError } from '@/types/ApiError'

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()

  const tokenCookie = useCookie<string | null>('auth-token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    path: config.app.baseURL || '/',
    secure: true,
  })

  const user = ref<string | null>(tokenCookie.value || null)

  const isAuthenticated = computed(() => !!user.value)

  const { fetchApi } = useApi(config.public.productApi)

  const authorise = (token: string) => {
    user.value = token
    tokenCookie.value = token
  }

  const logout = () => {
    user.value = null
    tokenCookie.value = null
    navigateTo('/account')
  }

  const initialize = () => {
    if (tokenCookie.value) {
      user.value = tokenCookie.value
    }
  }

  const loginWithApi = async (credentials: { username: string; password: string }) => {
    try {
      const data = await fetchApi<{ token: string }>('/auth/login', {
        method: 'POST',
        body: credentials,
      })

      if (data?.token) {
        authorise(data.token)
        return data.token
      }

      throw new Error('No token received from API')
    } catch (error: unknown) {
      const errors = error as ApiError
      const status = errors.response?.status
      const apiMessage = errors.response?._data?.message

      if (status === 401) {
        throw new Error('Invalid username or password')
      } else if (status === 500) {
        throw new Error('Server-side error. Please try again later')
      }

      throw new Error(apiMessage || 'Authentication error. Please try again.')
    }
  }

  return {
    user,
    isAuthenticated,
    authorise,
    logout,
    initialize,
    loginWithApi,
  }
})
