<template>
  <div class="carousel">
    <div v-if="pending">Загрузка...</div>
    <div v-else-if="error">Ошибка: {{ error.message }}</div>
    <Swiper
      v-else
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
            <NuxtLink to="/" class="carousel-info__link">View Product</NuxtLink>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
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

  const { data, pending, error } = await useApi<ImageItem[]>('/v2/list', {
    query: {
      page: 1,
      limit: 10,
    },
  })

  const images = data
</script>

<style lang="scss">
  @use '../../assets/scss/variables';

  .swiper {
    inline-size: 100%;
    max-block-size: 646px;
    margin: auto;

    &-pagination-bullet {
      margin-block-end: 20px !important;
      background: $color-light;
      opacity: 1;
    }

    &-pagination-bullet-active {
      background: transparent;
      border: 1px solid $color-light;
    }

    @media (max-width: $breakpoints-s) {
      &-pagination-bullet {
        margin-block-end: 8px !important;
        width: 6px;
        height: 6px;
      }
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
      color: $color-light;
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
        color: $color-light;
        text-decoration: none;
        padding: 13px 30px;
        border: 1px solid $color-light;
        border-radius: 6px;
        transition: 0.2s;
        @include flexCenter;

        &:hover {
          background-color: $color-light;
          color: $color-dark;
        }
      }

      @media (max-width: $breakpoints-s) {
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
          padding: 6px 9px;
          font-size: 14px;
        }
      }
    }
  }
</style>
