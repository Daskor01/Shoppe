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

    <div class="cart-content__footer" v-if="cartStore.cartItems.length">
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
  import CartItem from '@/components/ui/CartItem.vue'
  import BaseButton from '@/components/ui/BaseButton.vue'
  import { useCartStore } from '@/stores/useCartStore'
  import { useRouter } from 'vue-router'

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
    padding: 26px;
    position: relative;
    display: flex;
    flex-direction: column;
    block-size: 100%;

    @media (max-width: vars.$breakpoints-l) {
      padding: 0;
    }

    &__loading,
    &__empty {
      position: absolute;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      transform: translate(-50%, -50%);
      white-space: nowrap;
      font-size: 1rem;
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

      @media (min-width: vars.$breakpoints-l) {
        inset-block-start: 26px;
        border: none;
        inline-size: 24px;
        block-size: 24px;
      }

      svg {
        block-size: 100%;
        inline-size: 100%;
      }
    }

    &__title {
      font-size: 1rem;
      font-weight: 400;
      margin: 0;
      text-align: center;
      display: inline-block;

      @media (min-width: vars.$breakpoints-l) {
        font-size: 1.6rem;
      }
    }

    &__counter {
      font-size: 0.8rem;
      font-weight: 400;
      color: vars.$color-gray;
      margin: 18px 0 8px 0;

      @media (min-width: vars.$breakpoints-l) {
        font-size: 1.4rem;
      }
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
      border-color: vars.$color-dark;
      border-radius: 4px;
      color: vars.$color-dark;
      text-transform: uppercase;
      font-weight: 700;
      inline-size: 100%;
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

  //Анимация для списка товаров в корзине
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
