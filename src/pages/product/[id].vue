<template>
  <main class="product-page">
    <div v-if="pending" class="loading" aria-live="polite">Loading product...</div>

    <section v-else-if="product" class="product" aria-label="Product details">
      <ProductGallery :ProductImages="productImages" class="product__gallery" />

      <ProductInfo :product="product" class="product__info" />

      <component
        :is="isMobile ? BaseAccordion : BaseTabs"
        :tabs="tabs"
        :items="tabs"
        class="product__tabs"
      >
        <template #description>
          <article class="product__description">
            <p>{{ product.description }}</p>
          </article>
        </template>

        <template #additional>
          <ul class="product__specs">
            <li><b>Weight:</b> 0.3 kg</li>
            <li><b>Dimensions:</b> 15 x 10 x 1 cm</li>
            <li><b>Colours:</b> Black, Browns, White</li>
            <li><b>Materials:</b> Metal</li>
          </ul>
        </template>

        <template #reviews>
          <Reviews
            :productId="product.id"
            :productTitle="product.title"
            @update-count="updateReviewsCount"
          />
        </template>
      </component>
    </section>

    <ClientOnly>
      <section class="product__similar" aria-labelledby="similar-title">
        <h2 id="similar-title" class="product__similar__title">Similar Items</h2>

        <div v-if="!isMobile" class="product__similar-grid">
          <ProductCard
            v-for="item in visibleProducts"
            :key="item.id"
            :product="item"
            class="product__similar-grid-item"
          />
        </div>

        <div v-else class="product__similar-carousel">
          <Swiper
            :modules="[Navigation, Pagination]"
            :slides-per-view="2.2"
            :space-between="20"
            class="product__similar-swiper"
          >
            <SwiperSlide v-for="item in visibleProducts" :key="item.id">
              <ProductCard :product="item" />
            </SwiperSlide>
          </Swiper>
        </div>

        <div class="product__similar-сontinue">
          <NuxtLink
            to="/Shop"
            class="product__similar-link"
            aria-label="Continue shopping and return to shop"
          >
            <span>Continue shopping</span>
            <IconBaseArrowRight aria-hidden="true" />
          </NuxtLink>
        </div>
      </section>
    </ClientOnly>
  </main>
</template>

<script setup lang="ts">
  import { computed, onMounted, shallowRef } from 'vue'
  import { useRoute } from 'vue-router'
  import { useProductsStore } from '@/stores/useProductsStore'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { TABLET_BREAKPOINT } from '@/constants/breakpoints'
  import type { Product } from '@/types/Product'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Navigation, Pagination } from 'swiper/modules'
  import { useApi } from '@/composables/useApi'
  import { useRuntimeConfig, useAsyncData } from 'nuxt/app'

  import BaseTabs from '@/components/ui/base/BaseTabs.vue'
  import BaseAccordion from '@/components/ui/base/BaseAccordion.vue'
  import ProductGallery from '@/components/ui/product/ProductGallery.vue'
  import ProductInfo from '@/components/ui/product/ProductInfo.vue'
  import Reviews from '@/components/ui/reviews/Reviews.vue'
  import ProductCard from '@/components/ui/product/ProductCard.vue'
  import IconBaseArrowRight from '@/components/icons/IconBaseArrowRight.vue'

  const route = useRoute()
  const config = useRuntimeConfig()
  const productStore = useProductsStore()
  const { isBelow: isMobile } = useBreakpoint(TABLET_BREAKPOINT)
  const { fetchApi } = useApi(config.public.productApi)

  const { data: product, pending } = await useAsyncData<Product>(`product-${route.params.id}`, () =>
    fetchApi<Product>(`/products/${route.params.id}`),
  )

  const productImages = computed(() => {
    if (!product.value) return []
    return Array(4).fill(product.value.image)
  })

  const reviewsCount = shallowRef(0)

  const tabs = computed(() => [
    { label: 'Description', name: 'description' },
    { label: 'Additional Information', name: 'additional' },
    { label: `Reviews(${reviewsCount.value})`, name: 'reviews' },
  ])

  const updateReviewsCount = () => {
    if (import.meta.client && product.value) {
      const stored = localStorage.getItem(`reviews_${product.value.id}`)
      reviewsCount.value = stored ? JSON.parse(stored).length : 0
    }
  }

  onMounted(() => {
    productStore.fetchAllProducts()
    updateReviewsCount()
  })

  const visibleProducts = computed(() => productStore.products.slice(0, 3))
</script>

<style scoped lang="scss">
  .product {
    display: grid;
    grid-template-areas:
      'gallery info'
      'tabs tabs';
    grid-template-columns: max-content 1fr;
    column-gap: 36px;

    @media (max-width: vars.$breakpoints-xl) {
      column-gap: 26px;
    }

    @media (max-width: vars.$breakpoints-m) {
      grid-template-areas:
        'gallery'
        'info'
        'tabs';
      grid-template-columns: 100%;
    }

    &__info {
      padding-top: 20px;

      @media (max-width: vars.$breakpoints-s) {
        padding-top: 8px;
      }
    }

    &__tabs {
      grid-area: tabs;
      margin-top: 88px;

      @media (max-width: vars.$breakpoints-s) {
        margin: 14px;
      }

      @media (max-width: vars.$breakpoints-s) {
        padding: 10px 0;
        margin: 16px 0 0;
      }
    }

    &__gallery {
      grid-area: gallery;
      margin-top: 24px;

      @media (max-width: vars.$breakpoints-m) {
        margin-top: 4px;
      }
    }

    &__similar {
      margin-bottom: 100px;

      @media (max-width: vars.$breakpoints-l) {
        margin-bottom: 50px;
      }

      @media (max-width: vars.$breakpoints-m) {
        margin: 0;
      }

      &__title {
        margin-top: 78px;
        font-size: 26px;
        font-weight: 400;
        line-height: 135%;

        @media (max-width: vars.$breakpoints-m) {
          margin-top: 26px;
          font-size: 16px;
        }
      }

      &-grid {
        display: flex;
        justify-content: space-between;
        margin-top: 44px;
      }

      &-grid-item {
        justify-self: center;
        width: 378px;

        @media (max-width: vars.$breakpoints-xl) {
          width: 340px;
        }

        @media (max-width: vars.$breakpoints-l) {
          width: 220px;
        }
      }

      &-slide-item {
        width: 300px;

        @media (max-width: vars.$breakpoints-s) {
          width: 220px;
        }

        @media (max-width: 540px) {
          width: 160px;
        }

        @media (max-width: vars.$breakpoints-xs) {
          width: 136px;
        }
      }

      &-сontinue {
        margin-block-start: 40px;

        @media (min-width: vars.$breakpoints-xl) {
          display: none;
        }
      }

      &-link {
        display: flex;
        justify-content: space-between;
        margin-top: 24px;
        font-size: 12px;
        color: vars.$color-accent-light;
        text-decoration: none;
      }
    }
  }
</style>
