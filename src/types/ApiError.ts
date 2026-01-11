export interface ApiError {
  response?: {
    status?: number
    _data?: {
      message?: string
    }
  }
}
