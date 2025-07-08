<template>
  <div class="base-select">
    <select
      :value="modelValue"
      class="base-select__native"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option
        v-if="placeholder"
        :selected="modelValue === ''"
        value=""
        disabled
        hidden
      >
        {{ placeholder }}
      </option>

      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <IconBaseArrowDown class="base-select__icon" />
  </div>
</template>

<script setup lang="ts">
import IconBaseArrowDown from '@/components/icons/IconBaseArrowDown.vue'

defineProps<{
  modelValue: string
  options: { value: string; label: string }[]
  placeholder?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped lang="scss">
.base-select {
  position: relative;

  &__native {
    inline-size: 100%;
    padding: 12px 16px;
    border: 1px solid $color-ligth-gray; 
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    appearance: none;
  }

  &__icon {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    pointer-events: none;
  }
}
</style>
