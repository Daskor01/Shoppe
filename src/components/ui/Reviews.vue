<template>
  <div class="reviews">
    <div v-if="reviews.length" class="reviews__list">
      <h3 class="reviews__title">{{ reviews.length }} Reviews for {{ productTitle }}</h3>
      <ReviewItem
        v-for="(review, index) in reviews"
        :key="index"
        :review="review"
        class="reviews__item"
      />
    </div>
    <p v-else class="reviews__empty">There are no reviews yet. Be the first!</p>

    <ReviewForm
      v-model:reviews="reviews"
      :product-id="productId"
      :product-title="productTitle"
      class="reviews__form"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import type { Review } from '@/types/Reviews'
  import ReviewForm from '@/components/ui/ReviewForm.vue'
  import ReviewItem from '@/components/ui/ReviewItem.vue'

  const props = defineProps<{
    productId: number | string
    productTitle: string
  }>()

  const reviews = ref<Review[]>([])

  const loadReviews = () => {
    const stored = localStorage.getItem(`reviews_${props.productId}`)
    reviews.value = stored ? JSON.parse(stored) : []
  }

  const saveReviews = () => {
    localStorage.setItem(`reviews_${props.productId}`, JSON.stringify(reviews.value))
  }

  watch(
    reviews,
    () => {
      saveReviews()
    },
    { deep: true },
  )

  onMounted(() => {
    loadReviews()
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
