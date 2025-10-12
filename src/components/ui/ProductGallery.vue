<template>
  <div class="product-gallery">
    <div v-if="isMobile" class="product-gallery__mobile-slider">
      <Swiper
        :modules="[Navigation]"
        :slides-per-view="1"
        :pagination="{ clickable: true }"
        class="swiper"
        :loop="true"
        @slideChange="onSlideChange"
        @swiper="onSwiperInit"
      >
        <SwiperSlide v-for="(img, idx) in ProductImages" :key="idx" class="swiper__slide">
          <img :src="img" alt="Product image" class="product-gallery__mobile-image" />
        </SwiperSlide>
      </Swiper>
    </div>

    <div v-else class="product-gallery__desktop">
      <div class="product-gallery__thumbnails">
        <img
          v-for="(img, index) in ProductImages"
          :key="index"
          :src="img"
          :class="{ active: index === currentIndex }"
          class="product-gallery__thumbnail-image"
          @click="setActive(index)"
        />
      </div>

      <div class="product-gallery__main-image">
        <img
          :src="ProductImages[activeIndex]"
          alt="Main product image"
          class="product-gallery__main-image"
        />
      </div>
    </div>

    <div class="product-gallery__steps">
      <div
        v-for="(img, idx) in ProductImages"
        :key="`step-${idx}`"
        class="product-gallery__step"
        :class="{ active: idx === currentIndex }"
        @click="setActive(idx)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Navigation } from 'swiper/modules'
  import type { Swiper as SwiperType } from 'swiper'
  import 'swiper/css'
  import 'swiper/css/navigation'
  import { ref, computed } from 'vue'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { TABLET_BREAKPOINT } from '@/constants/breakpoints'

  defineProps<{
    ProductImages: string[]
  }>()

  const { isBelow: isMobile } = useBreakpoint(TABLET_BREAKPOINT)

  const swiperInstance = ref<SwiperType | null>(null)
  const realIndex = ref(0)
  const activeIndex = ref(0)

  const currentIndex = computed(() => (isMobile.value ? realIndex.value : activeIndex.value))

  const onSwiperInit = (swiper: SwiperType) => {
    swiperInstance.value = swiper
    realIndex.value = swiper.realIndex
  }

  const onSlideChange = (swiper: SwiperType) => {
    realIndex.value = swiper.realIndex
  }

  const setActive = (index: number) => {
    if (isMobile.value && swiperInstance.value) {
      swiperInstance.value.slideToLoop(index)
    } else {
      activeIndex.value = index
    }
  }
</script>

<style lang="scss" scoped>
  .product-gallery {
    &__mobile-slider {
      inline-size: 800px;
      margin-inline: auto;

      @media (max-width: vars.$breakpoints-m) {
        inline-size: 500px;
      }

      @media (width <= 530px) {
        inline-size: 300px;
      }
    }

    &__mobile-image {
      inline-size: 100%;
      border-radius: 0.5rem;

      @media (max-width: vars.$breakpoints-s) {
        width: 288px;
      }
    }

    &__desktop {
      display: flex;
      gap: 38px;

      @media (max-width: vars.$breakpoints-xl) {
        gap: 15px;
      }
    }

    &__thumbnails {
      display: flex;
      flex-direction: column;
      gap: 40px;

      @media (max-width: vars.$breakpoints-xxl) {
        gap: 16px;
      }
    }

    &__thumbnail-image {
      inline-size: 120px;
      aspect-ratio: 1;
      cursor: pointer;
      object-fit: contain;
      border: 2px solid transparent;
      border-radius: 0.5rem;

      &.active {
        border-color: vars.$color-dark;
      }

      @media (max-width: vars.$breakpoints-xxl) {
        inline-size: 100px;
      }

      @media (max-width: vars.$breakpoints-xl) {
        inline-size: 80px;
      }

      @media (max-width: vars.$breakpoints-l) {
        inline-size: 60px;
      }
    }

    &__main-image {
      inline-size: 540px;
      aspect-ratio: 540 / 600;
      object-fit: contain;

      @media (max-width: vars.$breakpoints-xxl) {
        inline-size: 400px;
      }

      @media (max-width: vars.$breakpoints-xl) {
        inline-size: 320px;
      }

      @media (max-width: vars.$breakpoints-l) {
        inline-size: 240px;
      }
    }

    &__steps {
      display: flex;
      justify-content: center;
      inline-size: 100%;
      max-inline-size: 320px;
      margin-block-start: 12px;
      margin-inline: auto;
      background: vars.$color-ligth-gray;

      @media (min-width: vars.$breakpoints-m) {
        inline-size: 100%;
      }
    }

    &__step {
      position: relative;
      flex: 1 1 0;
      block-size: 2px;
      cursor: pointer;
      border-radius: 2px;
      transition: background-color 0.3s ease;

      &.active {
        background: vars.$color-gray;
      }

      &::before {
        position: absolute;
        inset-block: -8px;
        display: block;
        inline-size: 100%;
        block-size: 20px;
        content: '';
      }
    }
  }

  .swiper {
    inline-size: 100%;
    block-size: 100%;

    &__slide {
      display: flex;
      align-items: center;
      justify-content: center;
      block-size: auto;
    }
  }
</style>
