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

    &__checkbox {
      opacity: 0;
      inline-size: 0;
      block-size: 0;

      &:checked + .switch__slider {
        background-color: #4cd964;

        &::before {
          transform: translateX(18px);
        }
      }
    }

    &__slider {
      position: absolute;
      cursor: pointer;
      background-color: #ccc;
      border-radius: 34px;
      inset: 0;
      transition: background-color 0.4s;

      &::before {
        position: absolute;
        content: '';
        block-size: 18px;
        inline-size: 18px;
        inset-inline-start: 3px;
        inset-block-end: 3px;
        background-color: white;
        border-radius: 50%;
        transition: transform 0.4s;
      }
    }
  }
</style>
