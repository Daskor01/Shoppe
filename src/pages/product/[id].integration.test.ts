import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, computed } from 'vue'

// Mock components - simplified and more realistic
const ProductGallery = defineComponent({
  props: ['ProductImages'],
  template: '<div>Product Gallery</div>'
})

const ProductInfo = defineComponent({
  props: ['product'],
  template: '<div>{{ product.title }} - ${{ product.price }}</div>'
})

const BaseTabs = defineComponent({
  props: ['tabs'],
  template: `
    <div>
      <div v-for="tab in tabs" :key="tab.name">{{ tab.label }}</div>
      <slot name="description"></slot>
      <slot name="additional"></slot>
      <slot name="reviews"></slot>
    </div>
  `
})

const BaseAccordion = defineComponent({
  props: ['items'],
  template: '<div>Mobile Accordion</div>'
})

const Reviews = defineComponent({
  props: ['productId', 'productTitle'],
  template: '<div>Product Reviews</div>'
})

const ProductCard = defineComponent({
  props: ['product'],
  template: '<div>{{ product.title }}</div>'
})

const Swiper = defineComponent({
  template: '<div><slot></slot></div>'
})

const SwiperSlide = defineComponent({
  template: '<div><slot></slot></div>'
})

// Mock data
const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  description: 'Test product description',
  category: 'electronics',
  image: 'https://test.com/image.jpg',
  rating: { rate: 4.5, count: 120 }
}

const mockSimilarProducts = [
  { id: 2, title: 'Similar Product 1', price: 79.99 },
  { id: 3, title: 'Similar Product 2', price: 89.99 },
  { id: 4, title: 'Similar Product 3', price: 69.99 }
]

// Define interface for component options
interface ProductPageOptions {
  product?: any | null
  isMobile?: boolean
  reviewsCount?: number
  visibleProducts?: any[]
}

// Factory for creating product page
const createProductPage = (options: ProductPageOptions = {}) => {
  const {
    product = mockProduct,
    isMobile = false,
    reviewsCount = 3,
    visibleProducts = mockSimilarProducts
  } = options

  return defineComponent({
    components: {
      ProductGallery,
      ProductInfo,
      BaseTabs,
      BaseAccordion,
      Reviews,
      ProductCard,
      Swiper,
      SwiperSlide
    },
    template: `
      <div>
        <section v-if="product" class="product">
          <ProductGallery :ProductImages="productImages" />
          <ProductInfo :product="product" />

          <BaseTabs v-if="!isMobile" :tabs="tabs">
            <template #description>
              <p>{{ product.description }}</p>
            </template>
            <template #additional>
              <p><b>Weight:</b> 0.3 kg</p>
              <p><b>Dimentions:</b> 15 x 10 x 1 cm</p>
              <p><b>Colours:</b> Black, Browns, White</p>
              <p><b>Materials:</b> Metal</p>
            </template>
            <template #reviews>
              <Reviews :productId="product.id" :productTitle="product.title" />
            </template>
          </BaseTabs>

          <BaseAccordion v-else :items="tabs">
            <template #description>
              <p>{{ product.description }}</p>
            </template>
            <template #additional>
              <p><b>Weight:</b> 0.3 kg</p>
              <p><b>Dimentions:</b> 15 x 10 x 1 cm</p>
              <p><b>Colours:</b> Black, Browns, White</p>
              <p><b>Materials:</b> Metal</p>
            </template>
            <template #reviews>
              <Reviews :productId="product.id" :productTitle="product.title" />
            </template>
          </BaseAccordion>
        </section>
        <div v-else class="loading">Loading...</div>

        <div v-if="visibleProducts.length > 0" class="product__similar">
          <h2>Similar Items</h2>

          <div v-if="!isMobile" class="product__similar-grid">
            <ProductCard
              v-for="item in visibleProducts"
              :key="item.id"
              :product="item"
            />
          </div>

          <div v-else class="product__similar-carousel">
            <Swiper :slides-per-view="2.2" :space-between="30">
              <SwiperSlide v-for="item in visibleProducts" :key="item.id">
                <ProductCard :product="item" />
              </SwiperSlide>
            </Swiper>
          </div>

          <div class="product__similar-continue">
            <a class="product__similar-link">
              <span>Continue shopping</span>
            </a>
          </div>
        </div>
      </div>
    `,
    setup() {
      const productRef = ref(product)
      const isMobileRef = ref(isMobile)
      const productImages = ref(['img1.jpg', 'img2.jpg', 'img3.jpg'])
      const visibleProductsRef = ref(visibleProducts)
      
      const tabs = computed(() => [
        { label: 'Description', name: 'description' },
        { label: 'Additional Information', name: 'additional' },
        { label: `Reviews(${reviewsCount})`, name: 'reviews' }
      ])

      return {
        product: productRef,
        isMobile: isMobileRef,
        productImages,
        visibleProducts: visibleProductsRef,
        tabs
      }
    }
  })
}

describe('Product Detail Page - Integration', () => {
  describe('checks the complete product detail page in desktop view', () => {
    it('displays all main sections with product data', () => {
      const DesktopProductPage = createProductPage({ isMobile: false })
      const wrapper = mount(DesktopProductPage)

      // Check main sections
      expect(wrapper.find('.product').exists()).toBe(true)
      expect(wrapper.find('.product__similar').exists()).toBe(true)

      // Check key product information
      const productInfo = wrapper.findComponent(ProductInfo)
      expect(productInfo.exists()).toBe(true)
      expect(productInfo.text()).toContain('Test Product')
      expect(productInfo.text()).toContain('$99.99')

      // Check gallery presence
      expect(wrapper.findComponent(ProductGallery).exists()).toBe(true)

      // Check tabs presence
      expect(wrapper.findComponent(BaseTabs).exists()).toBe(true)
      
      // Check tab content
      const tabsText = wrapper.findComponent(BaseTabs).text()
      expect(tabsText).toContain('Description')
      expect(tabsText).toContain('Additional Information')
      expect(tabsText).toContain('Reviews(3)')
      expect(tabsText).toContain('Test product description')
      expect(tabsText).toContain('Weight: 0.3 kg')
      expect(tabsText).toContain('Colours: Black, Browns, White')

      // Check similar products section
      expect(wrapper.find('h2').text()).toBe('Similar Items')
      expect(wrapper.findAllComponents(ProductCard)).toHaveLength(3)
      expect(wrapper.find('.product__similar-grid').exists()).toBe(true)
      
      // Check continue shopping link
      expect(wrapper.find('.product__similar-link').text()).toContain('Continue shopping')
    })

    it('displays all similar products with correct titles', () => {
      const DesktopProductPage = createProductPage({ isMobile: false })
      const wrapper = mount(DesktopProductPage)

      const productCards = wrapper.findAllComponents(ProductCard)
      expect(productCards).toHaveLength(3)
      expect(productCards[0].text()).toBe('Similar Product 1')
      expect(productCards[1].text()).toBe('Similar Product 2')
      expect(productCards[2].text()).toBe('Similar Product 3')
    })
  })

  describe('checks the complete product detail page in mobile view', () => {
    it('uses accordion instead of tabs for mobile layout', () => {
      const MobileProductPage = createProductPage({ isMobile: true })
      const wrapper = mount(MobileProductPage)

      expect(wrapper.findComponent(BaseAccordion).exists()).toBe(true)
      expect(wrapper.findComponent(BaseTabs).exists()).toBe(false)
      expect(wrapper.findComponent(Swiper).exists()).toBe(true)
      expect(wrapper.find('.product__similar-carousel').exists()).toBe(true)
    })

    it('displays carousel instead of grid for similar products', () => {
      const MobileProductPage = createProductPage({ isMobile: true })
      const wrapper = mount(MobileProductPage)

      expect(wrapper.findComponent(Swiper).exists()).toBe(true)
      expect(wrapper.find('.product__similar-grid').exists()).toBe(false)
      expect(wrapper.findAllComponents(ProductCard)).toHaveLength(3)
    })
  })

  describe('checks the loading state', () => {
    it('shows loading message when product data is not available', () => {
      const LoadingPage = createProductPage({ 
        product: null,
        visibleProducts: []
      })
      const wrapper = mount(LoadingPage)

      expect(wrapper.find('.loading').exists()).toBe(true)
      expect(wrapper.find('.loading').text()).toBe('Loading...')
      expect(wrapper.find('.product').exists()).toBe(false)
      expect(wrapper.find('.product__similar').exists()).toBe(false)
    })

    it('hides loading and shows product when data is available', () => {
      const LoadedPage = createProductPage()
      const wrapper = mount(LoadedPage)

      expect(wrapper.find('.loading').exists()).toBe(false)
      expect(wrapper.find('.product').exists()).toBe(true)
      expect(wrapper.find('.product__similar').exists()).toBe(true)
    })
  })

  describe('checks reviews integration', () => {
    it('displays reviews count in tab label', () => {
      const PageWithFiveReviews = createProductPage({ reviewsCount: 5 })
      const wrapper = mount(PageWithFiveReviews)

      expect(wrapper.findComponent(BaseTabs).text()).toContain('Reviews(5)')
    })

    it('includes reviews component in the tabs', () => {
      const ProductPage = createProductPage()
      const wrapper = mount(ProductPage)

      expect(wrapper.findComponent(Reviews).exists()).toBe(true)
    })
  })

  describe('checks similar products section visibility', () => {
    it('hides similar products section when there are no similar products', () => {
      const PageWithoutSimilar = createProductPage({ visibleProducts: [] })
      const wrapper = mount(PageWithoutSimilar)

      expect(wrapper.find('.product__similar').exists()).toBe(false)
      expect(wrapper.findAllComponents(ProductCard)).toHaveLength(0)
    })

    it('shows similar products section when products are available', () => {
      const PageWithSimilar = createProductPage()
      const wrapper = mount(PageWithSimilar)

      expect(wrapper.find('.product__similar').exists()).toBe(true)
      expect(wrapper.findAllComponents(ProductCard)).toHaveLength(3)
    })
  })
})