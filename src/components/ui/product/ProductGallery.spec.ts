import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductGallery from '@/components/ui/product/ProductGallery.vue'
import { MOCK_IMAGES } from '@/test/mocks/data/images'
import { setMobile, resetMobile } from '@/test/helpers/window'

describe('ProductGallery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetMobile()
  })

  const createWrapper = (images: string[] = MOCK_IMAGES, isMobile = false) => {
    if (isMobile) {
      setMobile()
    } else {
      resetMobile()
    }

    return mount(ProductGallery, {
      props: { ProductImages: images },
      global: {
        stubs: {
          ClientOnly: { template: '<div><slot /></div>' },
          Swiper: { template: '<div class="swiper-mock"><slot /></div>' },
          SwiperSlide: { template: '<div class="swiper-slide-mock"><slot /></div>' },
          NuxtImg: { 
            template: '<img :src="src" :class="class" />',
            props: ['src', 'class'] 
          }
        }
      }
    })
  }

  describe('Mobile version', () => {
    it('displays all product images', () => {
      const wrapper = createWrapper(MOCK_IMAGES, true)
      
      const slides = wrapper.findAll('.swiper-slide-mock')
      expect(slides).toHaveLength(MOCK_IMAGES.length)
    })

    it('renders swiper container for image gallery', () => {
      const wrapper = createWrapper(MOCK_IMAGES, true)
      
      const swiper = wrapper.find('.swiper-mock')
      expect(swiper.exists()).toBe(true)
    })

    it('handles empty image array gracefully', () => {
      const wrapper = createWrapper([], true)
      
      const slides = wrapper.findAll('.swiper-slide-mock')
      expect(slides).toHaveLength(0)
      
      const swiper = wrapper.find('.swiper-mock')
      expect(swiper.exists()).toBe(true)
    })

    it('displays single image correctly', () => {
      const singleImage = ['single-image.jpg']
      const wrapper = createWrapper(singleImage, true)
      
      const slides = wrapper.findAll('.swiper-slide-mock')
      expect(slides).toHaveLength(1)
    })
  })

  describe('Desktop', () => {
    it('displays all product images in desktop view', () => {
      const wrapper = createWrapper(MOCK_IMAGES, false)
      
      const thumbnails = wrapper.findAll('.product-gallery__thumbnail-image')
      expect(thumbnails).toHaveLength(MOCK_IMAGES.length)
    })

    it('renders desktop gallery structure', () => {
      const wrapper = createWrapper(MOCK_IMAGES, false)
      
      const desktopGallery = wrapper.find('.product-gallery__desktop')
      expect(desktopGallery.exists()).toBe(true)
      
      const thumbnailsContainer = wrapper.find('.product-gallery__thumbnails')
      expect(thumbnailsContainer.exists()).toBe(true)
      
      const mainImage = wrapper.find('.product-gallery__main-image img')
      expect(mainImage.exists()).toBe(true)
    })

    it('handles empty image array in desktop view', () => {
      const wrapper = createWrapper([], false)
      
      const thumbnails = wrapper.findAll('.product-gallery__thumbnail-image')
      expect(thumbnails).toHaveLength(0)
      
      const desktopGallery = wrapper.find('.product-gallery__desktop')
      expect(desktopGallery.exists()).toBe(true)
    })

    it('displays single image correctly in desktop view', () => {
      const singleImage = ['single-image.jpg']
      const wrapper = createWrapper(singleImage, false)
      
      const thumbnails = wrapper.findAll('.product-gallery__thumbnail-image')
      expect(thumbnails).toHaveLength(1)
      
      const mainImage = wrapper.find('.product-gallery__main-image img')
      expect(mainImage.exists()).toBe(true)
      expect(mainImage.attributes('src')).toContain(singleImage[0])
    })
  })
})
