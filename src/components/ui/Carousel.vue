<template>
  <div class="carousel">
    <transition name="fade" mode="out-in">
      <div v-if="pending" key="loading">Загрузка...</div>
      <div v-else-if="error" key="error">Ошибка: {{ error }}</div>
      <Swiper
        v-else
        key="content"
        :modules="[Pagination, Autoplay]"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        :slides-per-view="1"
        :space-between="20"
        :pagination="{ clickable: true }"
        class="swiper"
      >
        <SwiperSlide v-for="item in images" :key="item.id">
          <div class="slide">
            <img :src="item.download_url" :alt="item.author" />
            <div class="carousel-info">
              <div class="carousel-info__text-content">
                <h2 class="carousel-info__title">Gold big hoops</h2>
                <h3 class="carousel-info__subtitle">$ 68,00</h3>
              </div>
              <NuxtLink to="/" class="carousel-info__link"> View Product </NuxtLink>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Autoplay, Pagination } from 'swiper/modules'
  import 'swiper/css'
  import 'swiper/css/pagination'
  import { useApi } from '@/composables/useApi'
  import { ref, onMounted } from 'vue'
  import type { ImageItem, QueryParams } from '@/types/Carousel'

  const images = ref<ImageItem[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const baseImageUrl = config.public.imageApi
  const { fetchApi } = useApi(baseImageUrl)

  async function loadImages() {
    pending.value = true
    try {
      images.value = await fetchApi<ImageItem[], undefined, QueryParams>('/v2/list', {
        query: { page: 1, limit: 10 },
      })
    } catch (e: any) {
      error.value = e.message || 'Ошибка загрузки'
    } finally {
      pending.value = false
    }
  }

  onMounted(() => {
    loadImages()
  })
</script>

<style lang="scss">
  .swiper {
    inline-size: 100%;
    block-size: auto;

    &-pagination-bullet {
      margin: 16px 8px !important;
      background: vars.$color-light;
      opacity: 1;

      @media (max-width: vars.$breakpoints-l) {
        width: 6px;
        height: 6px;
        margin: 10px 6px !important;
      }

      @media (max-width: vars.$breakpoints-s) {
        margin: 6px 4px !important;
      }
    }

    &-pagination-bullet-active {
      background: transparent;
      border: 1px solid vars.$color-light;
    }
  }

  .slide {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    border-radius: 16px;

    img {
      inline-size: 100%;
      block-size: 100%;
      min-block-size: 354px;
      max-block-size: 646px;
      object-fit: cover;
    }
  }

  .carousel {
    &-info {
      position: absolute;
      inset-block-start: 40%;
      inset-inline-start: 40px;
      z-index: 2;
      display: grid;
      gap: 3rem;
      color: vars.$color-light;

      &__title {
        margin-block-end: 8px;
        font-size: 33px;
      }

      &__subtitle {
        margin-block-end: 16px;
        font-size: 26px;
      }

      &__link {
        padding: 14px 30px;
        color: vars.$color-light;
        text-decoration: none;
        border: 1px solid vars.$color-light;
        border-radius: 6px;
        transition: 0.2s;

        @include mixins.flexCenter;

        &:hover {
          color: vars.$color-dark;
          background-color: vars.$color-light;
        }
      }

      @media (max-width: vars.$breakpoints-s) {
        inset-block-start: 180px;
        inset-inline-start: 8px;
        gap: 10px;

        &__title {
          font-size: 20px;
        }

        &__subtitle {
          font-size: 14px;
        }

        &__link {
          padding: 6px 10px;
          font-size: 14px;
        }
      }
    }
  }

  // Анимация
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
