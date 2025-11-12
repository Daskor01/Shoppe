export interface Review {
  name: string
  message: string
  email: string
  date: string
  rating?: number
}

export interface FormData extends Omit<Review, 'date'> {}
