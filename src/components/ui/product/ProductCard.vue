<template>
  <article class="product-card">
    <div class="product-card__image-wrapper">
      <NuxtImg 
        :src="product.image" 
        :alt="product.title"
        class="product-card__image"
        format="webp"
        width="331" 
        height="331"
        quality="70"
        fetchpriority="high"
        sizes="xs:160px md:400px"
        fit="contain"
        background="transparent"
      />

      <div class="product-card__icons" aria-label="Quick actions">
        <button 
          class="product-card__icon-button" 
          aria-label="Add to cart"
          @click.stop="addToCart"
        >
          <IconCart aria-hidden="true" />
        </button>
        
        <NuxtLink 
          :to="`/product/${product.id}`" 
          class="product-card__icon-link"
          aria-label="View product details"
        >
          <IconEye aria-hidden="true" />
        </NuxtLink>
        
        <button 
          class="product-card__icon-button" 
          :class="{ 'product-card__icon-button--active': isFavorite }"
          aria-label="Add to wishlist"
          @click.stop="toggleFavorite"
        >
          <IconLike aria-hidden="true" />
        </button>
      </div>
    </div>

    <h3 class="product-card__title">
      <NuxtLink :to="`/product/${product.id}`" class="product-card__main-link">
        {{ product.title }}
      </NuxtLink>
    </h3>
    
    <p class="product-card__price">${{ product.price }}</p>
  </article>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/useCartStore'
import { useNotification } from '@/composables/useNotification'
import type { Product } from '@/types/Product'

const props = defineProps<{
  product: Product
}>()

const { notify } = useNotification()
const cartStore = useCartStore()

const addToCart = () => {
  cartStore.addToCart(props.product)
  notify({
    message: 'The item added to your Shopping bag.',
    type: 'success',
  })
}

const isFavorite = ref(false)

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  
  const message = isFavorite.value 
    ? 'Added to wishlist' 
    : 'Removed from wishlist'
    
  notify({ message, type: 'info' })
}
</script>

<style scoped lang="scss">
.product-card {
  position: relative;
  display: flex;
  flex-direction: column;

  &__image-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    padding: 16px;
    background-color: vars.$color-ligth-gray;
    aspect-ratio: 1 / 1;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.4);
      opacity: 0;
      transition: 0.3s;
    }

    &:hover::after {
      opacity: 1;
    }

    &:hover .product-card__icons {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__icons {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 5;
    display: flex;
    gap: 1rem;
    opacity: 0;
    transform: translate(-50%, -40%);
    transition: 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      height: 100%;
      width: 100%;
    }
    
    @media (max-width: 1180px) {
      display: none;
    }
  }

  &__main-link {
    color: inherit;
    text-decoration: none;

    @media(max-width: vars.$breakpoints-m) {
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 1;
      }
    }
  }

  &__icon-button, &__icon-link {
    position: relative;
    z-index: 10;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease, color 0.3s ease;
    color: vars.$color-dark;
    
    &:hover { opacity: 0.6; }
  }

  &__icon-button--active {
    color: vars.$color-accent-red;

    :deep(svg) {
      fill: vars.$color-accent-red; 
    }
  }

  &__title {
    margin-block: 15px 5px;
    font-size: 20px;
    font-weight: 400;
  }
}
</style>