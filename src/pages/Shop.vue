<template>
  <main class="shop" aria-labelledby="shop-title">
    <h1 id="shop-title" class="visually-hidden">Product Catalog</h1>

    <header v-if="isMobile" class="mobile__container">
      <BaseSearchInput label="Search products" />
      <p class="mobile__title" aria-hidden="true">Shop</p>
      <button
        class="filter-toggle"
        :aria-expanded="showFilters"
        aria-controls="filter-panel"
        @click="showFilters = !showFilters"
      >
        <IconFilter aria-hidden="true" />
        <span>Filters</span>
      </button>
    </header>

    <aside v-else class="filter-container" aria-label="Product filters">
      <div class="filter-desktop">
        <h2 class="filter-desktop__title">Shop The Latest</h2>
        <ShopFilters v-model:filters="filters" :categories="categories" />
      </div>
    </aside>

    <BaseSlidePanel
      id="filter-panel"
      v-model="showFilters"
      role="dialog"
      aria-label="Filter selection"
    >
      <h2 class="filter-mobile__title">Filters</h2>
      <ShopFilters v-model:filters="filters" :categories="categories" />
    </BaseSlidePanel>

    <section class="product-content" aria-live="polite" :aria-busy="pending">
      <div v-if="pending" class="product-grid__status">
        <BaseLoader label="Loading products..." />
      </div>

      <div v-else-if="paginatedItems.length === 0" class="product-grid__empty">
        <p>No products found matching your criteria.</p>
        <button class="product-grid__empty--button" @click="clearFilter">Clear all filters</button>
      </div>

      <div v-else class="product-grid">
        <ProductCard
          v-for="product in paginatedItems"
          :key="product.id"
          :product="product"
          class="product-grid__item"
          tag="article"
        />

        <nav class="product-grid__pagination" aria-label="Pagination">
          <BasePagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @update:page="goToPage"
          />
        </nav>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useHead } from 'nuxt/app'
  import ProductCard from '@/components/ui/product/ProductCard.vue'
  import ShopFilters from '@/components/ui/shop/ShopFilters.vue'
  import BaseSlidePanel from '@/components/ui/base/BaseSlidePanel.vue'
  import BaseSearchInput from '@/components/ui/base/BaseSearchInput.vue'
  import BasePagination from '@/components/ui/base/BasePagination.vue'
  import useShopFilters from '@/composables/useShopFilters'
  import type { Filters } from '@/types/Filters'
  import { usePagination } from '@/composables/usePagination'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { TABLET_BREAKPOINT } from '@/constants/breakpoints'

  useHead({
    title: 'Shop - Browse Products',
    meta: [
      {
        name: 'description',
        content:
          'Browse our exclusive collection of products. Filter by category, price, and availability.',
      },
    ],
  })

  const route = useRoute()

  const filters = ref<Filters>({
    search: (route.query.search as string) || '',
    category: (route.query.category as string) || '',
    sortBy: (route.query.sortBy as string) || '',
    priceRange: route.query.priceRange
      ? ((route.query.priceRange as string).split(',').map(Number) as [number, number])
      : [0, 200],
    onSale: route.query.onSale === 'true',
    inStock: route.query.inStock === 'true',
  })

  const { filteredProducts, categories, pending } = useShopFilters(filters)

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(
    () => filteredProducts.value,
    6,
  )

  function clearFilter() {
    filters.value = {
      search: '',
      category: '',
      sortBy: '',
      priceRange: [0, 200],
      onSale: false,
      inStock: false,
    }
  }

  const showFilters = ref(false)

  const { isBelow: isMobile } = useBreakpoint(TABLET_BREAKPOINT)
</script>

<style scoped lang="scss">
  .shop {
    position: relative;
    display: flex;
    gap: 20px;

    @media (max-width: vars.$breakpoints-m) {
      flex-direction: column;
      margin-block-start: 30px;
    }
  }

  .mobile {
    &__container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-self: start;
      inline-size: 100%;
    }

    &__title {
      font-size: 20px;
    }
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

  .product-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 26px;
    width: 100%;
    margin-block-start: 100px;

    @media (max-width: vars.$breakpoints-xxl) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: vars.$breakpoints-xl) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: vars.$breakpoints-m) {
      margin-block-start: 40px;
      gap: 16px;
    }

    &__item {
      justify-self: center;
      inline-size: 300px;

      @media (min-width: vars.$breakpoints-xxl) {
        inline-size: 340px;
      }

      @media (max-width: vars.$breakpoints-l) {
        inline-size: 260px;
      }

      @media (max-width: vars.$breakpoints-m) {
        inline-size: 300px;
      }

      @media (max-width: vars.$breakpoints-s) {
        inline-size: 240px;
      }

      @media (max-width: 560px) {
        inline-size: 160px;
      }

      @media (max-width: vars.$breakpoints-xs) {
        inline-size: 136px;
      }
    }

    &__empty {
      font-size: 18px;
      font-weight: 500;
      color: vars.$color-gray;
      text-align: center;

      &--button {
        padding: 10px 20px;
        margin-block-start: 16px;
        font-size: 16px;
        color: vars.$color-light;
        cursor: pointer;
        background-color: vars.$color-dark;
        border: none;
        border-radius: 4px;
        transition: all 0.4s;

        &:hover {
          opacity: 0.5;
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
