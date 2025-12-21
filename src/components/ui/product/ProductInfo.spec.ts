import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ProductInfo from '@/components/ui/product/ProductInfo.vue'
import type { Product } from '@/types/Product'

// Mock data
const MOCK_PRODUCT: Product = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  description: 'Test product description for testing purposes',
  category: 'electronics',
  image: 'test-image.jpg',
  rating: {
    rate: 4.5,
    count: 120
  }
}

// Create mocks using vi.hoisted to make them available during hoisting
const createComponentMock = vi.hoisted(() => (name: string) => ({
  default: {
    name,
    template: `<div class="${name.toLowerCase().replace('icon', 'icon-')}-mock"></div>`
  }
}))

const mockUseBreakpoint = vi.hoisted(() => vi.fn())

// Create icon mocks using hoisted function
const iconMailMock = vi.hoisted(() => createComponentMock('IconMail'))
const iconFacebookMock = vi.hoisted(() => createComponentMock('IconFacebook'))
const iconInstagramMock = vi.hoisted(() => createComponentMock('IconInstagram'))
const iconLikeProductMock = vi.hoisted(() => createComponentMock('IconLikeProduct'))
const iconTwitterMock = vi.hoisted(() => createComponentMock('IconTwitter'))
const iconShareMock = vi.hoisted(() => createComponentMock('IconShare'))
const iconBaseArrowRightMock = vi.hoisted(() => createComponentMock('IconBaseArrowRight'))
const iconBaseArrowTopMock = vi.hoisted(() => createComponentMock('IconBaseArrowTop'))

// Mock dependencies
vi.mock('@/stores/useCartStore', () => ({
  useCartStore: () => ({
    addToCart: vi.fn(),
    toggleCart: vi.fn()
  })
}))

// Mock useBreakpoint
vi.mock('@/composables/useBreakpoint', () => ({
  useBreakpoint: mockUseBreakpoint
}))

vi.mock('@/composables/useNotification', () => ({
  useNotification: () => ({
    notify: vi.fn()
  })
}))

// Mock icons using pre-created mocks
vi.mock('@/components/icons/IconMail.vue', () => iconMailMock)
vi.mock('@/components/icons/IconFacebook.vue', () => iconFacebookMock)
vi.mock('@/components/icons/IconInstagram.vue', () => iconInstagramMock)
vi.mock('@/components/icons/IconLikeProduct.vue', () => iconLikeProductMock)
vi.mock('@/components/icons/IconTwitter.vue', () => iconTwitterMock)
vi.mock('@/components/icons/IconShare.vue', () => iconShareMock)
vi.mock('@/components/icons/IconBaseArrowRight.vue', () => iconBaseArrowRightMock)
vi.mock('@/components/icons/IconBaseArrowTop.vue', () => iconBaseArrowTopMock)

// Mock child components
vi.mock('@/components/ui/base/BaseShareModal.vue', () => ({
  default: {
    name: 'BaseShareModal',
    template: '<div class="share-modal-mock"></div>'
  }
}))

vi.mock('@/components/ui/base/BaseStarRating.vue', () => ({
  default: {
    name: 'BaseStarRating',
    template: '<div class="star-rating-mock"></div>',
    props: ['modelValue', 'readonly']
  }
}))

vi.mock('@/components/ui/base/BaseButton.vue', () => ({
  default: {
    name: 'BaseButton',
    template: '<button class="base-button-mock"><slot /></button>'
  }
}))

describe('ProductInfo', () => {
  const createWrapper = (mobile = false) => {
    // Configure useBreakpoint mock
    mockUseBreakpoint.mockReturnValue({
      isBelow: ref(mobile)
    })

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(() => JSON.stringify([{ id: 1, text: 'Great product!' }]))
    }

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })

    return mount(ProductInfo, {
      props: { product: MOCK_PRODUCT }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset useBreakpoint mock to default value
    mockUseBreakpoint.mockReturnValue({
      isBelow: ref(false)
    })
  })

  it('displays product title correctly', () => {
    const wrapper = createWrapper()
    
    const title = wrapper.find('h1.product-info__title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe(MOCK_PRODUCT.title)
  })

  it('displays formatted product price', () => {
    const wrapper = createWrapper()
    
    const price = wrapper.find('.product-info__price')
    expect(price.exists()).toBe(true)
    expect(price.text()).toBe(`$${MOCK_PRODUCT.price.toFixed(2)}`)
  })

  it('displays product description on desktop', () => {
    const wrapper = createWrapper()
    
    const description = wrapper.find('.product-info__description')
    expect(description.exists()).toBe(true)
    expect(description.text()).toBe(MOCK_PRODUCT.description)
  })

  it('displays product category and SKU on desktop', () => {
    const wrapper = createWrapper()
    
    // Find desktop meta section
    const metaSection = wrapper.find('.product-info__meta')
    expect(metaSection.exists()).toBe(true)
    
    // Find all meta items inside the meta section
    const metaItems = metaSection.findAll('.product-info__meta-item')
    expect(metaItems).toHaveLength(2)
    
    // Check SKU (first item)
    expect(metaItems[0].text()).toContain(`SKU: ${MOCK_PRODUCT.id}`)
    
    // Check category (second item)
    expect(metaItems[1].text()).toContain(`Category: ${MOCK_PRODUCT.category}`)
  })

  it('displays star rating component on desktop', () => {
    const wrapper = createWrapper()
    
    // Find star rating component by name
    const starRating = wrapper.findComponent({ name: 'BaseStarRating' })
    expect(starRating.exists()).toBe(true)
  })

  it('displays customer review count on desktop', () => {
    const wrapper = createWrapper()
    
    const reviewText = wrapper.find('.product-info__rating-text')
    expect(reviewText.exists()).toBe(true)
    expect(reviewText.text()).toContain('customer review')
  })

  it('has quantity controls that work on desktop', async () => {
    const wrapper = createWrapper()
    
    const quantitySection = wrapper.find('.product-info__quantity')
    expect(quantitySection.exists()).toBe(true)
    
    const buttons = quantitySection.findAll('button')
    expect(buttons).toHaveLength(2)
    
    const quantityValue = quantitySection.find('.product-info__quantity-value')
    expect(quantityValue.text()).toBe('1')
    
    await buttons[1].trigger('click')
    expect(quantityValue.text()).toBe('2')
    
    await buttons[0].trigger('click')
    expect(quantityValue.text()).toBe('1')
    
    // Should not go below 1
    await buttons[0].trigger('click')
    expect(quantityValue.text()).toBe('1')
  })

  it('has add to cart button', () => {
    const wrapper = createWrapper()
    
    const cartButton = wrapper.findComponent({ name: 'BaseButton' })
    expect(cartButton.exists()).toBe(true)
    expect(cartButton.text()).toContain('Add to cart')
  })

  it('displays like button and social sharing icons on desktop', () => {
    const wrapper = createWrapper()
    
    // Find like button
    const likeButton = wrapper.find('.product-info__interaction-like')
    expect(likeButton.exists()).toBe(true)
    
    // Find social sharing section
    const shareSection = wrapper.find('.product-info__share')
    expect(shareSection.exists()).toBe(true)
    
    // Check that social icons are present
    expect(shareSection.find('.icon-mail-mock').exists()).toBe(true)
    expect(shareSection.find('.icon-facebook-mock').exists()).toBe(true)
    expect(shareSection.find('.icon-instagram-mock').exists()).toBe(true)
    expect(shareSection.find('.icon-twitter-mock').exists()).toBe(true)
  })

  describe('mobile version', () => {
    it('hides rating and description on mobile', () => {
      const wrapper = createWrapper(true)
      
      const rating = wrapper.find('.product-info__rating')
      expect(rating.exists()).toBe(false)
      
      const description = wrapper.find('.product-info__description')
      expect(description.exists()).toBe(false)
    })

    it('shows mobile share button', () => {
      const wrapper = createWrapper(true)
      
      const mobileShareButton = wrapper.find('.product-info__share-mobile-button')
      expect(mobileShareButton.exists()).toBe(true)
    })

    it('shows expandable details section on mobile', () => {
      const wrapper = createWrapper(true)
      
      const expandable = wrapper.find('details.product-info__expandable')
      expect(expandable.exists()).toBe(true)
      
      const toggleButton = wrapper.find('.product-info__toggle-button')
      expect(toggleButton.exists()).toBe(true)
    })
  })

  describe('desktop version', () => {
    it('shows full product details on desktop', () => {
      const wrapper = createWrapper()
      
      expect(wrapper.find('.product-info__rating').exists()).toBe(true)
      expect(wrapper.find('.product-info__description').exists()).toBe(true)
      expect(wrapper.find('.product-info__meta').exists()).toBe(true)
    })

    it('shows quantity controls on desktop', () => {
      const wrapper = createWrapper()
      
      const quantityControls = wrapper.find('.product-info__quantity')
      expect(quantityControls.exists()).toBe(true)
    })
  })
})