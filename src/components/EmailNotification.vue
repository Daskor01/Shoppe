<template>
  <BaseNotification v-model="model" :message="message" :type="type">
    <template #close>
      <button class="close-button" @click="model = false">
        <IconClose />
      </button>
    </template>
  </BaseNotification>
</template>

<script setup lang="ts">
  import BaseNotification from '@/components/ui/BaseNotification.vue'
  import IconClose from '@/components/icons/IconClose.vue'

  const model = defineModel<boolean>()

  const props = withDefaults(
    defineProps<{
      message: string
      type?: 'success' | 'error' | 'warning' | 'info'
    }>(),
    {
      type: 'info',
    },
  )
</script>

<style scoped>
  .close-button {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
