import { useRoute, useRouter } from 'vue-router'
import { type Filters } from '@/types/Filters'
import { useProductsStore } from '@/stores/useProductsStore'
import { ref, watch, computed, onMounted, type Ref } from 'vue'

export default function useShopFilters(filters: Ref<Filters>) {
  const route = useRoute()
  const router = useRouter()
  const store = useProductsStore()
  const categories = ref<string[]>(['jewelery', 'electronics', 'clothing'])

  function initFromQuery() {
    const query = route.query

    const rawPriceRange = query.priceRange as string
    const parsedPriceRange: [number, number] = rawPriceRange
      ? (rawPriceRange.split(',').map(Number) as [number, number])
      : [0, 200]

    filters.value = {
      search: (query.search as string) || '',
      category: (query.category as string) || '',
      sortBy: (query.sortBy as string) || '',
      priceRange: parsedPriceRange,
      onSale: query.onSale === 'true',
      inStock: query.inStock === 'true',
    }
  }

  async function fetchProducts() {
    if (filters.value.category) {
      if (store.currentCategory !== filters.value.category) {
        await store.fetchProductsByCategory(filters.value.category)
      }
    } else {
      if (store.currentCategory !== '') {
        await store.fetchAllProducts()
      }
    }
  }

  function updateQuery() {
    const query: Record<string, string | number> = {}

    if (filters.value.search) query.search = filters.value.search
    if (filters.value.category) query.category = filters.value.category
    if (filters.value.sortBy) query.sortBy = filters.value.sortBy
    query.priceRange = filters.value.priceRange.join(',')
    if (filters.value.onSale) query.onSale = 'true'
    if (filters.value.inStock) query.inStock = 'true'

    router.replace({ query })
  }

  const filteredProducts = computed(() => {
    let products = store.products

    if (filters.value.search) {
      products = products.filter((product) =>
        product.title.toLowerCase().includes(filters.value.search.toLowerCase()),
      )
    }

    products = products.filter(
      (product) =>
        product.price >= filters.value.priceRange[0] &&
        product.price <= filters.value.priceRange[1],
    )

    switch (filters.value.sortBy) {
      case 'price-asc':
        products = products.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        products = products.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        products = products.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return products
  })

  onMounted(async () => {
    initFromQuery()
    await fetchProducts()
  })

  watch(
    filters,
    () => {
      updateQuery()
      fetchProducts()
    },
    { deep: true },
  )

  return {
    categories,
    filteredProducts,
  }
}
