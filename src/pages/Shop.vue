<template>
  <section class="shop">

    <div class="mobile__container" v-if="isMobile">
      <SearchInput />
      <h1 class="mobile__title">Shop</h1>
      <button  class="filter-toggle"
      @click="showFilters = !showFilters"
    >
      <IconFilter />
      Filters
    </button>
    </div>

    <SlidePanel v-model="showFilters">
      <h2 class="filter-mobile__title">Filters</h2>
      <ShopFilters v-model:filters="filters" />
    </SlidePanel>

    <div class="filter-container">
      <div class="filter-desktop" v-if="!isMobile">
        <h2>Shop The Latest</h2>
        <ShopFilters v-model:filters="filters" />
      </div>
    </div>

    <div class="product-grid">
      <ProductCard
        v-for="product in visibleProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useProductsStore } from '@/stores/useProductsStore'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/ui/ProductCard.vue'
import ShopFilters from '@/components/ui/ShopFilters.vue'
import SlidePanel from '@/components/ui/SlidePanel.vue'
import SearchInput from '@/components/ui/SearchInput.vue'

const store = useProductsStore()
const route = useRoute()
const router = useRouter()

//Реактивные фильтры
const filters = ref({
  search: '',
  category: '',
  sortBy: '',
  priceRange: [0, 200],
  onSale: false,
  inStock: false
})

//При монтировании читаем query из URL и загружаем товары
onMounted(() => {
  syncFiltersWithRoute()
})

//Функция для синхронизации query → filters
function syncFiltersWithRoute() {
  const query = route.query

  filters.value = {
    search: (query.search as string) || '',
    category: (query.category as string) || '',
    sortBy: (query.sortBy as string) || '',
    priceRange: query.priceRange
      ? (query.priceRange as string).split(',').map(Number) as [number, number]
      : [0, 200],
    onSale: query.onSale === 'true',
    inStock: query.inStock === 'true',
  }

  loadProducts()
}

//Загружаем продукты в зависимости от выбранной категории
async function loadProducts() {
  if (filters.value.category) {
    await store.fetchProductsByCategory(filters.value.category)
  } else {
    await store.fetchAllProducts()
  }
}

//Следим за изменениями фильтров и пушим в URL query
watch(filters, (newFilters) => {
  const query: Record<string, any> = {
    search: newFilters.search || undefined,
    category: newFilters.category || undefined,
    sortBy: newFilters.sortBy || undefined,
    priceRange: newFilters.priceRange.join(','),
    onSale: newFilters.onSale ? 'true' : undefined,
    inStock: newFilters.inStock ? 'true' : undefined,
  }

  router.replace({ query })

  loadProducts() 
}, { deep: true })

//Фильтрация товаров на клиенте
const filteredProducts = computed(() => {
  let products = store.products

  if (filters.value.search) {
    products = products.filter(product =>
      product.title.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  products = products.filter(product =>
    product.price >= filters.value.priceRange[0] &&
    product.price <= filters.value.priceRange[1]
  )

  if (filters.value.onSale) {
    products = products.filter(product => product.onSale === true)
  }

  if (filters.value.inStock) {
    products = products.filter(product => product.stock > 0)
  }

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

//Показываем только 9 товаров
const visibleProducts = computed(() => filteredProducts.value.slice(0, 9))

//Адаптация под мобильные
const isMobile = ref(false)
const showFilters = ref(false)

function handleResize() {
  isMobile.value = window.innerWidth < 1441
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>


<style scoped lang="scss">

.shop {
  display: flex;
  gap: 35px;
  position: relative;

  @media (max-width: $breakpoints-xxl) {
    justify-content: space-between;
  }

  @media (max-width: $breakpoints-xl) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
}

.mobile__container {
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-self: start;
}

.filter {
  &-toggle {
    display: flex;
    background: transparent;
    border: none;
    color: $color-accent-light;
    align-items: center;
    gap: 8px;
    align-self: self-start;
  }

  &-mobile__title {
    font-family: $secondary-font;
    font-size: 25px;
    line-height: 162%;
  }

  &-desktop {
    position: sticky;
    inset-block-start: 3rem;
  }
}


.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 2rem;
  margin-block-start: 5rem;

  @media (max-width: $breakpoints-xxl) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $breakpoints-xl) {
    margin-block-start: 1.5rem;  }
}
</style>
