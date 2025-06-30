<template>
  <section class="latest-products">
    <div class="latest-products__header">
      <h2 class="latest-products__title">Shop The Latest</h2>
      <NuxtLink to="/Shop" class="latest-products__link">View All</NuxtLink>
    </div>
    <div class="latest-products__grid">
      <ProductCard
        v-for="item in visibleProducts"
        :key="item.id"
        :product="item"
        class="latest-products__grid-item"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useProductsStore } from '@/stores/useProductsStore'
  import ProductCard from '@/components/ui/ProductCard.vue'

  const productStore = useProductsStore()

  //Показываем нужное количество товаров
  const visibleProducts = computed(() => productStore.products.slice(0, 6))

  onMounted(() => {
    productStore.fetchAllProducts()
  })
</script>

<style scoped lang="scss">
  .latest-products {
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-block-start: 2rem;
    }

    &__title {
      font-size: clamp(1rem, 0.6964rem + 1.5179vw, 2.0625rem);
    }

    &__link {
      color: $color-accent-light;
      text-decoration: none;
      transition: 0.4s;
      font-size: 20px;

      &:hover {
        opacity: 0.5;
      }

      @media (max-width: $breakpoints-xl) {
        font-size: 15px;
      }
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: auto;
      gap: clamp(20px, 4vw, 100px);

      &-item {
        justify-self: center;
      }

      @media (max-width: $breakpoints-xl) {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
</style>
