import { $fetch, type FetchOptions } from 'ohmyfetch'
import { useRuntimeConfig } from 'nuxt/app'
import type { ValidBody, ValidQuery, ApiRequestOptions } from '@/types/Api'

export function useApi(baseUrl?: string) {
  const config = useRuntimeConfig()
  const apiBase = baseUrl || config.public.imageApi

  if (!apiBase) {
    throw new Error('Base URL for API is not provided')
  }

  async function fetchApi<
    TResponse,
    TBody extends ValidBody = ValidBody,
    TQuery extends ValidQuery = undefined,
  >(
    path: string,
    options: ApiRequestOptions<TBody, TQuery> = {} as ApiRequestOptions<TBody, TQuery>,
  ): Promise<TResponse> {
    const { method = 'GET', query, body, headers } = options

    const url = `${apiBase}${path}`

    const fetchOptions: FetchOptions<'json'> = {
      method,
      query,
      body,
      headers,
    }

    return await $fetch<TResponse>(url, fetchOptions)
  }

  return { fetchApi }
}
