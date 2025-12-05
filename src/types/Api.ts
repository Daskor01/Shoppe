export type ValidBody =
  | Record<string, unknown>
  | string
  | FormData
  | URLSearchParams
  | Blob
  | ArrayBuffer
  | null
  | undefined

export type ValidQuery =
  | Record<string, string | number | boolean | undefined>
  | URLSearchParams
  | undefined

export interface ApiRequestOptions<
  TBody extends ValidBody = ValidBody,
  TQuery extends ValidQuery = undefined,
> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  query?: TQuery
  body?: TBody
  headers?: Record<string, string>
}
