<template>
  <div class="container">
    <AppHeader />
      <slot />
    <AppFooter />
    <BaseNotification :notification="notification" />
    <BaseSlidePanel
      v-model="cartStore.isOpen"
      :mobile-only="false"
      side="right"
      class="cart-sidebar"
      :width="widthSidebar"
    >
      <ClientOnly>
        <CartSidebar />
      </ClientOnly>
    </BaseSlidePanel>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useNotificationStore } from '@/stores/useNotificationStore'
  import { useCartStore } from '@/stores/useCartStore'
  import { computed } from 'vue'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { DESKTOP_BREAKPOINT } from '@/constants/breakpoints'

  import AppHeader from '@/components/ui/layout/AppHeader.vue'
  import AppFooter from '@/components/ui/layout/AppFooter.vue'

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
    padding: 0 96px;

    @media (max-width: vars.$breakpoints-m) {
      padding: 0 16px;
    }
  }
</style>
