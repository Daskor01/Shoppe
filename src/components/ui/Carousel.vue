<template>
  <div class="carousel">
    <transition name="fade" mode="out-in">
      <div v-if="pending" key="loading">Загрузка...</div>
      <div v-else-if="error" key="error">Ошибка: {{ error.message }}</div>
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

  interface ImageItem {
    id: string
    author: string
    download_url: string
  }

  const {
    data: images,
    pending,
    error,
  } = await useApi<ImageItem[]>('/v2/list', {
    query: {
      page: 1,
      limit: 10,
    },
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
    border-radius: 16px;
    overflow: hidden;

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
      color: vars.$color-light;
      z-index: 2;
      display: grid;
      gap: 3rem;

      &__title {
        font-size: 33px;
        margin-block-end: 8px;
      }

      &__subtitle {
        font-size: 26px;
        margin-block-end: 16px;
      }

      &__link {
        color: vars.$color-light;
        text-decoration: none;
        padding: 14px 30px;
        border: 1px solid vars.$color-light;
        border-radius: 6px;
        transition: 0.2s;
        @include mixins.flexCenter;

        &:hover {
          background-color: vars.$color-light;
          color: vars.$color-dark;
        }
      }

      @media (max-width: vars.$breakpoints-s) {
        gap: 10px;
        inset-inline-start: 8px;
        inset-block-start: 180px;

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

  //Анимация
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
