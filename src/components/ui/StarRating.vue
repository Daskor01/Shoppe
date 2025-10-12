<template>
  <div class="star-rating">
    <span
      v-for="i in 5"
      :key="i"
      :class="['star', { filled: i <= currentRating }]"
      @click="selectStar(i)"
    >
      ★
    </span>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue'

  const props = defineProps<{
    modelValue?: number
    readonly?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
  }>()

  const currentRating = ref(props.modelValue ?? 0)

  watch(
    () => props.modelValue,
    (newVal) => {
      currentRating.value = newVal ?? 0
    },
  )

  const selectStar = (value: number) => {
    if (props.readonly) return
    currentRating.value = value
    emit('update:modelValue', value)
  }
</script>

<style scoped lang="scss">
  .star {
    font-size: 1.5rem;
    color: #ccc;
    cursor: pointer;
    transition: color 0.2s;

    &.filled {
      color: gold;
    }

    &-rating {
      display: flex;
      gap: 0.25rem;
    }
  }
</style>
