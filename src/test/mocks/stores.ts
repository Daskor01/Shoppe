import { vi } from 'vitest'

export const mockAddToCart = vi.fn()
export const mockToggleCart = vi.fn()
export const mockUseCartStore = vi.fn()

export const setupStoreMocks = () => {
  vi.mock('@/stores/useCartStore', () => ({
    useCartStore: mockUseCartStore
  }))
}