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
        <button class="product-card__icon-button" @click.stop="toggleFavorite">
          <IconLike :class="{ active: isFavorite }" />
        </button>
      </div>
    </div>
    <h3 class="product-card__title">{{ product.title }}</h3>
    <p class="product-card__price">${{ product.price }}</p>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCartStore } from '@/stores/useCartStore'
  import { useFavoritesStore } from '@/stores/useFavoriteStore'
  import { useBreakpoint } from '@/composables/useBreakpoint'

  const props = defineProps<{
    product: {
      id: number
      title: string
      price: number
      image: string
    }
  }>()

  const hover = ref(false)
  const router = useRouter()

  const cartStore = useCartStore()
  const favoritesStore = useFavoritesStore()

  const isFavorite = computed(() => favoritesStore.favorites.some((p) => p.id === props.product.id))

  const addToCart = () => cartStore.addToCart(props.product)
  const toggleFavorite = () => favoritesStore.toggle(props.product)

  //Мобилка
  const { isBelow: isMobile } = useBreakpoint(1180)

  //Обработчик клика
  function handleClick() {
    if (isMobile.value) {
      router.push(`/product/${props.product.id}`)
    }
  }
</script>

<style scoped lang="scss">
  .product-card {
    inline-size: clamp(8.5rem, 4.1964rem + 21.5179vw, 23.5625rem);
    block-size: clamp(11.75rem, 6.6786rem + 25.3571vw, 29.5rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    cursor: pointer;

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
      transform: translate(-50%, -50%);
      display: flex;
      gap: 1rem;
      align-items: center;
      z-index: 2;
    }

    &__icon-button {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      transition: 0.2s;

      &:hover {
        opacity: 0.5;
      }
    }

    &__title {
      inline-size: 100%;
      font-size: clamp(0.875rem, 0.7679rem + 0.5357vw, 1.25rem);
      font-weight: 400;
      line-height: 130%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-block: 5px;
    }

    &__price {
      font-weight: bold;
      color: vars.$color-accent-light;
      margin: 0;
    }

    &__image {
      inline-size: 100%;
      block-size: clamp(8.5rem, 4.6786rem + 19.1071vw, 21.875rem);
      object-fit: contain;
    }
  }
</style>
