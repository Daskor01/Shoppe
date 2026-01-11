export interface Review {
  id: number | string;
  name: string
  message: string
  email: string
  date: string
  rating?: number
}

export interface FormData extends Omit<Review, 'date'> {}
