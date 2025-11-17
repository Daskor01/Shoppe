<template>
  <section class="shop">
    <div v-if="isMobile" class="mobile__container">
      <SearchInput />
      <h1 class="mobile__title">Shop</h1>
      <button class="filter-toggle" @click="showFilters = !showFilters">
        <IconFilter />
        Filters
      </button>
    </div>

    <div v-else class="filter-container">
      <div class="filter-desktop">
        <h2 class="filter-desktop__title">Shop The Latest</h2>
        <ShopFilters v-model:filters="filters" :categories="categories" />
      </div>
    </div>

    <SlidePanel v-model="showFilters">
      <h2 class="filter-mobile__title">Filters</h2>
      <ShopFilters v-model:filters="filters" :categories="categories" />
    </SlidePanel>

    <div class="product-grid">
      <ProductCard
        v-for="product in paginatedItems"
        :key="product.id"
        :product="product"
        class="product-grid__item"
      />
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        class="product-grid__pagination"
        @update:page="goToPage"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import ProductCard from '@/components/ui/ProductCard.vue'
  import ShopFilters from '@/components/ui/ShopFilters.vue'
  import SlidePanel from '@/components/ui/SlidePanel.vue'
  import SearchInput from '@/components/ui/SearchInput.vue'
  import useShopFilters from '@/composables/useShopFilters'
  import type { Filters } from '@/types/Filters'
  import { usePagination } from '@/composables/usePagination'
  import { useBreakpoint } from '@/composables/useBreakpoint'

  const route = useRoute()
  const query = route.query

  const filters = ref<Filters>({
    search: '',
    category: '',
    sortBy: '',
    priceRange: [0, 200],
    onSale: false,
    inStock: false,
  })

  const { filteredProducts, categories } = useShopFilters(filters)

  //Инициализируем фильтры из query-параметров при загрузке страницы
  const initialFilters: Partial<Filters> = Object.fromEntries(
    Object.entries(query).map(([key, value]) => {
      if (!value) return [key, '']
      switch (key) {
        case 'priceRange':
          return [key, (value as string).split(',').map(Number)]
        case 'onSale':
        case 'inStock':
          return [key, value === 'true']
        default:
          return [key, value]
      }
    }),
  )

  filters.value = {
    ...filters.value,
    ...initialFilters,
  }

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(
    () => filteredProducts.value,
    6,
  )

  //Адаптация под мобильные
  const showFilters = ref(false)

  const { isBelow: isMobile } = useBreakpoint(991.5)
</script>

<style scoped lang="scss">
  .shop {
    position: relative;
    display: flex;
    gap: 28px;
    justify-content: space-between;
    margin-block-start: 78px;

    @media (max-width: vars.$breakpoints-m) {
      flex-direction: column;
    }
  }

  .mobile__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-self: start;
    inline-size: 100%;
  }

  .filter {
    &-toggle {
      display: flex;
      gap: 8px;
      align-items: center;
      align-self: self-start;
      color: vars.$color-accent-light;
      cursor: pointer;
      background: transparent;
      border: none;
    }

    &-mobile__title {
      font-family: vars.$secondary-font;
      font-size: 20px;
      font-weight: 400;
      line-height: 130%;
    }

    &-desktop {
      position: sticky;
      inset-block-start: 3rem;

      &__title {
        font-size: 32px;
        font-weight: 500;
        line-height: 130%;
      }
    }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    width: 100%;
    margin-block-start: 106px;
    margin-inline: -10px;

    @media (max-width: vars.$breakpoints-xxl) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: vars.$breakpoints-xl) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: vars.$breakpoints-m) {
      margin-block-start: 40px;
    }

    &__item {
      justify-self: center;

      & * {
        inline-size: 300px;

        @media (max-width: vars.$breakpoints-l) {
          inline-size: 260px;
        }

        @media (max-width: vars.$breakpoints-s) {
          inline-size: 200px;
        }

        @media (width <= 450px) {
          inline-size: 160px;
        }

        @media (max-width: vars.$breakpoints-xs) {
          inline-size: 136px;
        }
      }
    }

    &__pagination {
      grid-column: 1 / -1;
      justify-self: center;
      margin-block-start: 2rem;
    }
  }
</style>
