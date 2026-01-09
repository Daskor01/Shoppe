<template>
  <div class="base-select">
    <select
      :id="uid"
      v-model="model"
      v-bind="$attrs"
      :class="['base-select__native', { 'base-select__native--placeholder': !model && placeholder }]"
      :aria-label="placeholder"
    >
      <option 
        v-if="placeholder" 
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
    
    <IconBaseArrowDown 
      class="base-select__icon" 
      aria-hidden="true" 
    />
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import IconBaseArrowDown from '@/components/icons/IconBaseArrowDown.vue'

defineOptions({
  inheritAttrs: false
})

interface Option {
  value: string | number
  label: string
}

const props = defineProps<{
  options: Option[]
  placeholder?: string
}>()

const model = defineModel<string | number>()

const uid = useId()
</script>

<style scoped lang="scss">
  .base-select {
    position: relative;
    display: flex;

    &__native {
      inline-size: 100%;
      block-size: 54px;
      box-sizing: border-box;
      padding: 12px 16px;
      font-size: 14px;
      line-height: 1.2;
      appearance: none;
      cursor: pointer;
      background-color: transparent;
      border: 1px solid vars.$color-ligth-gray;
      border-radius: 4px;
      transition: border-color 0.2s;

      &--placeholder {
        color: vars.$color-gray;
      }
    }

    &__icon {
      position: absolute;
      top: 50%;
      right: 20px;
      pointer-events: none;
      transform: translateY(-50%);
      transition: transform 0.2s;
    }
  }
</style>