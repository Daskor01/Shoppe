<template>
  <nav class="pagination" role="navigation" aria-label="Pagination">
    <button
      class="pagination__button"
      :disabled="currentPage === 1"
      aria-label="Go to previous page"
      type="button"
      @click="prevPage"
    >
      <IconBaseArrowLeft aria-hidden="true" />
    </button>

    <ul class="pagination__list">
      <li v-for="page in pageRange" :key="page === '...' ? `dots-${Math.random()}` : page">
        <template v-if="page === '...'">
          <span class="pagination__dots" aria-hidden="true">{{ page }}</span>
        </template>

        <button
          v-else
          class="pagination__button"
          :class="{ 'pagination__button--active': currentPage === page }"
          :aria-current="currentPage === page ? 'page' : undefined"
          :aria-label="`Go to page ${page}`"
          type="button"
          @click="goToPage(page as number)"
        >
          {{ page }}
        </button>
      </li>
    </ul>

    <button
      class="pagination__button"
      :disabled="currentPage === totalPages"
      aria-label="Go to next page"
      type="button"
      @click="nextPage"
    >
      <IconBaseArrowRight aria-hidden="true" />
    </button>
  </nav>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import IconBaseArrowRight from '@/components/icons/IconBaseArrowRight.vue'
  import IconBaseArrowLeft from '@/components/icons/IconBaseArrowLeft.vue'

  const props = defineProps<{
    currentPage: number
    totalPages: number
    siblingCount?: number
  }>()

  const emit = defineEmits<{
    (e: 'update:page', page: number): void
  }>()

  const siblingCount = props.siblingCount ?? 1

  const pageRange = computed(() => {
    const totalPageNumbers = siblingCount + 5

    if (totalPageNumbers >= props.totalPages) {
      return Array.from({ length: props.totalPages }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(props.currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(props.currentPage + siblingCount, props.totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < props.totalPages - 2

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
      return [...leftRange, '...', props.totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => props.totalPages - i + 1,
      ).reverse()
      return [1, '...', ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      )
      return [1, '...', ...middleRange, '...', props.totalPages]
    }

    return []
  })

  function goToPage(page: number) {
    if (page !== props.currentPage) {
      emit('update:page', page)
    }
  }

  const nextPage = () =>
    props.currentPage < props.totalPages && emit('update:page', props.currentPage + 1)
  const prevPage = () => props.currentPage > 1 && emit('update:page', props.currentPage - 1)
</script>

<style scoped lang="scss">
  .pagination {
    display: flex;
    gap: 6px;
    align-items: center;

    &__list {
      display: flex;
      gap: 6px;
      padding: 0;
      margin: 0;
      list-style: none;
    }

    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      inline-size: 44px;
      block-size: 44px;
      font-size: 1rem;
      cursor: pointer;
      background: white;
      border: 1px solid vars.$color-ligth-gray;
      border-radius: 4px;
      transition: all 0.2s ease;

      @media(max-width: vars.$breakpoints-m) {
        inline-size: 36px;
        block-size: 36px;
        font-size: 0.875rem;
      }

      
      &:focus-visible {
        outline: 2px solid vars.$color-dark;
        outline-offset: 2px;
      }
      
      &--active {
        font-weight: bold;
        color: vars.$color-light;
        cursor: default;
        background: vars.$color-dark;
        border-color: vars.$color-dark;
      }
      
      &:disabled {
        cursor: not-allowed;
        opacity: 0.3;
      }
      
      &:hover:not(:disabled) {
        border-color: vars.$color-dark;
      }
    }

    &__dots {
      display: flex;
      align-items: center;
      justify-content: center;
      inline-size: 44px;
      block-size: 44px;
      color: vars.$color-gray;
    }
  }
</style>
