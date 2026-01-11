<template>
  <div class="review-item">
    <div class="review-item__header">
      <span class="review-item__name">{{ review.name }}</span>
      <span class="review-item__date">{{ review.date }}</span>
    </div>

    <div class="review-item__rating-wrapper">
      <span class="visually-hidden">Rating: {{ review.rating }} out of 5</span>
      <StarRating 
        :model-value="review.rating ?? 0" 
        readonly 
        aria-hidden="true"
        class="review-item__rating" 
      />
    </div>

    <p class="review-item__message">
      {{ review.message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Review } from '@/types/Reviews'
import StarRating from '@/components/ui/base/BaseStarRating.vue'

defineProps<{
  review: Review
}>()
</script>

<style scoped lang="scss">
  .review-item {
    padding: 0.5rem 0;
    border-bottom: 1px solid vars.$color-ligth-gray;

    &__rating-wrapper {
      display: flex;
      align-items: center;
    }

    &__header {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    &__name {
      font-size: 20px;
      font-weight: 400;
      line-height: 130%;
      color: vars.$color-dark;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 14px;
      }
    }

    &__date {
      font-size: 14px;
      font-weight: 400;
      line-height: 157%;
      color: vars.$color-gray;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 12px;
      }
    }

    &__rating {
      margin-bottom: 0.5rem;
    }

    &__message {
      font-size: 16px;
      font-weight: 400;
      line-height: 169%;
      color: vars.$color-dark;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 12px;
      }
    }
  }
</style>
