import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ProductPage from '@/pages/product/[id].vue'
import { routeMock } from '@/test/mocks/router.mock'
import { setMobile, resetMobile } from '@/test/helpers/window'
import { mountProductPage } from '@/test/helpers/mountProductPage'
import { MOCK_PRODUCT } from '@/test/mocks/data/product'
import { fetchApiMock } from '@/test/vitest.setup'

describe('Product page', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    localStorage.clear()

    resetMobile()
    routeMock.params.id = '1'
    fetchApiMock.mockResolvedValue(MOCK_PRODUCT)
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('shows loading state before product is loaded', async () => {
    const wrapper = mount({
      template: `<Suspense>
        <ProductPage />
        <template #fallback>Loading product...</template>
      </Suspense>`,
      components: { ProductPage }
    }, {
      global: {
        stubs: { 
          RouterLink: true, NuxtLink: true, ClientOnly: true,
          ProductGallery: true, ProductInfo: true 
        }
      }
    })

    expect(wrapper.text()).toContain('Loading product...')
  })

  it('fetches product by id on mount', async () => {
    await mountProductPage()
    expect(fetchApiMock).toHaveBeenCalledWith('/products/1')
  })

  it('renders product info after successful load', async () => {
    const wrapper = await mountProductPage()

    expect(wrapper.find('[data-test="gallery"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="info"]').exists()).toBe(true)
  })

  it('renders BaseTabs on desktop', async () => {
    resetMobile()

    const wrapper = await mountProductPage()

    expect(wrapper.find('[data-test="base-tabs"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="base-accordion"]').exists()).toBe(false)
  })

  it('renders BaseAccordion on mobile', async () => {
    setMobile()

    const wrapper = await mountProductPage()

    expect(wrapper.find('[data-test="base-accordion"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="base-tabs"]').exists()).toBe(false)
  })

  it('renders only 3 similar products', async () => {
    const wrapper = await mountProductPage()

    expect(wrapper.findAll('[data-test="product-card"]')).toHaveLength(3)
  })

  it('correctly updates reviews count from localStorage', async () => {
    localStorage.setItem('reviews_1', JSON.stringify([{ id: 1 }, { id: 2 }]))

    interface TabItem {
      name: string;
      label: string;
    }
    
    const wrapper = await mountProductPage()
    await flushPromises()
    
    const baseTabs = wrapper.findComponent({ name: 'BaseTabs' })
    expect(baseTabs.exists()).toBe(true)
    const tabs = baseTabs.props('tabs') as TabItem[]
    const reviewsTab = tabs.find((tab: TabItem) => tab.name === 'reviews')
    expect(reviewsTab?.label).toBe('Reviews(2)')
  })
})
