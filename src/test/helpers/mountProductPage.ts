import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, Suspense } from 'vue'
import ProductPage from '@/pages/product/[id].vue'

export const mountProductPage = async () => {
  const wrapperComponent = defineComponent({
    render() {
      return h(Suspense, null, {
        default: h(ProductPage),
        fallback: h('div', 'Loading...')
      })
    }
  })

  const wrapper = mount(wrapperComponent, {
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
          props: ['tabs'],
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
        IconBaseArrowRight: { template: '<span />' }
      },
    },
  })

  await flushPromises()
  
  return wrapper.findComponent(ProductPage)
}