<template>
  <div class="cart-content">
    <button class="cart-content__close" @click="cartStore.closeCart">
      <IconBaseArrowLeft />
    </button>

    <h2 class="cart-content__title">Shopping bag</h2>

    <div v-if="!cartStore.isLoaded" class="cart-content__loading">Загрузка корзины...</div>

    <div v-else-if="cartStore.cartItems.length === 0" class="cart-content__empty">
      Ваша корзина пуста
    </div>

    <div v-else>
      <h3 class="cart-content__counter">{{ cartStore.cartItems.length }} item{{ itemSuffix }}</h3>

      <TransitionGroup name="cart-list" tag="div" class="cart-content__list">
        <CartItem
          v-for="item in cartStore.cartItems"
          :key="item.product.id"
          :item="item"
          @increase="increase(item.product.id)"
          @decrease="decrease(item.product.id)"
          @remove="remove(item.product.id)"
        />
      </TransitionGroup>
    </div>

    <div v-if="cartStore.cartItems.length" class="cart-content__footer">
      <div class="cart-content__line" />
      <div class="cart-content__total">
        <span> Subtotal ({{ itemsCounter }} item{{ itemSuffix }}) </span>
        <span> $ {{ formattedTotalPrice }} </span>
      </div>

      <BaseButton class="cart-content__checkout" @click="goToCheckout"> View Cart </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CartItem from '@/components/ui/cart/CartItem.vue'
  import BaseButton from '@/components/ui/Base/BaseButton.vue'
  import { useCartStore } from '@/stores/useCartStore'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'

  const router = useRouter()
  const cartStore = useCartStore()

  const { itemsCounter, itemSuffix, formattedTotalPrice } = storeToRefs(cartStore)

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

  function goToCheckout() {
    cartStore.closeCart()
    router.push('/Checkout')
  }
</script>

<style scoped lang="scss">
  .cart-content {
    position: relative;
    display: flex;
    flex-direction: column;
    block-size: 100%;
    padding: 26px;

    @media (max-width: vars.$breakpoints-l) {
      padding: 0;
    }

    &__loading,
    &__empty {
      position: absolute;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      font-size: 1rem;
      white-space: nowrap;
      transform: translate(-50%, -50%);
    }

    &__close {
      position: absolute;
      inset-block-start: 0;
      inset-inline-start: 0;
      inline-size: 20px;
      block-size: 20px;
      cursor: pointer;
      background: transparent;
      border: none;

      @media (min-width: vars.$breakpoints-l) {
        inset-block-start: 26px;
        inline-size: 24px;
        block-size: 24px;
        border: none;
      }

      svg {
        inline-size: 100%;
        block-size: 100%;
      }
    }

    &__title {
      display: inline-block;
      margin: 0;
      font-size: 1rem;
      font-weight: 400;
      text-align: center;

      @media (min-width: vars.$breakpoints-l) {
        font-size: 1.6rem;
      }
    }

    &__counter {
      margin: 18px 0 8px;
      font-size: 0.8rem;
      font-weight: 400;
      color: vars.$color-gray;

      @media (min-width: vars.$breakpoints-l) {
        font-size: 1.4rem;
      }
    }

    &__list {
      display: grid;
      flex: 1 1 auto;
      gap: 1.6rem;
      padding-bottom: 160px;
    }

    &__line {
      inline-size: calc(100% + 120px);
      block-size: 1px;
      margin: 0 -60px;
      background-color: vars.$color-gray;
    }

    &__footer {
      position: fixed;
      inset-block-end: -16px;
      z-index: 1000;
      display: grid;
      gap: 20px;
      inline-size: calc(100% - 70px);
      padding: 0 36px 40px;
      margin-inline-start: -16px;
      overflow: hidden;
      background-color: vars.$color-light;

      @media (min-width: vars.$breakpoints-l) {
        margin-inline-start: -42px;
      }
    }

    &__total {
      display: flex;
      justify-content: space-between;

      @media (min-width: vars.$breakpoints-l) {
        font-size: 1.4rem;
      }
    }

    &__checkout {
      inline-size: 100%;
      font-weight: 700;
      color: vars.$color-dark;
      text-transform: uppercase;
      border-color: vars.$color-dark;
      border-radius: 4px;
      transition: 0.4s;

      @media (min-width: vars.$breakpoints-l) {
        font-size: 1.4rem;
      }

      &:hover {
        color: vars.$color-light;
        background-color: vars.$color-dark;
      }
    }
  }

  // Анимация для списка товаров в корзине
  .cart-list-enter-active,
  .cart-list-leave-active {
    transition: all 0.3s ease;
  }

  .cart-list-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }

  .cart-list-enter-to {
    opacity: 1;
    transform: translateY(0);
  }

  .cart-list-leave-from {
    opacity: 1;
    transform: translateY(0);
  }

  .cart-list-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
</style>
