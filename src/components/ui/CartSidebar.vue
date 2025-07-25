<template>
  <div class="cart-content">
    <button v-if="isMobile" class="cart-content__close" @click="cartStore.closeCart">
      <IconBaseArrowLeft />
    </button>

    <h2 class="cart-content__title">Shopping bag</h2>

    <div v-if="!cartStore.isLoaded" class="cart-content__loading">Загрузка корзины...</div>

    <div v-else-if="cartStore.cartItems.length === 0" class="cart-content__empty">
      Ваша корзина пуста
    </div>

    <div v-else>
      <h3 class="cart-content__counter">{{ cartStore.cartItems.length }} item{{ itemSuffix }}</h3>

      <div class="cart-content__list">
        <CartItem
          v-for="item in cartStore.cartItems"
          :key="item.product.id"
          :item="item"
          :onIncrease="() => increase(item.product.id)"
          :onDecrease="() => decrease(item.product.id)"
          :onRemove="() => remove(item.product.id)"
        />
      </div>
    </div>

    <div class="cart-content__footer" v-if="cartStore.cartItems.length">
      <div class="cart-content__line" />
      <div class="cart-content__total">
        <span> Subtotal ({{ itemsCounter }} item{{ itemSuffix }}) </span>
        <span> $ {{ totalPrice }} </span>
      </div>
      <NuxtLink class="cart-content__checkout" to="/Checkout"> View Cart </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CartItem from '@/components/ui/CartItem.vue'
  import { useCartStore } from '@/stores/useCartStore'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { TABLET_BREAKPOINT } from '@/constants/breakpoints'

  const cartStore = useCartStore()

  const itemsCounter = computed(() => cartStore.cartItems.length)
  const itemSuffix = computed(() => (cartStore.cartItems.length > 1 ? 's' : ''))
  const totalPrice = computed(() => cartStore.totalPrice.toFixed(2))

  function remove(id: number) {
    cartStore.removeFromCart(id)
  }

  function increase(id: number) {
    const item = cartStore.cartItems.find((i) => i.product.id === id)
    if (item) {
      cartStore.updateQuantity(id, item.quantity + 1)
    }
  }

  function decrease(id: number) {
    const item = cartStore.cartItems.find((i) => i.product.id === id)
    if (item) {
      cartStore.updateQuantity(id, item.quantity - 1)
    }
  }

  const { isBelow: isMobile } = useBreakpoint(TABLET_BREAKPOINT)
</script>

<style scoped lang="scss">
  .cart-content {
    padding: 26px;
    position: relative;
    display: flex;
    flex-direction: column;
    block-size: 100%;

    @media (max-width: vars.$breakpoints-m) {
      padding: 0;
    }

    &__close {
      position: absolute;
      background: transparent;
      border: none;
      inline-size: 20px;
      block-size: 20px;
      cursor: pointer;
      inset-block-start: 0;
      inset-inline-start: 0;
    }

    &__title {
      font-size: 1rem;
      font-weight: 400;
      margin: 0;

      @media (max-width: vars.$breakpoints-m) {
        text-align: center;
      }
    }

    &__counter {
      font-size: 0.8rem;
      font-weight: 400;
      color: vars.$color-gray;
      margin: 18px 0 8px 0;
    }

    &__list {
      display: grid;
      gap: 1.6rem;
      padding-bottom: 160px;
      flex: 1 1 auto;
    }

    &__line {
      inline-size: calc(100% + 120px);
      margin: 0 -60px 0;
      block-size: 1px;
      background-color: vars.$color-gray;
    }

    &__footer {
      position: fixed;
      background-color: vars.$color-light;
      display: grid;
      gap: 20px;
      inset-block-end: -16px;
      margin-inline-start: -16px;
      inline-size: calc(100% - 70px);
      padding: 0 36px 40px;
      z-index: 1000;
      overflow: hidden;

      @media (min-width: vars.$breakpoints-m) {
        margin-inline-start: -42px;
      }
    }

    &__total {
      display: flex;
      margin-inline: -20px;
      justify-content: space-between;
    }

    &__checkout {
      @include mixins.flexCenter;
      margin-inline: -16px;
      border: 1px solid vars.$color-dark;
      font-size: 1rem;
      padding: 1rem;
      border-radius: 4px;
      color: vars.$color-dark;
      text-decoration: none;
      text-transform: uppercase;
      font-weight: 700;
      inline-size: 100%;
      transition: 0.4s;

      &:hover {
        color: vars.$color-light;
        background-color: vars.$color-dark;
      }
    }
  }
</style>
