<template>
  <div class="container">
    <AppHeader />
    <slot />
    <AppFooter />
    <BaseNotification :notification="notification" />
    <SlidePanel
      v-model="cartStore.isOpen"
      :mobile-only="false"
      side="right"
      class="cart-sidebar"
      :width="widthSidebar"
    >
      <ClientOnly>
        <CartSidebar />
      </ClientOnly>
    </SlidePanel>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useNotificationStore } from '@/stores/useNotificationStore'
  import { useCartStore } from '@/stores/useCartStore'
  import { computed } from 'vue'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { DESKTOP_BREAKPOINT } from '@/constants/breakpoints'

  const cartStore = useCartStore()
  const store = useNotificationStore()

  const { notification } = storeToRefs(store)

  const { isBelow: isMobile } = useBreakpoint(DESKTOP_BREAKPOINT)

  const widthSidebar = computed(() => (isMobile.value ? '320px' : '540px'))
</script>

<style lang="scss">
  .container {
    box-sizing: border-box;
    inline-size: 100%;
    max-inline-size: 1680px;
    padding: 0 120px;
    margin: 0 auto;

    @media (max-width: vars.$breakpoints-xxl) {
      max-inline-size: 1248px;
      padding: 0 40px;
    }

    @media (max-width: vars.$breakpoints-xl) {
      max-inline-size: 1160px;
    }

    @media (max-width: vars.$breakpoints-l) {
      max-inline-size: 900px;
    }

    @media (max-width: vars.$breakpoints-m) {
      padding: 0 16px;
    }
  }
</style>
