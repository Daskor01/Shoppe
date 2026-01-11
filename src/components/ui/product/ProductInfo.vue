<template>
  <article class="product-info">
    <h1 class="product-info__title">{{ product.title }}</h1>

    <div class="product-info__price-wrapper">
      <p class="product-info__price" aria-label="Price">${{ formattedPrice }}</p>

      <div v-if="mobile" class="product-info__share-mobile">
        <button
          class="product-info__share-mobile-button"
          aria-label="Share product"
          type="button"
          @click="toggleShare"
        >
          <IconShare aria-hidden="true" />
        </button>
        <BaseShareModal :is-open="isShareModalOpen" @close="isShareModalOpen = false" />
      </div>
    </div>

    <template v-if="!mobile">
      <div class="product-info__rating" aria-label="Product rating">
        <BaseStarRating
          :modelValue="Math.round(product.rating?.rate || 0)"
          class="product-info__rating-star"
          readonly
        />
        <span class="product-info__rating-text">
          {{ counterReviews }} customer {{ counterReviews === 1 ? 'review' : 'reviews' }}
        </span>
      </div>

      <p class="product-info__description">
        {{ product.description }}
      </p>
    </template>

    <div class="product-info__actions">
      <div v-if="!mobile" class="product-info__quantity" role="group" aria-label="Select quantity">
        <button
          class="product-info__quantity-button"
          aria-label="Decrease quantity"
          type="button"
          @click="decrease"
        >
          -
        </button>
        <span class="product-info__quantity-value" aria-live="polite">{{ quantity }}</span>
        <button
          class="product-info__quantity-button"
          aria-label="Increase quantity"
          type="button"
          @click="increase"
        >
          +
        </button>
      </div>

      <BaseButton
        class="product-info__cart-button"
        :aria-label="`Add ${product.title} to cart`"
        @click="addToCart"
      >
        Add to cart
      </BaseButton>
    </div>

    <div v-if="!mobile" class="product-info__interaction" data-test="product-info__interaction">
      <button
        :class="['product-info__interaction-like', { liked: isLiked }]"
        :aria-pressed="isLiked"
        aria-label="Add to favorites"
        type="button"
        @click="toggleLike"
      >
        <IconLikeProduct aria-hidden="true" />
      </button>

      <div class="product-info__divider" role="presentation"></div>

      <div class="product-info__share" aria-label="Share on social media">
        <IconMail class="product-info__share-icon" role="link" aria-label="Share via Email" />
        <IconFacebook class="product-info__share-icon" role="link" aria-label="Share on Facebook" />
        <IconInstagram class="product-info__share-icon" role="link" aria-label="Share on Instagram" />
        <IconTwitter class="product-info__share-icon" role="link" aria-label="Share on Twitter" />
      </div>
    </div>

    <div v-if="mobile" class="product-info__meta-mobile">
      <details ref="detailsRef" class="product-info__expandable" @toggle="onToggle">
        <summary class="product-info__summary">{{ product.description }}</summary>

        <div class="product-info__meta">
          <p class="product-info__meta-item" data-test="product-info__meta-sku">
            <span class="product-info__meta-item--accent">SKU:</span> {{ product.id }}
          </p>
          <p class="product-info__meta-item" data-test="product-info__meta-category">
            <span class="product-info__meta-item--accent">Category:</span>
            {{ product.category }}
          </p>
        </div>
      </details>

      <button class="product-info__toggle-button" type="button" @click="toggleDetails">
        <span class="product-info__toggle-text">
          {{ isOpen ? 'Hide' : 'View more' }}
          <component :is="isOpen ? IconBaseArrowTop : IconBaseArrowRight" aria-hidden="true" />
        </span>
      </button>
    </div>

    <div v-if="!mobile" class="product-info__meta">
      <p class="product-info__meta-item">
        <b class="product-info__meta-item--accent">SKU:</b> {{ product.id }}
      </p>
      <p class="product-info__meta-item">
        <b class="product-info__meta-item--accent">Category:</b> {{ product.category }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useCartStore } from '@/stores/useCartStore'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { useNotification } from '@/composables/useNotification'
  import { type Product } from '@/types/Product'
  import IconBaseArrowTop from '@/components/icons/IconBaseArrowTop.vue'
  import IconBaseArrowRight from '@/components/icons/IconBaseArrowRight.vue'
  import IconLikeProduct from '@/components/icons/IconLikeProduct.vue'
  import IconShare from '@/components/icons/IconShare.vue'
  import IconMail from '@/components/icons/IconMail.vue'
  import IconFacebook from '@/components/icons/IconFacebook.vue'
  import IconInstagram from '@/components/icons/IconInstagram.vue'
  import IconTwitter from '@/components/icons/IconTwitter.vue'
  import BaseStarRating from '@/components/ui/base/BaseStarRating.vue'
  import BaseButton from '@/components/ui/base/BaseButton.vue'

  const props = defineProps<{
    product: Product
  }>()

  const cartStore = useCartStore()
  const { notify } = useNotification()
  const { isBelow: mobile } = useBreakpoint(1120)

  const formattedPrice = computed(() => props.product.price.toFixed(2))

  const quantity = ref(1)
  const increase = () => quantity.value++
  const decrease = () => {
    if (quantity.value > 1) quantity.value--
  }

  const addToCart = () => {
    cartStore.addToCart(props.product, quantity.value)
    const addedCount = quantity.value
    quantity.value = 1

    notify({
      message: `${addedCount} item(s) added to your Shopping bag.`,
      type: 'success',
      button: {
        text: 'View Cart',
        handler: () => cartStore.toggleCart(),
      },
    })
  }

  const isShareModalOpen = ref(false)
  const toggleShare = () => {
    isShareModalOpen.value = !isShareModalOpen.value
  }

  const detailsRef = ref<HTMLDetailsElement | null>(null)
  const isOpen = ref(false)

  const onToggle = (e: Event) => {
    isOpen.value = (e.target as HTMLDetailsElement).open
  }

  function toggleDetails() {
    if (detailsRef.value) {
      detailsRef.value.open = !detailsRef.value.open
    }
  }

  const counterReviews = ref(0)
  onMounted(() => {
    try {
      const stored = localStorage.getItem(`reviews_${props.product.id}`)
      if (stored) {
        const reviews = JSON.parse(stored)
        counterReviews.value = Array.isArray(reviews) ? reviews.length : 0
      }
    } catch (e) {
      console.error('Failed to parse reviews from storage', e)
    }
  })

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
        margin: 16px 0 8px;
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

      @media (max-width: vars.$breakpoints-xl) {
        margin-bottom: 30px;
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

      @media (max-width: vars.$breakpoints-l) {
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

      @media (max-width: vars.$breakpoints-xl) {
        width: 300px;
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

      @media (max-width: vars.$breakpoints-xl) {
        margin-block-start: 40px;
      }

      &-like {
        @include mixins.reset-appearance;
        color: vars.$color-gray;
        transition: color 0.3s ease;

        &:hover {
          color: vars.$color-dark;
        }

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

      &-icon {
        color: vars.$color-gray;
        cursor: pointer;
        transition: color 0.3s ease;

        &:hover {
          color: vars.$color-dark;
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
