import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types/Product'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<Product[]>([])

  function toggle(product: Product) {
    const index = favorites.value.findIndex(p => p.id === product.id)
    if (index >= 0) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(product)
    }
  }

  function isFavorite(productId: number): boolean {
    return favorites.value.some(p => p.id === productId)
  }

  return {
    favorites,
    toggle,
    isFavorite,
  }
})
