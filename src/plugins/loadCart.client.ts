import { defineNuxtPlugin } from 'nuxt/app'
import { useCartStore } from '@/stores/useCartStore'

export default defineNuxtPlugin(() => {
  const cartStore = useCartStore()
  cartStore.loadCartFromStorage()
})
