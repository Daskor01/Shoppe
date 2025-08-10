export interface ImageItem {
  id: string
  author: string
  download_url: string
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined
  page: number
  limit: number
}
