<template>
  <section v-if="product" class="product">
    <ProductGallery :ProductImages="productImages" class="product__gallery" />

    <ProductInfo :product="product" />

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
    <div class="product__simular">
      <h2 class="product__simular__title">Simular Items</h2>

      <div v-if="!isMobile" class="product__simular-grid">
        <ProductCard
          v-for="item in visibleProducts"
          :key="item.id"
          :product="item"
          class="product__simular-grid-item"
        />
      </div>

      <div class="product__similar-carousel" v-else>
        <Swiper
          :modules="[Navigation, Pagination]"
          :slides-per-view="2.2"
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

      <div class="product__simular-сontinue">
        <NuxtLink to="/Shop" class="product__simular-link">
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

  import ProductGallery from '@/components/ui/ProductGallery.vue'
  import ProductInfo from '@/components/ui/ProductInfo.vue'
  import Reviews from '@/components/ui/Reviews.vue'
  import ProductCard from '@/components/ui/ProductCard.vue'
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
    grid-template-columns: 1fr 1fr;
    gap: 2rem;

    @media (max-width: vars.$breakpoints-xl) {
      gap: 1rem;
    }

    @media (max-width: vars.$breakpoints-m) {
      grid-template-areas:
        'gallery'
        'info'
        'tabs';
      grid-template-columns: 1fr;
    }

    &__tabs {
      grid-area: tabs;
      margin-top: 2rem;

      @media (max-width: vars.$breakpoints-s) {
        margin: 14px;
      }
    }

    &__gallery {
      grid-area: gallery;
      margin-top: 24px;

      @media (max-width: vars.$breakpoints-m) {
        margin-top: 12px;
      }
    }

    &__simular {
      margin-bottom: 100px;

      @media (max-width: vars.$breakpoints-l) {
        margin-bottom: 50px;
      }

      @media (max-width: vars.$breakpoints-m) {
        margin: 0;
      }

      &__title {
        font-size: 26px;
        font-weight: 400;
        line-height: 135%;

        @media (max-width: vars.$breakpoints-m) {
          font-size: 16px;
        }
      }

      &-grid {
        display: flex;
        justify-content: space-between;

        &-item {
          justify-self: center;

          @media (max-width: vars.$breakpoints-xl) {
            width: 300px;
          }

          @media (max-width: vars.$breakpoints-l) {
            width: 220px;
          }
        }
      }

      &-сontinue {
        @media (min-width: vars.$breakpoints-xl) {
          display: none;
        }
      }

      &-link {
        display: flex;
        justify-content: space-between;
        margin-top: 3rem;
        color: vars.$color-accent-light;
        text-decoration: none;
      }
    }
  }
</style>
