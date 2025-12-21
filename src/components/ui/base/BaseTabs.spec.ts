import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTabs from '@/components/ui/base/BaseTabs.vue'

const MOCK_TABS = [
  { label: 'Product Description', name: 'description' },
  { label: 'Additional Info', name: 'additional' },
  { label: 'Customer Reviews', name: 'reviews' }
]

const MOCK_CONTENT = {
  description: 'Description',
  additional: 'Additional',
  reviews: 'Reviews'
}

describe('BaseTabs', () => {
  const createWrapper = (modelValue?: number | 0) => {
    return mount(BaseTabs, {
      props: {
        tabs: MOCK_TABS,
        modelValue: modelValue,
      },
      slots: {
        description: `<div>${MOCK_CONTENT.description}</div>`,
        additional: `<div>${MOCK_CONTENT.additional}</div>`,
        reviews: `<div>${MOCK_CONTENT.reviews}</div>`
      }
    })}

  describe('Initial render', () => {
    it('shows all tab labels to the user', () => {
      const wrapper = createWrapper()
      const tabButtons = wrapper.findAll('.base-tabs__tab')

      expect(tabButtons[0].text()).toBe('Product Description')
      expect(tabButtons[1].text()).toBe('Additional Info')
      expect(tabButtons[2].text()).toBe('Customer Reviews')
    })

    it('shows first tab content by default', () => {
      const wrapper = createWrapper()
      const content = wrapper.find('.base-tabs__content')

      expect(content.text()).toContain(MOCK_CONTENT.description)
    })

    it('highlights the active tab for user', () => {
      const wrapper = createWrapper()
      const tabButtons = wrapper.findAll('.base-tabs__tab')

      expect(tabButtons[0].classes()).toContain('base-tabs__tab--active')
      expect(tabButtons[1].classes()).not.toContain('base-tabs__tab--active')
      expect(tabButtons[2].classes()).not.toContain('base-tabs__tab--active')
    })
  })

  describe('Tab switching', () => {
    it('shows different content when user clicks another tab', async () => {
      const wrapper = createWrapper()
      const tabButtons = wrapper.findAll('.base-tabs__tab')

      await tabButtons[1].trigger('click')
      expect(wrapper.find('.base-tabs__content').text()).toContain(MOCK_CONTENT.additional)

      await tabButtons[2].trigger('click')
      expect(wrapper.find('.base-tabs__content').text()).toContain(MOCK_CONTENT.reviews)
    })

    it('highlights the clicked tab for user', async () => {
      const wrapper = createWrapper()
      const tabButtons = wrapper.findAll('.base-tabs__tab')

      await tabButtons[1].trigger('click')
      expect(tabButtons[1].classes()).toContain('base-tabs__tab--active')
      expect(tabButtons[0].classes()).not.toContain('base-tabs__tab--active')

      await tabButtons[2].trigger('click')
      expect(tabButtons[2].classes()).toContain('base-tabs__tab--active')
      expect(tabButtons[1].classes()).not.toContain('base-tabs__tab--active')
    })

    it('emits update:modelValue event when tab is clicked', async () => {
      const wrapper = createWrapper()
      const tabButtons = wrapper.findAll('.base-tabs__tab')

      await tabButtons[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])

      await tabButtons[2].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([2])
    })
  })

  describe('External control via props', () => {
    it('shows correct content when activeIndex changes externally', async () => {
      let wrapper = createWrapper(0)
      expect(wrapper.find('.base-tabs__content').text()).toContain(MOCK_CONTENT.description)
      
      wrapper = createWrapper(1)
      expect(wrapper.find('.base-tabs__content').text()).toContain(MOCK_CONTENT.additional)

      wrapper = createWrapper(2)
      expect(wrapper.find('.base-tabs__content').text()).toContain(MOCK_CONTENT.reviews)
    })
  })

  describe('Edge cases', () => {
    it('handles single tab correctly', () => {
      const wrapper = mount(BaseTabs, {
        props: {
          tabs: [{ label: 'Only Tab', name: 'single' }],
          activeIndex: 0
        },
        slots: {
          single: '<div>Single tab content</div>'
        }
      })

      const tabButtons = wrapper.findAll('.base-tabs__tab')
      expect(tabButtons).toHaveLength(1)
      expect(tabButtons[0].text()).toBe('Only Tab')
      expect(wrapper.find('.base-tabs__content').text()).toContain('Single tab content')
    })
  })
})