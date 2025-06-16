import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/Product'

interface CartItem {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>([])

  function addToCart(product: Product, quantity = 1) {
    const existingItem = cartItems.value.find(item => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({
        product,
        quantity
      })
    }
  }

  function removeFromCart(productId: number) {
    cartItems.value = cartItems.value.filter(item => item.product.id !== productId)
  }

  function clearCart() {
    cartItems.value = []
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = cartItems.value.find(item => item.product.id === productId)
    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) {
        removeFromCart(productId)
      }
    }
  }

  const totalItems = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  })

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    totalItems,
    totalPrice
  }
})
