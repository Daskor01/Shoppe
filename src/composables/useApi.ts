import { $fetch, type FetchOptions } from 'ohmyfetch'

type ValidBody = BodyInit | Record<string, unknown> | null | undefined
type ValidQuery =
  | Record<string, string | number | boolean | undefined>
  | URLSearchParams
  | undefined

export interface ApiRequestOptions<
  TBody extends ValidBody = undefined,
  TQuery extends ValidQuery = undefined,
> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  query?: TQuery
  body?: TBody
  headers?: Record<string, string>
}

export function useApi(baseUrl?: string) {
  const config = useRuntimeConfig()
  const apiBase = baseUrl || config.public.imageApi

  if (!apiBase) {
    throw new Error('Base URL for API is not provided')
  }

  async function fetchApi<
    TResponse,
    TBody extends ValidBody = undefined,
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
