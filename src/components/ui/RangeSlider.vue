<template>
  <div class="range-slider">
    <div class="range-slider__track">
      <div class="range-slider__range" :style="rangeStyle" />

      <input
        type="range"
        :min="min"
        :max="max"
        v-model.number="localMin"
        @input="onMinChange"
        class="range-slider__thumb range-slider__thumb--left"
      />
      <input
        type="range"
        :min="min"
        :max="max"
        v-model.number="localMax"
        @input="onMaxChange"
        class="range-slider__thumb range-slider__thumb--right"
      />
    </div>
    <div class="range-slider__text-container">
      <span class="range-slider__text"> Price: ${{ modelValue[0] }} – ${{ modelValue[1] }} </span>
      <button class="range-slider__filter-button" @click="emit('apply')">Filter</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { watch, ref, computed } from 'vue'

  const props = defineProps<{
    modelValue: [number, number]
    min?: number
    max?: number
    step?: number
  }>()

  const rangeStyle = computed(() => {
    const [start, end] = props.modelValue
    return {
      left: ((start - min) / (max - min)) * 100 + '%',
      width: ((end - start) / (max - min)) * 100 + '%',
    }
  })

  const emit = defineEmits(['update:modelValue', 'apply'])

  const min = props.min ?? 0
  const max = props.max ?? 1000
  const step = props.step ?? 1

  const localMin = ref(props.modelValue[0])
  const localMax = ref(props.modelValue[1])

  watch(
    () => props.modelValue,
    ([newMin, newMax]) => {
      localMin.value = newMin
      localMax.value = newMax
    },
  )

  function onMinChange() {
    if (localMin.value >= localMax.value - step) {
      localMin.value = localMax.value - step
    }
    emit('update:modelValue', [localMin.value, localMax.value])
  }

  function onMaxChange() {
    if (localMax.value <= localMin.value + step) {
      localMax.value = localMin.value + step
    }
    emit('update:modelValue', [localMin.value, localMax.value])
  }
</script>

<style scoped lang="scss">
  .range-slider {
    position: relative;
    padding-block: 1rem;
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__header {
      display: flex;
      justify-content: space-between;
      margin-block-end: 0.5rem;
    }

    &__track {
      position: relative;
      block-size: 4px;
      background-color: #ccc;
      border-radius: 2px;
    }

    &__range {
      position: absolute;
      block-size: 100%;
      background-color: vars.$color-dark;
      border-radius: 2px;
    }

    &__text-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__text {
      font-weight: 400;
      font-size: 14px;
      line-height: 157%;
      color: vars.$color-gray;
    }

    &__thumb--left {
      inset-inline-start: -3px;
    }

    &__filter-button {
      background: transparent;
      border: none;
      color: vars.$color-accent-light;
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  input[type='range'] {
    position: absolute;
    inline-size: 100%;
    block-size: 0;
    pointer-events: none;
    -webkit-appearance: none;
    background: none;
    z-index: 2;
  }

  input[type='range']::-webkit-slider-thumb {
    pointer-events: all;
    inline-size: 4px;
    block-size: 10px;
    background-color: vars.$color-dark;
    border: none;
    -webkit-appearance: none;
  }
</style>
