import { vi } from 'vitest'

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