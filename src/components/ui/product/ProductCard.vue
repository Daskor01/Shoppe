<template>
  <div class="product-card" @click="handleClick">
    <div class="product-card__image-wrapper" @mouseenter="hover = true" @mouseleave="hover = false">
      <img :src="product.image" :alt="product.title" class="product-card__image" />

      <div v-if="hover && !isMobile" class="product-card__icons">
        <button class="product-card__icon-button" @click.stop="addToCart">
          <IconCart />
        </button>
        <NuxtLink :to="`/product/${product.id}`" class="product-card__icon-link" @click.stop
          ><IconEye
        /></NuxtLink>
        <button class="product-card__icon-button">
          <IconLike />
        </button>
      </div>
    </div>
    <h3 class="product-card__title">{{ product.title }}</h3>
    <p class="product-card__price">${{ product.price }}</p>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCartStore } from '@/stores/useCartStore'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { useNotification } from '@/composables/useNotification'

  const props = defineProps<{
    product: {
      id: number
      title: string
      price: number
      image: string
    }
  }>()

  const { notify } = useNotification()

  const hover = ref(false)
  const router = useRouter()

  const cartStore = useCartStore()

  const addToCart = () => {
    cartStore.addToCart(props.product)

    notify({
      message: 'The item added to your Shopping bag.',
      type: 'success',
      button: {
        text: 'View Cart',
        handler: () => {
          cartStore.toggleCart()
        },
      },
    })
  }

  const { isBelow: isMobile } = useBreakpoint(1180)

  function handleClick() {
    if (isMobile.value) {
      router.push(`/product/${props.product.id}`)
    }
  }
</script>

<style scoped lang="scss">
  .product-card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;

    @media (max-width: vars.$breakpoints-xs) {
      inline-size: 120px;
    }

    &__image-wrapper {
      position: relative;

      &::after {
        content: '';
        transition: 0.3s;
      }

      &:hover::after {
        position: absolute;
        inset: 0;
        background-color: vars.$color-light;
        opacity: 0.5;
      }
    }

    &__icon-link {
      transition: 0.2s;

      &:hover {
        opacity: 0.5;
      }
    }

    &__icons {
      position: absolute;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      z-index: 2;
      display: flex;
      gap: 1rem;
      align-items: center;
      transform: translate(-50%, -50%);
    }

    &__icon-button {
      padding: 0.5rem;
      cursor: pointer;
      background: transparent;
      border: none;
      transition: 0.2s;

      &:hover {
        opacity: 0.5;
      }
    }

    &__title {
      inline-size: 100%;
      margin-block: 8px 6px;
      font-size: 20px;
      font-weight: 400;
      line-height: 130%;

      @media (max-width: vars.$breakpoints-s) {
        font-size: 14px;
      }
    }

    &__price {
      margin: 0;
      font-size: 20px;
      color: vars.$color-accent-light;

      @media (max-width: vars.$breakpoints-s) {
        font-size: 14px;
      }
    }

    &__image {
      box-sizing: border-box;
      inline-size: 100%;
      aspect-ratio: 1 / 1;
      padding: 20px;
      object-fit: contain;
      background-color: vars.$color-ligth-gray;
      border-radius: 10px;
    }
  }
</style>
