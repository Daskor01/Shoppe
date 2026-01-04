import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ProductPage from '@/pages/product/[id].vue'
import type { Product } from '@/types/Product'
import { routeMock } from '@/test/mocks/router.mock'
import { isMobileRef } from '@/test/mocks/composables/useBreakpoint.mock'
import { mountProductPage } from '@/test/helpers/mountProductPage'
import { MOCK_PRODUCT } from '@/test/mocks/data/product'

vi.mock('@/composables/useBreakpoint', () => ({
  useBreakpoint: () => ({
    isBelow: isMobileRef,
  }),
}))

const fetchApiMock = vi.fn<(url: string) => Promise<Product>>()

vi.mock('@/composables/useApi', () => ({
  useApi: () => ({
    fetchApi: fetchApiMock,
  }),
}))

describe('Product page', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    localStorage.clear()

    isMobileRef.value = false
    routeMock.params.id = '1'
    fetchApiMock.mockResolvedValue(MOCK_PRODUCT)
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('shows loading state before product is loaded', () => {
    const wrapper = mount(ProductPage, {
      global: {
        stubs: {
          RouterLink: { template: '<a />' },
          NuxtLink: { template: '<a />' },
          ClientOnly: { template: '<div><slot /></div>' },
        },
      },
    })

    expect(wrapper.text()).toContain('Loading...')
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
    isMobileRef.value = false

    const wrapper = await mountProductPage()

    expect(wrapper.find('[data-test="base-tabs"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="base-accordion"]').exists()).toBe(false)
  })

  it('renders BaseAccordion on mobile', async () => {
    isMobileRef.value = true

    const wrapper = await mountProductPage()

    expect(wrapper.find('[data-test="base-accordion"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="base-tabs"]').exists()).toBe(false)
  })

  it('renders only 3 similar products', async () => {
    const wrapper = await mountProductPage()

    expect(wrapper.findAll('[data-test="product-card"]')).toHaveLength(3)
  })

  it('correctly updates reviews count from localStorage', async () => {
    localStorage.setItem(
      'reviews_1',
      JSON.stringify([{ id: 1 }, { id: 2 }]),
    )

    const wrapper = await mountProductPage()

    vi.runOnlyPendingTimers()
    await flushPromises()

    const baseTabs = wrapper.findComponent({ name: 'BaseTabs' })
    const tabs = baseTabs.props('tabs') as { name: string; label: string }[]
    const reviewsTab = tabs.find(tab => tab.name === 'reviews')

    expect(reviewsTab?.label).toBe('Reviews(2)')


    expect(reviewsTab?.label).toBe('Reviews(2)')
  })
})
