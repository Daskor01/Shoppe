import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductGallery from '@/components/ui/product/ProductGallery.vue'
import { vi } from 'vitest'

const MOCK_IMAGES = [
  'image1.jpg',
  'image2.jpg',
  'image3.jpg',
  'image4.jpg'
]

vi.mock('swiper/vue', () => ({
  Swiper: {
    template: '<div class="swiper-mock"><slot /></div>'
  },
  SwiperSlide: {
    template: '<div class="swiper-slide-mock"><slot /></div>'
  }
}))

vi.mock('swiper/modules', () => ({
  Navigation: vi.fn(),
  Pagination: vi.fn(),
  Thumbs: vi.fn()
}))

vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/navigation', () => ({}))
vi.mock('swiper/css/pagination', () => ({}))

vi.mock('@/composables/useBreakpoint', () => ({
  useBreakpoint: () => ({
    isBelow: { value: false }
  })
}))

describe('ProductGallery', () => {
  const createWrapper = (images: string[] = MOCK_IMAGES) => {
    return mount(ProductGallery, {
      props: { ProductImages: images }
    })
  }

  it('displays all product images', () => {
    const wrapper = createWrapper()
    
    const slides = wrapper.findAll('.swiper-slide-mock')
    expect(slides).toHaveLength(MOCK_IMAGES.length)
  })

  it('renders swiper container for image gallery', () => {
    const wrapper = createWrapper()
    
    const swiper = wrapper.find('.swiper-mock')
    expect(swiper.exists()).toBe(true)
  })

  it('handles empty image array gracefully', () => {
    const wrapper = createWrapper([])
    
    const slides = wrapper.findAll('.swiper-slide-mock')
    expect(slides).toHaveLength(0)
    
    const swiper = wrapper.find('.swiper-mock')
    expect(swiper.exists()).toBe(true)
  })

  it('displays single image correctly', () => {
    const singleImage = ['single-image.jpg']
    const wrapper = createWrapper(singleImage)
    
    const slides = wrapper.findAll('.swiper-slide-mock')
    expect(slides).toHaveLength(1)
  })
})