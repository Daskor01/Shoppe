<template>
  <section v-if="product" class="product">
    <ProductGallery :ProductImages="productImages" class="product__gallery" />

    <ProductInfo :product="product" class="product__info" />

    <BaseTabs v-if="!isMobile" :tabs="tabs" class="product__tabs">
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
    </BaseTabs>

    <BaseAccordion v-else :items="tabs" class="product__tabs">
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
    </BaseAccordion>
  </section>
  <div v-else class="loading">Loading...</div>

  <ClientOnly>
    <div class="product__similar">
      <h2 class="product__similar__title">Similar Items</h2>

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
          :space-between="30"
          class="product__similar-swiper"
        >
          <SwiperSlide
            v-for="item in visibleProducts"
            :key="item.id"
            class="product__similar-slide"
          >
            <ProductCard :product="item" class="product__similar-slide-item" />
          </SwiperSlide>
        </Swiper>
      </div>

      <div class="product__similar-сontinue">
        <NuxtLink to="/Shop" class="product__similar-link">
          <span>Continue shopping</span>
          <IconBaseArrowRight />
        </NuxtLink>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
  import { onMounted, ref, onUnmounted } from 'vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useProductsStore } from '@/stores/useProductsStore'
  import { useApi } from '@/composables/useApi'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { TABLET_BREAKPOINT } from '@/constants/breakpoints'
  import { type Product } from '@/types/Product'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Navigation, Pagination } from 'swiper/modules'

  import ProductGallery from '@/components/ui/product/ProductGallery.vue'
  import ProductInfo from '@/components/ui/product/ProductInfo.vue'
  import Reviews from '@/components/ui/reviews/Reviews.vue'
  import ProductCard from '@/components/ui/product/ProductCard.vue'
  import IconBaseArrowRight from '@/components/icons/IconBaseArrowRight.vue'

  const productStore = useProductsStore()
  const route = useRoute()
  const { isBelow: isMobile } = useBreakpoint(TABLET_BREAKPOINT)

  const product = ref<Product | null>(null)
  const productImages = ref<string[]>([])

  const visibleProducts = computed(() => productStore.products.slice(0, 3))
  const tabs = computed(() => [
    { label: 'Description', name: 'description' },
    { label: 'Additional Information', name: 'additional' },
    { label: `Reviews(${reviewsCount.value})`, name: 'reviews' },
  ])
  const reviewsCount = ref(0)

  const loadReviewsCount = () => {
    if (product.value) {
      const stored = localStorage.getItem(`reviews_${product.value.id}`)
      const reviews = stored ? JSON.parse(stored) : []
      reviewsCount.value = reviews.length
    }
  }

  onMounted(async () => {
    const { fetchApi } = useApi('https://fakestoreapi.com')
    const data = await fetchApi<Product>(`/products/${route.params.id}`)

    product.value = data
    productImages.value = [data.image, data.image, data.image, data.image]
  })

  onMounted(() => {
    productStore.fetchAllProducts()

    loadReviewsCount()
    const interval = setInterval(loadReviewsCount, 1000)
    onUnmounted(() => clearInterval(interval))
  })
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
        gap: 54px;
        margin-top: 44px;
      }

      &-grid-item {
        justify-self: center;

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
