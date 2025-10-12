import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useBreakpoint(maxWidth: number) {
  const isBelow = ref(false)

  if (import.meta.client) {
    const update = () => {
      isBelow.value = window.innerWidth < maxWidth
    }

    update()

    onMounted(() => {
      window.addEventListener('resize', update)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', update)
    })
  }

  return { isBelow }
}
