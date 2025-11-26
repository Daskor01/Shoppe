import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const { fetchApi } = useApi(useRuntimeConfig().public.productApi)

  //localStorage functions
  const getLocalStorage = (key: string): string | null => {
    if (import.meta.client) {
      return localStorage.getItem(key)
    }
    return null
  }

  const setLocalStorage = (key: string, value: string): void => {
    if (import.meta.client) {
      localStorage.setItem(key, value)
    }
  }

  const removeLocalStorage = (key: string): void => {
    if (import.meta.client) {
      localStorage.removeItem(key)
    }
  }

  //actions
  const login = (token: string): void => {
    user.value = token
    setLocalStorage('auth-token', token)
  }

  const logout = (): void => {
    user.value = null
    removeLocalStorage('auth-token')
  }

  const initialize = (): void => {
    if (import.meta.client) {
      const token = getLocalStorage('auth-token')
      if (token) {
        user.value = token
      }
    }
  }

  //New action for API authentication using useApi
  const loginWithApi = async (credentials: {
    username: string
    password: string
  }): Promise<string> => {
    try {
      const data = await fetchApi<{ token: string }>('/auth/login', {
        method: 'POST',
        body: credentials,
      })

      if (data.token) {
        login(data.token)
        return data.token
      } else {
        throw new Error('No token received from API')
      }
    } catch (error) {
      console.error('Login error:', error)

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error. Please check your connection.')
        } else if (error.message.includes('401')) {
          throw new Error('Invalid username or password.')
        } else {
          throw new Error('Authentication failed. Please try again.')
        }
      } else {
        throw new Error('Authentication failed. Please check your credentials.')
      }
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initialize,
    loginWithApi,
  }
})
