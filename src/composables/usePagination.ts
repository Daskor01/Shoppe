import { ref, computed, watch } from 'vue'

export function usePagination<T>(items: () => T[], pageSize = 6) {
  const currentPage = ref(1)

  const totalPages = computed(() => {
    return Math.ceil(items().length / pageSize)
  })

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return items().slice(start, end)
  })

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function nextPage() {
    goToPage(currentPage.value + 1)
  }

  function prevPage() {
    goToPage(currentPage.value - 1)
  }

  watch(items, () => {
    currentPage.value = 1
  })

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
  }
}
