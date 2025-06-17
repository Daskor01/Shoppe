<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="base-input"
  />
</template>

<script setup lang="ts">
defineProps<{
  type?: string;
  placeholder?: string;
  modelValue: string;
}>();
</script>

<style scoped lang="scss">
@use "@/assets/scss/variables" as *;

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
