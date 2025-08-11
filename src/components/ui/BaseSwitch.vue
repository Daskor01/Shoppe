<template>
  <label class="switch">
    <input
      :checked="checked"
      type="checkbox"
      class="switch__checkbox"
      @change="checked = !checked"
    />
    <span class="switch__slider"></span>
  </label>
</template>

<script setup lang="ts">
  const checked = defineModel<boolean>()
</script>

<style lang="scss" scoped>
  .switch {
    position: relative;
    display: inline-block;
    inline-size: 42px;
    block-size: 24px;
    
    &__slider {
      position: absolute;
      inset: 0;
      cursor: pointer;
      background-color: #ccc;
      border-radius: 34px;
      transition: background-color 0.4s;

      &::before {
        position: absolute;
        inset-block-end: 3px;
        inset-inline-start: 3px;
        inline-size: 18px;
        block-size: 18px;
        content: '';
        background-color: vars.$color-light;
        border-radius: 50%;
        transition: transform 0.4s;
      }
    }
    
    &__checkbox {
      inline-size: 0;
      block-size: 0;
      opacity: 0;

      &:checked + .switch__slider {
        background-color: #4cd964;

        &::before {
          transform: translateX(18px);
        }
      }
    }

  }
</style>
