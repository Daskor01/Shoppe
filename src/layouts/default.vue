<template>
  <div class="container">
    <AppHeader />
    <slot />
    <AppFooter />
    <BaseNotification
      :visible="visible"
      :message="message"
      :type="type"
      :buttonText="button?.text"
      :buttonHandler="button?.handler"
    />
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

  const { visible, message, type, button } = storeToRefs(store)

  const { isBelow: isMobile } = useBreakpoint(DESKTOP_BREAKPOINT)

  const widthSidebar = computed(() => (isMobile.value ? '320px' : '540px'))
</script>

<style lang="scss">
  .container {
    inline-size: 100%;
    margin: 0 auto;
    max-inline-size: 1680px;
    padding: 0 120px;

    @media (max-width: vars.$breakpoints-xxl) {
      max-inline-size: 1248px;
      padding: 0 96px;
    }

    @media (max-width: vars.$breakpoints-xl) {
      max-inline-size: 936px;
      padding: 0 36px;
    }

    @media (max-width: vars.$breakpoints-l) {
      max-inline-size: 696px;
      padding: 0 36px;
    }

    @media (max-width: vars.$breakpoints-m) {
      inline-size: calc(100% - 32px);
      padding: 0 16px;
    }
  }
</style>
