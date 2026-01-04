import { ref, type Ref } from 'vue'
import { vi } from 'vitest'

export const isMobileRef: Ref<boolean> = ref(false)

vi.mock('@/composables/useBreakpoint', () => ({
  useBreakpoint: () => ({
    isBelow: isMobileRef,
  }),
}))
