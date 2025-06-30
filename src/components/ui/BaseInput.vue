<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    class="base-input"
    @input="onInput"
  />
</template>

<script setup lang="ts">
  defineProps<{
    type?: string
    placeholder?: string
    modelValue: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  function onInput(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).value)
  }
</script>

<style scoped lang="scss">
  .base-input {
    background-color: transparent;
    border: none;
    outline: none;
    display: inline-block;
    font-size: 16px;
    block-size: 30px;
    cursor: pointer;
    inline-size: 100%;
  }
</style>
