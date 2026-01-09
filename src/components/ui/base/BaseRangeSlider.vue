<template>
  <div class="range-slider">
    <div class="range-slider__track">
      <div :style="rangeStyle" class="range-slider__range" />

      <input
        v-model.number="localMin"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="range-slider__thumb"
        aria-label="Minimum price"
        :aria-valuemin="min"
        :aria-valuemax="localMax"
        :aria-valuenow="localMin"
        @input="onMinInput"
      />

      <input
        v-model.number="localMax"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="range-slider__thumb"
        aria-label="Maximum price"
        :aria-valuemin="localMin"
        :aria-valuemax="max"
        :aria-valuenow="localMax"
        @input="onMaxInput"
      />
    </div>

    <div class="range-slider__text-container">
      <p class="range-slider__text" aria-live="polite">
        Price: <span>${{ localMin }}</span> – <span>${{ localMax }}</span>
      </p>
      <button type="button" class="range-slider__filter-button" @click="$emit('apply')">
        Filter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      modelValue: [number, number]
      min?: number
      max?: number
      step?: number
    }>(),
    {
      min: 0,
      max: 1000,
      step: 1,
    },
  )

  defineEmits<{
    (e: 'update:modelValue', value: [number, number]): void
    (e: 'apply'): void
  }>()

  const model = defineModel<[number, number]>({ required: true })

  const localMin = computed({
    get: () => model.value[0],
    set: (val) => {
      model.value = [val, model.value[1]]
    },
  })

  const localMax = computed({
    get: () => model.value[1],
    set: (val) => {
      model.value = [model.value[0], val]
    },
  })

  const rangeStyle = computed(() => {
    const start = ((model.value[0] - props.min) / (props.max - props.min)) * 100
    const end = ((model.value[1] - props.min) / (props.max - props.min)) * 100
    return {
      left: `${start}%`,
      width: `${end - start}%`,
    }
  })

  function onMinInput() {
    if (localMin.value >= localMax.value) {
      localMin.value = localMax.value - props.step
    }
  }

  function onMaxInput() {
    if (localMax.value <= localMin.value) {
      localMax.value = localMin.value + props.step
    }
  }
</script>

<style scoped lang="scss">
  .range-slider {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-block: 1rem;

    &__track {
      position: relative;
      block-size: 2px;
      background-color: #ccc;
      border-radius: 2px;
    }

    &__range {
      position: absolute;
      z-index: 1;
      block-size: 100%;
      background-color: vars.$color-dark;
      border-radius: 3px;
    }

    &__text-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__text {
      font-size: 14px;
      font-weight: 400;
      line-height: 157%;
      color: vars.$color-gray;
    }

    &__filter-button {
      color: vars.$color-accent-light;
      cursor: pointer;
      background: transparent;
      border: none;
      transition: 0.2s;

      &:hover {
        opacity: 0.7;
      }
    }

    &__thumb {
      position: absolute;
      top: 50%;
      z-index: 2;
      inline-size: 100%;
      block-size: 0;
      margin: 0;
      appearance: none;
      pointer-events: none;
      background: none;
      transform: translateY(-50%);

      &::-webkit-slider-thumb {
        inline-size: 2px;
        block-size: 10px;
        appearance: none;
        pointer-events: all;
        cursor: pointer;
        background-color: vars.$color-dark;
        border: none;
        transition: transform 0.1s;
      }

      &:active::-webkit-slider-thumb {
        transform: scaleY(1.5);
      }

      &:focus-visible::-webkit-slider-thumb {
        outline: 2px solid vars.$color-dark;
        outline-offset: 4px;
      }
    }
  }
</style>
