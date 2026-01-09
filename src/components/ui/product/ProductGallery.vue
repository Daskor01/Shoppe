<template>
  <div class="product-gallery">
    <div v-if="isMobile" class="product-gallery__mobile-slider">
      <ClientOnly>
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="1"
          :space-between="20"
          class="swiper"
          :loop="true"
          @slideChange="onSlideChange"
          @swiper="onSwiperInit"
        >
          <SwiperSlide v-for="(img, idx) in ProductImages" :key="idx" class="swiper__slide">
            <NuxtImg
              :src="img"
              :alt="`Product view ${idx + 1}`"
              format="webp"
              class="product-gallery__mobile-image"
              :fetchpriority="idx === 0 ? 'high' : 'auto'"
              width="273"
              loading="eager"
            />
          </SwiperSlide>
        </Swiper>
      </ClientOnly>
      <div class="product-gallery__steps" role="tablist" aria-label="Product image navigation">
        <button
          v-for="(img, idx) in ProductImages"
          :key="`step-${idx}`"
          class="product-gallery__step"
          :class="{ active: idx === currentIndex }"
          :aria-label="`Go to slide ${idx + 1}`"
          :aria-selected="idx === currentIndex"
          role="tab"
          type="button"
          @click="setActive(idx)"
        />
      </div>
    </div>

    <div v-else class="product-gallery__desktop">
      <div class="product-gallery__thumbnails" role="tablist" aria-orientation="vertical">
        <button
          v-for="(img, index) in ProductImages"
          :key="index"
          class="product-gallery__thumbnail-button"
          :aria-selected="index === currentIndex"
          :aria-controls="`panel-${index}`"
          :aria-label="`Показать изображение товара ${index + 1}`"
          role="tab"
          type="button"
          @click="setActive(index)"
        >
          <NuxtImg
            :src="img"
            :class="{ active: index === currentIndex }"
            format="webp"
            class="product-gallery__thumbnail-image"
            alt=""
            quality="70"
            loading="lazy"
          />
        </button>
      </div>

      <div class="product-gallery__main-content">
        <div class="product-gallery__main-image" aria-live="polite">
          <NuxtImg
            :src="ProductImages[activeIndex]"
            format="webp"
            alt="Main product view"
            class="product-gallery__main-image"
            fetchpriority="high"
          />
        </div>
        <div class="product-gallery__steps" role="tablist">
          <button
            v-for="(img, idx) in ProductImages"
            :key="`step-${idx}`"
            class="product-gallery__step"
            :class="{ active: idx === currentIndex }"
            :aria-selected="idx === currentIndex"
            role="tab"
            type="button"
            @click="setActive(idx)"
          />
        </div>
      </div>
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
      margin-inline: auto;

      @media (max-width: vars.$breakpoints-m) {
        max-inline-size: 700px;
      }

      @media (max-width: vars.$breakpoints-s) {
        max-inline-size: 300px;
      }
    }

    &__mobile-image {
      box-sizing: border-box;
      display: block;
      width: 400px;
      aspect-ratio: 1 / 1;
      padding: 30px;
      object-fit: contain;
      background-color: vars.$color-ligth-gray;
      border-radius: 0.5rem;

      @media (max-width: vars.$breakpoints-s) {
        width: 288px;
      }
    }

    &__desktop {
      display: flex;
      gap: 66px;

      @media (max-width: vars.$breakpoints-xl) {
        gap: 40px;
      }
    }

    &__main-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__thumbnails {
      display: flex;
      flex-direction: column;
      gap: 40px;
      margin-top: 14px;

      @media (max-width: vars.$breakpoints-xl) {
        gap: 40px;
      }

      @media (max-width: 1120px) {
        gap: 20px;
      }
    }

    &__thumbnail-image {
      box-sizing: border-box;
      display: block;
      inline-size: 120px;
      aspect-ratio: 1;
      padding: 8px;
      cursor: pointer;
      object-fit: contain;
      background-color: vars.$color-ligth-gray;
      border: 2px solid transparent;
      border-radius: 0.5rem;

      &.active {
        border-color: vars.$color-dark;
      }

      @media (max-width: vars.$breakpoints-xxl) {
        inline-size: 120px;
      }

      @media (max-width: vars.$breakpoints-xl) {
        inline-size: 100px;
      }

      @media (max-width: vars.$breakpoints-l) {
        inline-size: 80px;
      }

      @media (max-width: 1120px) {
        inline-size: 70px;
      }
    }

    &__main-image {
      box-sizing: border-box;
      display: block;
      inline-size: 540px;
      aspect-ratio: 540 / 600;
      padding: 12px;
      background-color: vars.$color-ligth-gray;
      border-radius: 0.5rem;

      @media (max-width: vars.$breakpoints-xl) {
        inline-size: 480px;
      }

      @media (max-width: vars.$breakpoints-l) {
        inline-size: 390px;
      }

      @media (max-width: 1120px) {
        inline-size: 300px;
      }

      @media (max-width: vars.$breakpoints-m) {
        inline-size: 240px;
      }

      img {
        inline-size: 100%;
        block-size: 100%;
        object-fit: contain;
      }
    }

    &__steps {
      display: flex;
      justify-content: center;
      inline-size: 100%;
      margin-block-start: 32px;
      margin-inline: auto;
      background: vars.$color-ligth-gray;

      @media (min-width: vars.$breakpoints-m) {
        max-inline-size: 100%;
      }

      @media (max-width: vars.$breakpoints-s) {
        max-inline-size: 290px;
        margin-block-start: 14px;
        margin-inline: 0;
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

    &__thumbnail-button,
    &__step {
      padding: 0;
      cursor: pointer;
      outline-offset: 2px;
      background: none;
      border: none;
    }
  }

  .swiper {
    inline-size: 100%;
    block-size: 100%;
    border-radius: 10px;

    &__slide {
      display: flex;
      align-items: center;
      justify-content: center;
      block-size: auto;
    }

    &-wrapper {
      gap: 16px;
    }
  }
</style>
