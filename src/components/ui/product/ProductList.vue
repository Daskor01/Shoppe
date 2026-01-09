<template>
  <section class="latest-products">
    <div class="latest-products__header">
      <h2 class="latest-products__title">Shop The Latest</h2>
      <NuxtLink 
        to="/Shop" 
        class="latest-products__link"
        aria-label="View all latest products"
      >
        View All
      </NuxtLink>
    </div>

    <div class="latest-products__grid" :aria-busy="status === 'pending'">
      <template v-if="showSkeleton">
        <div 
          v-for="i in 6" 
          :key="`skeleton-${i}`" 
          class="latest-products__skeleton-card"
        >
          <div class="skeleton-image"></div>
          <div class="skeleton-text title"></div>
          <div class="skeleton-text price"></div>
        </div>
      </template>

      <template v-else>
        <ProductCard
          v-for="item in visibleProducts"
          :key="item.id"
          :product="item"
          class="latest-products__grid-item"
        />
      </template>
      
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useProductsStore } from '@/stores/useProductsStore'
  import ProductCard from '@/components/ui/product/ProductCard.vue'

  const productStore = useProductsStore()

  const { status } = await useAsyncData(
    'latest-products', 
    () => productStore.fetchAllProducts()
  )

  const visibleProducts = computed(() => {
    return productStore.products ? productStore.products.slice(0, 6) : []
  })

  const showSkeleton = computed(() => {
    return status.value === 'pending' && visibleProducts.value.length === 0
  })
</script>

<style scoped lang="scss">
.latest-products {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block-start: 2rem;
    margin-block-end: 1rem;
  }

  &__title {
    font-size: clamp(1rem, 0.6964rem + 1.5179vw, 2.0625rem);
    margin: 0;
  }

  &__link {
    font-size: 20px;
    color: vars.$color-accent-light;
    text-decoration: none;
    transition: opacity 0.4s;

    &:hover {
      opacity: 0.5;
    }

    @media (max-width: vars.$breakpoints-xl) {
      font-size: 15px;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 50px;
    row-gap: 86px;
    margin-block-start: 20px;

    @media (max-width: vars.$breakpoints-l) {
      column-gap: 20px;
      row-gap: 40px;
    }

    @media (max-width: vars.$breakpoints-m) {
      grid-template-columns: repeat(2, 1fr);
    }

    &-item, &__skeleton-card {
      width: 100%;
      max-width: 380px; 
      justify-self: center;
    }
  }

  &__skeleton-card {
    display: flex;
    flex-direction: column;
  }


  .skeleton-image {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 10px;
    margin-bottom: 15px;
    @include shimmer.shimmer-effect;
  }

  .skeleton-text {
    height: 20px;
    margin-bottom: 8px;
    @include shimmer.shimmer-effect;

    &.title {
      width: 80%;
    }
    &.price {
      width: 30%;
    }
  }
}

</style>