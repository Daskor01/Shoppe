import { mount, flushPromises } from '@vue/test-utils'
import ProductPage from '@/pages/product/[id].vue'

export const mountProductPage = async () => {
  const wrapper = mount(ProductPage, {
    global: {
      stubs: {
        ProductGallery: {
          name: 'ProductGallery',
          template: '<div data-test="gallery" />',
        },
        ProductInfo: {
          name: 'ProductInfo',
          template: '<div data-test="info" />',
        },
        Reviews: {
          name: 'Reviews',
          template: '<div />',
        },
        ProductCard: {
          name: 'ProductCard',
          template: '<div data-test="product-card" />',
        },

        BaseTabs: {
          name: 'BaseTabs',
          props: {
            tabs: {
              type: Array as () => { name: string; label: string }[],
              required: true,
            },
          },
          template: '<div data-test="base-tabs" />',
        },
        BaseAccordion: {
          name: 'BaseAccordion',
          template: '<div data-test="base-accordion"><slot /></div>',
        },

        Swiper: { template: '<div><slot /></div>' },
        SwiperSlide: { template: '<div><slot /></div>' },

        ClientOnly: { template: '<div><slot /></div>' },

        RouterLink: { template: '<a><slot /></a>' },
        NuxtLink: { template: '<a><slot /></a>' },
      },
    },
  })

  await flushPromises()
  return wrapper
}
