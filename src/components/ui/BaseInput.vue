<template>
  <div class="base-input">
    <input
      v-bind="attrs"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :value="modelValue"
      :class="{ 'is-error': error }"
      ref="inputRef"
      class="base-input__input"
      @input="onInput"
    />
    <p v-if="error" class="base-input__error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    type InputTypeHTMLAttribute,
    useAttrs,
    watch,
    defineExpose,
    defineModel,
  } from 'vue'
  import { useDebouncedValue } from '@/composables/useDebouncedValue'

  const attrs = useAttrs()
  const inputRef = ref<HTMLInputElement | null>(null)
  defineExpose({ inputRef })

  interface Props {
    type?: InputTypeHTMLAttribute
    name: string
    placeholder?: string
    error?: string
    debounce?: number
  }

  const props = defineProps<Props>()

  const model = defineModel<string>()

  const localValue = ref(model.value ?? '')
  watch(model, (val) => {
    localValue.value = val ?? ''
  })

  const debounced = useDebouncedValue(localValue, props.debounce ?? 100)
  watch(debounced, (val) => {
    model.value = val
  })

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    localValue.value = target.value
  }
</script>

<style scoped lang="scss">
  .base-input {
    position: relative;

    &__input {
      background-color: transparent;
      border: none;
      outline: none;
      display: inline-block;
      font-size: 16px;
      block-size: 30px;
      cursor: pointer;
      inline-size: 100%;
    }

    &__error {
      position: absolute;
      top: -10px;
      left: 2px;
      font-size: 12px;
      color: vars.$color-accent-red;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 10px;
      }
    }
  }
</style>
