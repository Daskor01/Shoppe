<template>
  <div class="product-info">
    <h1 class="product-info__title">{{ product.title }}</h1>

    <div class="product-info__price-wrapper">
      <p class="product-info__price">${{ formattedPrice }}</p>

      <div v-if="mobile">
        <div class="product-info__share-mobile">
          <button class="product-info__share-mobile-button" @click="toggleShare">
            <IconShare />
          </button>

          <ShareModal :is-open="isShareModalOpen" @close="isShareModalOpen = false" />
        </div>
      </div>
    </div>

    <div v-if="!mobile">
      <div class="product-info__rating">
        <StarRating
          :modelValue="Math.round(product.rating?.rate || 0)"
          class="product-info__rating-star"
          readonly
        />
        <span class="product-info__rating-text">{{ counterReviews }} customer review</span>
      </div>

      <div class="product-info__description">
        {{ product.description }}
      </div>
    </div>
    <div class="product-info__actions">
      <div v-if="!mobile" class="product-info__quantity">
        <button class="product-info__quantity-button" @click="decrease">-</button>
        <span class="product-info__quantity-value">{{ quantity }}</span>
        <button class="product-info__quantity-button" @click="increase">+</button>
      </div>

      <BaseButton class="product-info__cart-button" @click="addToCart">Add to cart</BaseButton>
    </div>

    <div v-if="!mobile" class="product-info__interaction">
      <button
        :class="{ liked: isLiked }"
        class="product-info__interaction-like"
        @click="toggleLike"
      >
        <IconLikeProduct />
      </button>
      <div class="product-info__divider"></div>
      <div class="product-info__share">
        <IconMail />
        <IconFacebook />
        <IconInstagram />
        <IconTwitter />
      </div>
    </div>

    <div v-if="mobile" class="product-info__meta-mobile">
      <details ref="detailsRef" class="product-info__expandable">
        <summary class="product-info__summary">{{ product.description }}</summary>

        <div class="product-info__meta">
          <p class="product-info__meta-item">
            <span class="product-info__meta-item--accent">SKU:</span> {{ product.id }}
          </p>
          <p class="product-info__meta-item">
            <span class="product-info__meta-item--accent">Category:</span>
            {{ product.category }}
          </p>
        </div>
      </details>

      <button class="product-info__toggle-button" @click="toggleDetails">
        <span v-if="!isOpen" class="product-info__toggle-text">
          View more
          <IconBaseArrowRight />
        </span>
        <span v-else class="product-info__toggle-text">
          Hide
          <IconBaseArrowTop />
        </span>
      </button>
    </div>

    <div v-if="!mobile" class="product-info__meta">
      <p class="product-info__meta-item">
        <span class="product-info__meta-item--accent">SKU:</span> {{ product.id }}
      </p>
      <p class="product-info__meta-item">
        <span class="product-info__meta-item--accent">Category:</span> {{ product.category }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useCartStore } from '@/stores/useCartStore'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { useNotification } from '@/composables/useNotification'
  import { type Review } from '@/types/Reviews'
  import { type Product } from '@/types/Product'

  import IconMail from '@/components/icons/IconMail.vue'
  import IconFacebook from '@/components/icons/IconFacebook.vue'
  import IconInstagram from '@/components/icons/IconInstagram.vue'
  import IconLikeProduct from '@/components/icons/IconLikeProduct.vue'
  import IconTwitter from '@/components/icons/IconTwitter.vue'
  import IconShare from '@/components/icons/IconShare.vue'
  import IconBaseArrowRight from '@/components/icons/IconBaseArrowRight.vue'
  import IconBaseArrowTop from '@/components/icons/IconBaseArrowTop.vue'
  import StarRating from '@/components/ui/StarRating.vue'
  import BaseButton from '@/components/ui/BaseButton.vue'
  import { TABLET_BREAKPOINT } from '@/constants/breakpoints'

  const props = defineProps<{
    product: Product
  }>()

  const cartStore = useCartStore()
  const { notify } = useNotification()

  const { isBelow: mobile } = useBreakpoint(TABLET_BREAKPOINT)

  const formattedPrice = computed(() => {
    return props.product.price.toFixed(2)
  })

  // Quantity
  const quantity = ref(1)
  const increase = () => quantity.value++
  const decrease = () => (quantity.value = Math.max(1, quantity.value - 1))

  const addToCart = () => {
    cartStore.addToCart(props.product, quantity.value)

    quantity.value = 1

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

  // Share Modal
  const isShareModalOpen = ref(false)

  const toggleShare = () => {
    isShareModalOpen.value = !isShareModalOpen.value
  }

  // Details
  const detailsRef = ref<HTMLDetailsElement | null>(null)
  const isOpen = ref(false)

  function toggleDetails() {
    if (!detailsRef.value) return
    isOpen.value = !isOpen.value
    detailsRef.value.open = isOpen.value
  }

  // Counter Reviews
  const counterReviews = ref(0)

  onMounted(() => {
    const stored = localStorage.getItem(`reviews_${props.product.id}`)
    const reviews = stored ? (JSON.parse(stored) as Review[]) : []
    counterReviews.value = reviews.length
  })

  // Like Product
  const isLiked = ref(false)
  const toggleLike = () => {
    isLiked.value = !isLiked.value
  }
</script>

<style scoped lang="scss">
  .product-info {
    &__title {
      margin: 14px 0 22px;
      font-size: 26px;
      font-weight: 400;
      line-height: 135%;

      @media (max-width: vars.$breakpoints-l) {
        font-size: 20px;
      }

      @media (max-width: vars.$breakpoints-s) {
        margin: 0 0 8px;
      }
    }

    &__price-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 72px;

      @media (min-width: vars.$breakpoints-xl) {
        justify-content: flex-start;
      }

      @media (max-width: vars.$breakpoints-m) {
        margin-bottom: 0;
      }
    }

    &__price {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      line-height: 130%;
      color: vars.$color-accent-light;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 16px;
      }
    }

    &__rating {
      display: flex;
      gap: 24px;

      &-text {
        margin-inline-start: 20px;
        color: vars.$color-gray;
      }
    }

    &__description {
      margin-block-start: 20px;
      line-height: 169%;
      color: vars.$color-gray;
    }

    &__actions {
      display: flex;
      gap: 24px;
      margin-block-start: 48px;

      @media (max-width: vars.$breakpoints-s) {
        margin-block-start: 26px;
      }
    }

    &__quantity {
      @include mixins.flexCenter;

      gap: 5px;
      width: 100px;
      height: 54px;
      color: vars.$color-gray;
      background-color: vars.$color-ligth-gray;
      border-radius: 4px;

      &-button {
        @include mixins.reset-appearance;

        padding: 12px;
        margin: 5px;

        @media (max-width: vars.$breakpoints-l) {
          padding: 8px;
          margin: 3px;
        }
      }
    }

    &__cart-button {
      width: 360px;
      font-weight: 700;
      text-transform: uppercase;
      border-radius: 4px;
      transition: 0.2s ease;

      &:hover {
        color: vars.$color-light;
        background-color: vars.$color-dark;
      }

      @media (max-width: vars.$breakpoints-l) {
        width: 100%;
      }

      @media (max-width: vars.$breakpoints-m) {
        height: 32px;
        font-size: 12px;
      }
    }

    &__interaction {
      position: relative;
      display: flex;
      gap: 40px;
      margin-block-start: 80px;
      cursor: pointer;

      &-like {
        @include mixins.reset-appearance;

        color: #707070;
        transition: color 0.1s ease;

        &.liked {
          color: vars.$color-accent-red;
        }
      }
    }

    &__divider {
      width: 2px;
      background-color: vars.$color-ligth-gray;
    }

    &__share {
      display: flex;
      gap: 20px;

      &-mobile {
        &-button {
          @include mixins.reset-appearance;
        }
      }
    }

    &__expandable {
      margin-block-start: 20px;
    }

    &__summary {
      position: relative;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      font-size: 0.95rem;
      font-size: 14px;
      line-height: 1.4;
      color: vars.$color-gray;
      white-space: normal;
      cursor: pointer;
      -webkit-box-orient: vertical;

      @media (max-width: vars.$breakpoints-s) {
        font-size: 12px;
      }
    }

    &__toggle-button {
      @include mixins.reset-appearance;

      margin-block-start: 12px;
      font-size: 14px;
      color: vars.$color-accent-light;

      @media (max-width: vars.$breakpoints-s) {
        margin-block-start: 8px;
        font-size: 12px;
      }
    }

    &__toggle-text {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    &__meta {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-block-start: 38px;

      &-item {
        margin: 0;
        font-weight: 400;
        color: vars.$color-gray;

        @media (max-width: vars.$breakpoints-m) {
          font-size: 14px;
        }

        &--accent {
          color: vars.$color-dark;
        }
      }
    }
  }

  .product-info__expandable[open] .product-info__summary {
    display: block;
    overflow: visible;
    text-overflow: initial;
    -webkit-line-clamp: unset;
    -webkit-box-orient: initial;
  }
</style>
