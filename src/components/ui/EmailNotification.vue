<template>
  <BaseNotification v-model="model" v-bind="attrs">
    <template #close>
      <button class="close-button" @click="model = false">
        <IconClose />
      </button>
    </template>
  </BaseNotification>
</template>

<script setup lang="ts">
  import { defineModel, useAttrs } from 'vue'
  import BaseNotification from '@/components/ui/BaseNotification.vue'
  import IconClose from '@/components/icons/IconClose.vue'

  const model = defineModel<boolean>()
  const attrs = useAttrs()
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
