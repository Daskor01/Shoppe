import type { Product } from '@/types/Product';

export const MOCK_PRODUCT: Product = {
  id: 1,
  title: 'Premium Wireless Headphones',
  price: 299.99,
  description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
  image: 'https://via.placeholder.com/300',
  category: 'electronics',
  rating: { rate: 4.5, count: 120 }
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 2,
    title: 'Gaming Headset Pro',
    price: 129.99,
    description: 'Professional gaming headset with 7.1 surround sound.',
    image: 'https://via.placeholder.com/300',
    category: 'electronics',
    rating: { rate: 4.3, count: 89 }
  },
  {
    id: 3,
    title: 'Bluetooth Earbuds',
    price: 79.99,
    description: 'Compact true wireless earbuds with charging case.',
    image: 'https://via.placeholder.com/300',
    category: 'electronics',
    rating: { rate: 4.1, count: 156 }
  }
]