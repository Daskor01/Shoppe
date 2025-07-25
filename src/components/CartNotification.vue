<template>
  <BaseNotification v-model="model" :message="message" type="success">
    <template #close>
      <button class="view-cart-button" @click="handleViewCart">VIEW CART</button>
    </template>
  </BaseNotification>
</template>

<script setup lang="ts">
  import { useCartStore } from '@/stores/useCartStore'
  import BaseNotification from '@/components/ui/BaseNotification.vue'

  const model = defineModel<boolean>()

  defineProps<{
    message: string
  }>()

  const cartStore = useCartStore()

  function handleViewCart() {
    cartStore.toggleCart()
    model.value = false
  }
</script>

<style scoped lang="scss">
  .view-cart-button {
    border: none;
    background: none;
    color: vars.$color-accent-light;
    font-weight: bold;
    cursor: pointer;
    padding: 0;
  }
</style>
