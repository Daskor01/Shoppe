<template>
  <div class="pagination">
    <button :disabled="currentPage === 1" class="pagination__button" @click="prevPage">
      <IconBaseArrowLeft />
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      :class="{ active: currentPage === page }"
      class="pagination__button"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>

    <button :disabled="currentPage === totalPages" class="pagination__button" @click="nextPage">
      <IconBaseArrowRigth />
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import IconBaseArrowRigth from '@/components/icons/IconBaseArrowRigth.vue'
  import IconBaseArrowLeft from '@/components/icons/IconBaseArrowLeft.vue'

  const props = defineProps<{
    currentPage: number
    totalPages: number
  }>()

  const emit = defineEmits<{
    (e: 'update:page', page: number): void
  }>()

  function goToPage(page: number) {
    if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
      emit('update:page', page)
    }
  }

  function nextPage() {
    if (props.currentPage < props.totalPages) {
      emit('update:page', props.currentPage + 1)
    }
  }

  function prevPage() {
    if (props.currentPage > 1) {
      emit('update:page', props.currentPage - 1)
    }
  }

  const visiblePages = computed(() => {
    const pages: number[] = []

    //Добавляем текущую страницу
    pages.push(props.currentPage)

    //Добавляем следующую страницу, если она в пределах
    if (props.currentPage + 1 <= props.totalPages) {
      pages.push(props.currentPage + 1)
    } else if (props.currentPage > 1) {
      //Если следующей страницы нет, но есть предыдущая — показываем её
      pages.unshift(props.currentPage - 1)
    }
    return pages
  })
</script>

<style scoped lang="scss">
  .pagination {
    display: flex;
    gap: 6px;
    align-items: center;

    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      inline-size: 44px;
      block-size: 44px;
      border: 1px solid $color-ligth-gray;
      background: white;
      cursor: pointer;
      border-radius: 4px;
      font-size: 1rem;
      transition: 0.2s ease;
    }

    &__button.active {
      background: $color-dark;
      color: white;
      font-weight: bold;
    }

    &__button:disabled {
      pointer-events: none;
      opacity: 0;
    }
  }
</style>
