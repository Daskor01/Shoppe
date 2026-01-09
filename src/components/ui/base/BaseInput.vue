<template>
  <div class="base-input" :class="{ 'has-value': modelValue || isFocused }">
    <div class="base-input__wrapper">
      <input
        ref="inputRef"
        v-bind="inputAttrs"
        :value="modelValue"
        :class="{ 'base-input--error': error }"
        class="base-input__field"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <label class="base-input__label">
        {{ placeholder }}
      </label>

      <button
        v-if="clearable"
        type="button"
        class="base-input__clear"
        @click="handleClear"
        @mousedown.prevent
      >
        <IconCross />
      </button>
    </div>
    <span v-if="error" class="base-input__error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
  import { ref, useAttrs, computed } from 'vue'
  import IconCross from '@/components/icons/IconCross.vue'

  interface Props {
    clearable?: boolean
  }

  defineProps<Props>()

  const attrs = useAttrs()
  const inputRef = ref<HTMLInputElement>()
  const isFocused = ref(false)

  const modelValue = defineModel<string>({ default: '' })
  const error = defineModel<string>('error', { default: '' })

  // get placeholder separately
  const placeholder = computed(() => attrs.placeholder as string)
  const inputAttrs = computed(() => {
    // eslint-disable-next-line no-unused-vars
    const { placeholder, ...rest } = attrs
    return rest
  })

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    modelValue.value = target.value
  }

  const handleClear = () => {
    modelValue.value = ''
    inputRef.value?.focus()
  }

  defineExpose({ inputRef })
</script>

<style scoped lang="scss">
  .base-input {
    position: relative;
    display: flex;
    flex-direction: column;
    font-size: 16px;

    &__wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    &__field {
      box-sizing: border-box;
      width: 100%;
      height: 40px;
      font-size: 1rem;
      background: transparent;
      border: none;
      border-radius: 4px;
      transition: border 0.2s ease;

      @media (max-width: vars.$breakpoints-s) {
        padding: 5px;
      }

      &:focus {
        outline: none;
      }

      &.base-input--error {
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
      background-color: vars.$color-light;
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

    &__clear {
      @include mixins.reset-appearance;

      position: absolute;
      top: 50%;
      right: 0;
      border: none;
      transform: translate(-50%, -50%);
    }
  }
</style>
