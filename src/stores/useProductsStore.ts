import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductsStore = defineStore('products', () => {
  const products = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  //Загрузка по категории
  async function fetchProductsByCategory(category: string) {
    isLoading.value = true
    try {
      const response = await fetch(`https://fakestoreapi.com/products/category/${category}`)
      const data = await response.json()
      products.value = data
    } catch (err) {
      console.error(err)
      error.value = 'Failed to load products'
    } finally {
      isLoading.value = false
    }
  }
  
  //Загрузка всех товаров
  async function fetchAllProducts() {
    isLoading.value = true
    try {
      const response = await fetch(`https://fakestoreapi.com/products`)
      const data = await response.json()
      products.value = data
    } catch (err) {
      console.error(err)
      error.value = 'Failed to load products'
    } finally {
      isLoading.value = false
    }
  }

  return {
    products,
    isLoading,
    error,
    fetchProductsByCategory,
    fetchAllProducts,
  }
})


