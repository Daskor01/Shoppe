<template>
  <div class="range-slider">
    <div class="range-slider__track">
      <div
        class="range-slider__range"
        :style="{
          left: ((modelValue[0] - min) / (max - min)) * 100 + '%',
          width: ((modelValue[1] - modelValue[0]) / (max - min)) * 100 + '%',
        }"
      ></div>

      <input
        type="range"
        :min="min"
        :max="max"
        v-model.number="localMin"
        @input="onMinChange"
        class="thumb thumb--left"
      />
      <input
        type="range"
        :min="min"
        :max="max"
        v-model.number="localMax"
        @input="onMaxChange"
        class="thumb thumb--right"
      />
    </div>
    <div class="range-slider__text-container">
      <span>Price: ${{ modelValue[0] }} – ${{ modelValue[1] }}</span>
      <button @click="emit('apply')" class="filter-button">Filter</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, defineProps, defineEmits, ref } from "vue";

const props = defineProps<{
  modelValue: [number, number];
  min?: number;
  max?: number;
  step?: number;
}>();

const emit = defineEmits(["update:modelValue", "apply"]);

const min = props.min ?? 0;
const max = props.max ?? 1000;
const step = props.step ?? 1;

const localMin = ref(props.modelValue[0]);
const localMax = ref(props.modelValue[1]);

watch(
  () => props.modelValue,
  ([newMin, newMax]) => {
    localMin.value = newMin;
    localMax.value = newMax;
  },
);

function onMinChange() {
  if (localMin.value >= localMax.value - step) {
    localMin.value = localMax.value - step;
  }
  emit("update:modelValue", [localMin.value, localMax.value]);
}

function onMaxChange() {
  if (localMax.value <= localMin.value + step) {
    localMax.value = localMin.value + step;
  }
  emit("update:modelValue", [localMin.value, localMax.value]);
}
</script>

<style scoped lang="scss">
.range-slider {
  position: relative;
  padding-block: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__text-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.range-slider__header {
  display: flex;
  justify-content: space-between;
  margin-block-end: 0.5rem;
}

.range-slider__track {
  position: relative;
  block-size: 4px;
  background-color: #ccc;
  border-radius: 2px;
}

.range-slider__range {
  position: absolute;
  block-size: 100%;
  background-color: #000000;
  border-radius: 2px;
}

input[type="range"] {
  position: absolute;
  inline-size: 100%;
  block-size: 0;
  pointer-events: none;
  -webkit-appearance: none;
  background: none;
  z-index: 2;
}

input[type="range"]::-webkit-slider-thumb {
  pointer-events: all;
  inline-size: 4px;
  block-size: 10px;
  background-color: #000000;
  border: none;
  -webkit-appearance: none;
}

.filter-button {
  background: transparent;
  border: none;
  color: $color-accent-light;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.7;
  }
}

.thumb--left {
  inset-inline-start: -3px;
}
</style>
