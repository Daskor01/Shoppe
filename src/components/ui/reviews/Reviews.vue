<template>
  <div class="reviews">
    <div
      v-if="reviews.length"
      class="reviews__list"
      role="region"
      aria-labelledby="reviews-heading"
    >
      <h3 id="reviews-heading" class="reviews__title">
        {{ reviews.length }} {{ reviews.length === 1 ? 'Review' : 'Reviews' }} for
        {{ productTitle }}
      </h3>

      <ReviewItem
        v-for="review in reviews"
        :key="review.id"
        :review="review"
        class="reviews__item"
      />
    </div>

    <p v-else class="reviews__empty" role="status">There are no reviews yet. Be the first!</p>

    <ReviewForm
      :product-id="productId"
      :product-title="productTitle"
      class="reviews__form"
      @add-review="handleAddReview"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import type { Review } from '@/types/Reviews'
  import ReviewForm from '@/components/ui/reviews/ReviewForm.vue'
  import ReviewItem from '@/components/ui/reviews/ReviewItem.vue'

  const props = defineProps<{
    productId: number | string
    productTitle: string
  }>()

  const reviews = ref<Review[]>([])
  const storageKey = computed(() => `reviews_${props.productId}`)

  const loadReviews = () => {
    if (!import.meta.client) return
    const stored = localStorage.getItem(storageKey.value)
    reviews.value = stored ? JSON.parse(stored) : []
  }

  const saveReviews = (data: Review[]) => {
    if (!import.meta.client) return
    localStorage.setItem(storageKey.value, JSON.stringify(data))
  }

  const handleAddReview = (newReview: Review) => {
    const isDuplicate = reviews.value.some((r) => r.email === newReview.email)
    if (isDuplicate) return

    reviews.value = [newReview, ...reviews.value]
    saveReviews(reviews.value)
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === storageKey.value) {
      loadReviews()
    }
  }

  onMounted(() => {
    loadReviews()
    window.addEventListener('storage', handleStorageChange)
  })

  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange)
  })
</script>

<style scoped lang="scss">
  .reviews {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;

    @media (max-width: vars.$breakpoints-l) {
      flex-direction: column;
    }

    @media (max-width: vars.$breakpoints-m) {
      display: grid;
      grid-template-areas:
        'reviews-form'
        'reviews-item';
    }

    @media (max-width: vars.$breakpoints-s) {
      margin-top: 0;
    }

    &__list {
      flex: 1;
    }

    &__title {
      margin-bottom: 1rem;
      font-size: 20px;
      font-weight: 400;
      line-height: 130%;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 16px;
      }
    }

    &__item {
      @media (max-width: vars.$breakpoints-m) {
        grid-area: reviews-item;
      }
    }

    &__form {
      @media (max-width: vars.$breakpoints-m) {
        grid-area: reviews-form;
      }
    }

    &__empty {
      flex: 1;
      font-style: italic;
      color: vars.$color-gray;
    }
  }
</style>
