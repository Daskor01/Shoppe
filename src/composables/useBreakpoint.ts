import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useBreakpoint(maxWidth: number) {
  const isBelow = ref(false)

  const update = () => {
    isBelow.value = window.innerWidth < maxWidth
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', update)
  })

  return { isBelow }
}
