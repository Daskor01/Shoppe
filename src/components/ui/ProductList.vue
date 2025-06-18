<template>
  <section class="latest-products">
    <div class="latest-products__header">
      <h2 class="latest-products__title">Shop The Latest</h2>
      <NuxtLink to="/Shop" class="latest-products__link">View All</NuxtLink>
    </div>
    <div class="latest-products__grid">
      <ProductCard
        v-for="item in store.products.slice(0, 6)"
        :key="item.id"
        :product="item"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useProductsStore } from "@/stores/useProductsStore";
import ProductCard from "@/components/ui/ProductCard.vue";

const store = useProductsStore();

onMounted(() => {
  store.fetchAllProducts();
});
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
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: auto;
    justify-self: center;
    gap: clamp(1rem, 0.2679rem + 3.6607vw, 3.5625rem);
  }

  @media (max-width: $breakpoints-xl) {
    &__link {
      font-size: 15px;
    }

    &__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
