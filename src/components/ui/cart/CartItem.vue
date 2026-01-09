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

  const props = defineProps<{
    item: CartItem
  }>()

  const emit = defineEmits(['increase', 'decrease', 'remove'])
</script>

<style scoped lang="scss">
  .cart-item {
    position: relative;
    display: flex;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid vars.$color-ligth-gray;
    padding-block: 6px;

    &__image-container {
      flex-shrink: 0;
      width: 100px;
      height: 100px;
      background-color: vars.$color-ligth-gray;
      border-radius: 8px;
      padding: 10px;
      box-sizing: border-box;
      overflow: hidden;

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
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
      padding-right: 2rem; 
    }

    &__name {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 500;
      line-height: 1.2;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &__controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: fit-content;
      background: vars.$color-ligth-gray;
      padding: 4px 12px;
      border-radius: 4px;

      &-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        font-size: 1.2rem;
        color: vars.$color-gray;
        
        &:hover { color: vars.$color-dark; }
      }
    }

    &__remove {
      position: absolute;
      top: 0;
      right: 0;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      opacity: 0.5;
      transition: opacity 0.2s;

      &:hover { opacity: 1; }
    }
  }
</style>