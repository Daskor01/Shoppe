import { useRoute, useRouter } from 'vue-router'
import { type Filters } from '@/types/Filters'
import { useProductsStore } from '@/stores/useProductsStore'
import { ref, watch, computed, type Ref } from 'vue'
import { useAsyncData } from 'nuxt/app'
import { type LocationQueryRaw } from 'vue-router'

export default function useShopFilters(filters: Ref<Filters>) {
  const route = useRoute()
  const router = useRouter()
  const store = useProductsStore()
  const categories = ref<string[]>(['jewelery', 'electronics', 'clothing'])

  const { pending, error } = useAsyncData(
    'products-data',
    async () => {
      const cat = (route.query.category as string) || ''

      if (cat) {
        await store.fetchProductsByCategory(cat)
      } else {
        await store.fetchAllProducts()
      }
      return true
    },
    {
      watch: [() => route.query.category],
    },
  )

  function updateQuery() {
    const query: LocationQueryRaw = {
      search: filters.value.search || undefined,
      category: filters.value.category || undefined,
      sortBy: filters.value.sortBy || undefined,
      onSale: filters.value.onSale ? 'true' : undefined,
      inStock: filters.value.inStock ? 'true' : undefined,
      priceRange: filters.value.priceRange.join(','),
    }

    Object.keys(query).forEach((key) => {
      if (query[key] === undefined) {
        delete query[key]
      }
    })

    router.replace({ query })
  }

  const filteredProducts = computed(() => {
    let products = [...store.products]

    if (filters.value.search) {
      products = products.filter((p) =>
        p.title.toLowerCase().includes(filters.value.search.toLowerCase()),
      )
    }

    products = products.filter(
      (p) => p.price >= filters.value.priceRange[0] && p.price <= filters.value.priceRange[1],
    )

    if (filters.value.sortBy === 'price-asc') products.sort((a, b) => a.price - b.price)
    if (filters.value.sortBy === 'price-desc') products.sort((a, b) => b.price - a.price)

    return products
  })

  watch(
    filters,
    () => {
      updateQuery()
    },
    { deep: true },
  )

  return {
    categories,
    filteredProducts,
    pending,
    error,
  }
}
