<template>
  <div class="base-select">
    <select
      :value="modelValue"
      class="base-select__native"
      @change="model = ($event.target as HTMLSelectElement).value"
    >
      <option v-if="placeholder" value="" disabled hidden>
        {{ placeholder }}
      </option>

      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <IconBaseArrowDown class="base-select__icon" />
  </div>
</template>

<script setup lang="ts">
  import IconBaseArrowDown from '@/components/icons/IconBaseArrowDown.vue'

  const model = defineModel<string>()

  defineProps<{
    options: { value: string; label: string }[]
    placeholder?: string
  }>()
</script>

<style scoped lang="scss">
  .base-select {
    position: relative;

    &__native {
      inline-size: 100%;
      padding: 12px 16px;
      font-size: 14px;
      appearance: none;
      cursor: pointer;
      border: 1px solid vars.$color-ligth-gray;
      border-radius: 4px;
    }

    &__icon {
      position: absolute;
      top: 50%;
      right: 20px;
      pointer-events: none;
      transform: translateY(-50%);
    }
  }
</style>
