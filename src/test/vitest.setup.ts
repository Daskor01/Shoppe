import '@/test/mocks/overrides/swiper'
import { vi } from 'vitest'
import { routeMock } from '@/test/mocks/router.mock'
import '@/test/mocks/stores/useProductStore.mock'
import { initWindowWidth } from '@/test/helpers/window'

initWindowWidth();

export const fetchApiMock = vi.fn();
(globalThis as Record<string, unknown>).fetchApiMock = fetchApiMock;

vi.mock('@/composables/useApi', () => ({
  useApi: () => ({
    fetchApi: (globalThis as Record<string, unknown>).fetchApiMock,
  }),
}))

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')

  return {
    ...actual,

    useRoute: () => routeMock,

    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
    }),
  }
})



