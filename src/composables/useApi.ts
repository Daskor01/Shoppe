import { $fetch } from 'ohmyfetch'

export function useApi<T>(baseUrl?: string) {
  const config = useRuntimeConfig()
  const apiBase = baseUrl || config.public.apiBase

  if (!apiBase) {
    throw new Error('Base URL for API is not provided')
  }

  async function fetchApi(
    path: string,
    options?: {
      method?: string
      query?: Record<string, any>
      body?: any
      headers?: Record<string, string>
    },
  ): Promise<T> {
    const url = apiBase + path
    return await $fetch<T>(url, options)
  }

  return { fetchApi }
}
