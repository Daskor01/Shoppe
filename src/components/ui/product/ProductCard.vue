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
        <button class="product-card__icon-button" aria-label="Add to cart" @click.stop="addToCart">
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
  import { ref } from 'vue'

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

    const message = isFavorite.value ? 'Added to wishlist' : 'Removed from wishlist'

    notify({ message, type: 'info' })
  }
</script>

<style scoped lang="scss">
  .product-card {
    position: relative;
    display: flex;
    flex-direction: column;

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
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        content: '';
      }

      @media (max-width: 1180px) {
        display: none;
      }
    }

    &__image-wrapper {
      position: relative;
      aspect-ratio: 1 / 1;
      padding: 16px;
      overflow: hidden;
      background-color: vars.$color-ligth-gray;
      border-radius: 10px;

      &::after {
        position: absolute;
        inset: 0;
        content: '';
        background: rgb(255 255 255 / 40%);
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

    &__title {
      margin-block: 10px 4px;

      @media (max-width: vars.$breakpoints-m) {
        margin-block: 4px 2px;
      }
    }

    &__main-link {
      font-size: 20px;
      font-weight: 400;
      color: inherit;
      text-decoration: none;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 16px;
      }

      @media (max-width: vars.$breakpoints-s) {
        font-size: 14px;
      }

      @media (max-width: vars.$breakpoints-m) {
        &::after {
          position: absolute;
          inset: 0;
          z-index: 1;
          content: '';
        }
      }
    }

    &__icon-button,
    &__icon-link {
      position: relative;
      z-index: 10;
      color: vars.$color-dark;
      cursor: pointer;
      background: transparent;
      border: none;
      transition:
        transform 0.2s ease,
        color 0.3s ease;

      &:hover {
        opacity: 0.6;
      }
    }

    &__icon-button--active {
      color: vars.$color-accent-red;

      :deep(svg) {
        fill: vars.$color-accent-red;
      }
    }

    &__price {
      margin: 0;
      font-size: 16px;
      font-weight: 400;
      color: vars.$color-accent-light;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 14px;
      }
    }
  }
</style>
