<template>
  <div class="cart-item" role="listitem">
    <div class="cart-item__image-container">
      <NuxtImg
        :src="item.product.image"
        :alt="item.product.title"
        class="cart-item__image"
        width="150"
        height="150"
        fit="contain"
        loading="lazy"
        background="transparent"
      />
    </div>

    <div class="cart-item__details">
      <div class="cart-item__text-container">
        <h3 class="cart-item__name">{{ item.product.title }}</h3>
        <p class="cart-item__price">$ {{ item.product.price.toFixed(2) }}</p>
      </div>

      <div class="cart-item__controls">
        <button
          class="cart-item__controls-button"
          :aria-label="`Decrease quantity of ${item.product.title}`"
          @click="emit('decrease')"
        >
          −
        </button>

        <span aria-live="polite" aria-atomic="true">
          {{ item.quantity }}
        </span>

        <button
          class="cart-item__controls-button"
          :aria-label="`Increase quantity of ${item.product.title}`"
          @click="emit('increase')"
        >
          +
        </button>
      </div>
    </div>

    <button
      class="cart-item__remove"
      :aria-label="`Remove ${item.product.title} from cart`"
      @click="emit('remove')"
    >
      <IconClose class="cart-item__remove-icon" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import type { CartItem } from '@/stores/useCartStore'
  import IconClose from '@/components/icons/IconClose.vue'

  defineProps<{
    item: CartItem
  }>()

  const emit = defineEmits(['increase', 'decrease', 'remove'])
</script>

<style scoped lang="scss">
  .cart-item {
    position: relative;
    display: flex;
    gap: 1rem;
    padding-block: 6px;
    padding-bottom: 1rem;
    border-bottom: 1px solid vars.$color-ligth-gray;

    &__image-container {
      box-sizing: border-box;
      flex-shrink: 0;
      width: 100px;
      height: 100px;
      padding: 10px;
      overflow: hidden;
      background-color: vars.$color-ligth-gray;
      border-radius: 8px;

      @media (min-width: vars.$breakpoints-l) {
        width: 120px;
        height: 120px;
      }
    }

    &__image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    &__details {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      justify-content: space-between;
      padding-right: 2rem;
    }

    &__name {
      display: -webkit-box;
      margin: 0;
      overflow: hidden;
      -webkit-line-clamp: 2;
      font-size: 0.9rem;
      font-weight: 500;
      line-height: 1.2;
      -webkit-box-orient: vertical;
    }

    &__controls {
      display: flex;
      gap: 1rem;
      align-items: center;
      width: fit-content;
      padding: 4px 12px;
      background: vars.$color-ligth-gray;
      border-radius: 4px;

      &-button {
        padding: 4px;
        font-size: 1.2rem;
        color: vars.$color-gray;
        cursor: pointer;
        background: none;
        border: none;

        &:hover {
          color: vars.$color-dark;
        }
      }
    }

    &__remove {
      position: absolute;
      top: 0;
      right: 0;
      padding: 4px;
      cursor: pointer;
      background: none;
      border: none;
      opacity: 0.5;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }
</style>
