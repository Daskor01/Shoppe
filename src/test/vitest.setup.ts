import '@/test/mocks/overrides/swiper'
import { vi } from 'vitest'
import { routeMock } from '@/test/mocks/router.mock'
import '@/test/mocks/stores/useProductStore.mock'

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



