import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRuntimeConfig } from 'nuxt/app'
import { getFromLocalStorage, setToLocalStorage, removeFromLocalStorage } from '@/utils/localStorage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const { fetchApi } = useApi(useRuntimeConfig().public.productApi)

  //actions
  const authorise = (token: string) => {
    user.value = token
    setToLocalStorage('auth-token', token)
  }

  const logout = () => {
    user.value = null
    removeFromLocalStorage('auth-token')
  }

  const initialize = () => {
    if (import.meta.client) {
      const token = getFromLocalStorage('auth-token')
      if (token) {
        user.value = token
      }
    }
  }

  //New action for API authentication using useApi
  const loginWithApi = async (credentials: { username: string; password: string }) => {
    try {
      const data = await fetchApi<{ token: string }>('/auth/login', {
        method: 'POST',
        body: credentials,
      })

      if (data.token) {
        authorise(data.token)
        return data.token
      } else {
        throw new Error('No token received from API')
      }
    } catch (error) {
      console.error('Login error:', error)

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error(`Network error. ${error.message}`)
        } else if (error.message.includes('401')) {
          throw new Error(`Invalid username or password.`)
        } else {
          throw new Error(`Authentication failed. ${error.message}`)
        }
      } else {
        throw new Error(`Authentication failed.`)
      }
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
