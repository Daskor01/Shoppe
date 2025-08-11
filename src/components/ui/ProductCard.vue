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
  const favoritesStore = useFavoritesStore()

  const isFavorite = computed(() => favoritesStore.favorites.some((p) => p.id === props.product.id))

  const addToCart = () => {
    cartStore.addToCart(props.product)

    notify({
      message: 'The item added to your Shopping bag.',
      type: 'success',
      button: {
        text: 'View Cart',
        handler: () => {
          router.push('/cart')
        },
      },
    })
  }
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
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    inline-size: clamp(8.5rem, 4.1964rem + 21.5179vw, 23.5625rem);
    block-size: clamp(11.75rem, 6.6786rem + 25.3571vw, 29.5rem);
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
      margin-block: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: clamp(0.875rem, 0.7679rem + 0.5357vw, 1.25rem);
      font-weight: 400;
      line-height: 130%;
      white-space: nowrap;
    }

    &__price {
      margin: 0;
      font-weight: bold;
      color: vars.$color-accent-light;
    }

    &__image {
      inline-size: 100%;
      block-size: clamp(8.5rem, 4.6786rem + 19.1071vw, 21.875rem);
      object-fit: contain;
    }
  }
</style>
