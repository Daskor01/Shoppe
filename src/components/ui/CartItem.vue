<template>
  <div class="cart-item">
    <div class="cart-item__image-container">
      <img :src="item.product.image" :alt="item.product.title" class="cart-item__image" />
    </div>
    <div class="cart-item__details">
      <div class="card-item__text-container">
        <h3 class="cart-item__name">{{ item.product.title }}</h3>
        <p class="cart-item__price">{{ item.product.price.toFixed(2) }} ₽</p>
      </div>
      <div class="cart-item__controls">
        <button class="cart-item__controls-button" @click="$emit('decrease')">−</button>
        <span>{{ item.quantity }}</span>
        <button class="cart-item__controls-button" @click="$emit('increase')">+</button>
      </div>
    </div>
    <button class="cart-item__remove" @click="$emit('remove')">
      <IconClose class="cart-item__remove-icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import type { CartItem } from '@/stores/useCartStore'
  import IconClose from '@/components/icons/IconClose.vue'

  const props = defineProps<{
    item: CartItem
  }>()

  const emit = defineEmits(['increase', 'decrease', 'remove'])
</script>

<style scoped lang="scss">
  .cart-item {
    display: flex;
    gap: 1rem;
    position: relative;
    min-inline-size: 288px;
    min-block-size: 140px;

    &__image-container {
      inline-size: 136px;
      block-size: 126px;

      @media (min-width: vars.$breakpoints-l) {
        inline-size: 160px;
        block-size: 150px;
        margin-inline-end: 20px;
      }

      @media (min-width: vars.$breakpoints-l) {
        inline-size: 200px;
        block-size: 190px;
      }
    }

    &__image {
      inline-size: 100%;
      block-size: 100%;
      border-radius: 4px;
      object-fit: contain;
    }

    &__details {
      display: grid;
      inline-size: 100%;
    }

    &__name {
      font-weight: 400;
      font-size: 0.9rem;
      max-inline-size: 100px;
      margin: 0 0 0.25rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;

      @media (min-width: vars.$breakpoints-l) {
        font-size: 1.2rem;
      }
    }

    &__price {
      margin-block: 6px;
      font-size: 0.8rem;
      color: #666;

      @media (min-width: vars.$breakpoints-l) {
        font-size: 1rem;
      }
    }

    &__remove {
      background: transparent;
      border: none;
      position: absolute;
      inset-block-start: 0;
      inset-inline-end: 0;
      cursor: pointer;

      &-icon {
        block-size: 10px;
        inline-size: 10px;

        @media (min-width: vars.$breakpoints-l) {
          block-size: 20px;
          inline-size: 20px;
        }
      }
    }

    &__controls {
      display: flex;
      align-items: center;
      justify-self: end;
      align-self: end;
      justify-content: space-between;
      color: vars.$color-gray;
      background-color: vars.$color-ligth-gray;
      block-size: 34px;
      inline-size: 100px;
      border-radius: 4px;

      @media (min-width: vars.$breakpoints-l) {
        block-size: 45px;
        inline-size: 130px;
        font-size: 1.2rem;
      }

      &-button {
        color: vars.$color-gray;
        border: none;
        cursor: pointer;

        @media (min-width: vars.$breakpoints-l) {
          font-size: 1.2rem;
        }
      }
    }
  }
</style>
