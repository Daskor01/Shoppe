import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types/Product'
import { useApi } from '@/composables/useApi'
import { useDebouncedFn } from '@/composables/useDebouncedFn'
import { useRuntimeConfig } from 'nuxt/app'

export interface CartItem {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>([])
  const isOpen = ref(false)
  const isLoaded = ref(false)

  //Загружаем корзину из localStorage
  function loadCartFromStorage() {
    if (import.meta.client) {
      try {
        const data = localStorage.getItem('cart')
        if (data) {
          cartItems.value = JSON.parse(data)
        } else {
          cartItems.value = []
        }
      } catch {
        cartItems.value = []
      }
      isLoaded.value = true
    }
  }

  //Сохраняем корзину в localStorage
  function saveCartToStorage() {
    if (!window) return
    localStorage.setItem('cart', JSON.stringify(cartItems.value))
  }

  //Отправка корзины на фейковый бэкенд
  async function syncCartWithBackend() {
    try {
      const config = useRuntimeConfig()
      const baseUrl = config.public.productApi
      const { fetchApi } = useApi(baseUrl)

      await fetchApi('/carts', {
        method: 'POST',
        body: {
          userId: 1,
          date: new Date().toISOString(),
          products: cartItems.value.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        },
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Ошибка при синхронизации с API', error)
    }
  }

  const debouncedSync = useDebouncedFn(() => {
    saveCartToStorage()
    syncCartWithBackend()
  }, 500)

  watch(
    cartItems,
    () => {
      debouncedSync()
    },
    { deep: true },
  )

  //Добавление в корзину
  function addToCart(product: Product, quantity = 1) {
    const existingItem = cartItems.value.find((item) => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({ product, quantity })
    }
  }

  function removeFromCart(productId: number) {
    cartItems.value = cartItems.value.filter((item) => item.product.id !== productId)
  }

  function clearCart() {
    cartItems.value = []
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = cartItems.value.find((item) => item.product.id === productId)
    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) {
        removeFromCart(productId)
      }
    }
  }

  //Управление состоянием корзины
  function openCart() {
    isOpen.value = true
  }

  function closeCart() {
    isOpen.value = false
  }

  function toggleCart() {
    isOpen.value = !isOpen.value
  }

  const itemsCounter = computed(() => cartItems.value.length)
  const itemSuffix = computed(() => (cartItems.value.length > 1 ? 's' : ''))
  const formattedTotalPrice = computed(() => totalPrice.value.toFixed(2))

  const totalPrice = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  )

  return {
    cartItems,
    isOpen,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    openCart,
    closeCart,
    toggleCart,
    loadCartFromStorage,
    isLoaded,
    itemsCounter,
    itemSuffix,
    formattedTotalPrice,
  }
})
