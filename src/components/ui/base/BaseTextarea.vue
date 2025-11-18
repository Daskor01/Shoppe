<template>
  <div class="base-textarea" :class="{ 'has-value': modelValue || isFocused }">
    <div class="base-textarea__wrapper">
      <textarea
        ref="textareaRef"
        v-bind="textareaAttrs"
        :value="modelValue"
        :class="{ 'base-textarea--error': error }"
        class="base-textarea__field"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <label class="base-textarea__label">
        {{ placeholder }}
      </label>
    </div>
    <span v-if="error" class="base-textarea__error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
  import { ref, useAttrs, computed } from 'vue'

  const attrs = useAttrs()
  const textareaRef = ref<HTMLTextAreaElement>()
  const isFocused = ref(false)

  const modelValue = defineModel<string>({ default: '' })
  const error = defineModel<string>('error', { default: '' })

  // get placeholder separately
  const placeholder = computed(() => attrs.placeholder as string)
  const textareaAttrs = computed(() => {
    // eslint-disable-next-line no-unused-vars
    const { placeholder, ...rest } = attrs
    return rest
  })

  const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    modelValue.value = target.value
  }

  defineExpose({ textareaRef })
</script>

<style scoped lang="scss">
  .base-textarea {
    position: relative;
    display: flex;
    flex-direction: column;

    &__wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    &__field {
      @include mixins.reset-appearance;

      width: 100%;
      min-height: 100px;
      padding: 12px;
      font-family: inherit;
      resize: none;
      background: transparent;
      border-radius: 4px;
      transition: border 0.2s ease;

      @media (max-width: vars.$breakpoints-m) {
        min-width: 60px;
        padding: 5px;
      }

      &:focus {
        outline: none;
      }

      &.base-textarea--error {
        border: 1px solid vars.$color-accent-red;
      }
    }

    &__label {
      position: absolute;
      top: 12px;
      left: 0;
      padding: 0;
      font-size: 1rem;
      color: #999;
      pointer-events: none;
      background-color: white;
      opacity: 0.8;
      transition: all 0.25s ease;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 12px;
      }
    }

    &.has-value &__label {
      top: -8px;
      left: 10px;
      font-size: 12px;
      color: vars.$color-dark;
      opacity: 1;

      @media (max-width: vars.$breakpoints-m) {
        left: 0;
      }
    }

    &__error {
      margin-top: 4px;
      font-size: 12px;
      color: vars.$color-accent-red;
    }
  }
</style>
