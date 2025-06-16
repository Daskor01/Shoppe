<template>
  <label class="ios-switch">
    <input
      type="checkbox"
      class="ios-switch__checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', modelValue)"
    />
    <span class="slider"></span>
  </label>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});
defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped>
.ios-switch {
  position: relative;
  display: inline-block;
  inline-size: 42px;
  block-size: 24px;

  &__checkbox {
    opacity: 0;
    inline-size: 0;
    block-size: 0;

    &:checked + .slider {
      background-color: #4cd964;

      &::before {
        transform: translateX(18px);
      }
    }
  }

  .slider {
    position: absolute;
    cursor: pointer;
    background-color: #ccc;
    border-radius: 34px;
    inset: 0;
    transition: background-color 0.4s;

    &::before {
      position: absolute;
      content: "";
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
