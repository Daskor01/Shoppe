import { vi } from 'vitest'

//Mock Nuxt-specific modules
vi.mock('#imports', () => ({}))
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({}),
  useState: () => ({
    value: null,
  }),
  useNuxtApp: () => ({
    $router: {
      push: vi.fn(),
    },
  }),
}))

//Mock window & localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})