import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Product } from '@/types/Product'
import { useApi } from '@/composables/useApi'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const activePromises = new Map<string, Promise<void>>()
  const currentCategory = ref<string>('')

  const api = useApi('https://fakestoreapi.com')

  async function fetchData(url: string, key: string) {
    if (activePromises.has(key)) {
      return activePromises.get(key)!
    }

    isLoading.value = true
    error.value = null

    const promise = (async () => {
      try {
        const data = await api.fetchApi<Product[]>(url)
        if (data) {
          products.value = data
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          error.value = err.message
        } else {
          error.value = String(err) // или просто "Неизвестная ошибка"
        }
        console.error('API request failed:', err)
        throw err
      } finally {
        activePromises.delete(key)
        isLoading.value = false
      }
    })()

    activePromises.set(key, promise)

    return promise
  }

  async function fetchProductsByCategory(category: string) {
    if (products.value.length && currentCategory.value === category) {
      // Уже есть данные для этой категории — не делаем запрос
      return
    }
    currentCategory.value = category
    await fetchData(`/products/category/${category}`, `category-${category}`)
  }

  async function fetchAllProducts() {
    if (products.value.length && currentCategory.value === '') {
      return
    }
    currentCategory.value = ''
    await fetchData('/products', 'all-products')
  }

  return {
    products,
    isLoading,
    error,
    currentCategory,
    fetchProductsByCategory,
    fetchAllProducts,
  }
})
