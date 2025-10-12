<template>
  <section class="product" v-if="product">
    <ProductGallery :ProductImages="productImages" class="product__gallery" />

    <ProductInfo :product="product" />

    <BaseTabsAccordion
      :tabs="[
        { label: 'Description', name: 'description' },
        { label: 'Additional Information', name: 'additional' },
        { label: 'Reviews', name: 'reviews' },
      ]"
      class="product__tabs"
    >
      <template #description>
        <p>{{ product.description }}</p>
      </template>

      <template #additional>
        <p><b>Weight:</b> 0.3 kg</p>
        <p><b>Dimentions:</b> 15 x 10 x 1 cm</p>
        <p><b>Colours:</b> Black, Browns, White</p>
        <p><b>Materials:</b> Metal</p>
      </template>

      <template #reviews>
        <Reviews :productId="product.id" :productTitle="product.title" />
      </template>
    </BaseTabsAccordion>
  </section>
  <div v-else class="loading">Loading...</div>

  <div class="product__simular">
    <h2 class="product__simular">Simular Products</h2>
    <div class="product__simular-grid">
      <ProductCard
        v-for="item in visibleProducts"
        :key="item.id"
        :product="item"
        class="product__simular-grid-item"
      />
    </div>
    <div class="product__simular-сontinue">
      <NuxtLink to="/Shop" class="product__simular-link">
        <span>Continue shopping</span>
        <IconBaseArrowRight />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { useProductsStore } from '@/stores/useProductsStore'
  import { computed } from 'vue'
  import { onMounted, ref } from 'vue'
  import { type Product } from '@/types/Product'
  import ProductGallery from '@/components/ui/ProductGallery.vue'
  import ProductInfo from '@/components/ui/ProductInfo.vue'
  import BaseTabsAccordion from '@/components/ui/BaseTabsAccordion.vue'
  import Reviews from '@/components/ui/Reviews.vue'
  import ProductCard from '@/components/ui/ProductCard.vue'
  import IconBaseArrowRight from '@/components/icons/IconBaseArrowRight.vue'

  const productStore = useProductsStore()
  const route = useRoute()

  const product = ref<Product | null>(null)
  const productImages = ref<string[]>([])

  const visibleProducts = computed(() => productStore.products.slice(0, 6))

  onMounted(async () => {
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${route.params.id}`)
      const data: Product = await res.json()
      product.value = data

      //хард картинки
      productImages.value = [data.image, data.image, data.image, data.image]
    } catch (err) {
      console.error('Product loading error', err)
    }
  })

  onMounted(() => {
    productStore.fetchAllProducts()
  })
</script>

<style scoped lang="scss">
  .product {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'gallery info'
      'tabs tabs';
    gap: 2rem;

    @media (max-width: vars.$breakpoints-l) {
      gap: 1rem;
      grid-template-columns: 1fr 320px;
    }

    @media (max-width: vars.$breakpoints-m) {
      grid-template-columns: 1fr;
      grid-template-areas:
        'gallery'
        'info'
        'tabs';
    }

    &__tabs {
      grid-area: tabs;
      margin-top: 2rem;
    }

    &__gallery {
      grid-area: gallery;
      margin-top: 24px;
    }

    &__simular {
      &-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: auto;

        &-item {
          justify-self: center;
        }

        @media (max-width: vars.$breakpoints-xl) {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      &-сontinue {
        margin-top: 2rem;

        @media (min-width: vars.$breakpoints-xl) {
          display: none;
        }
      }

      &-link {
        margin-top: 2rem;
        display: flex;
        justify-content: space-between;
        text-decoration: none;
        color: vars.$color-accent-light;
      }
    }
  }
  .product__info {
    flex: 1;
    grid-area: info;
  }
  .product-rating .filled {
    color: gold;
  }
  .loading {
    text-align: center;
    padding: 2rem;
  }
</style>
