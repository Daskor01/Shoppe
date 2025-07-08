<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :value="model"
    class="base-input"
    @input="onInput"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebouncedValue } from '@/composables/useDebouncedValue';

const model = defineModel<string>()

const props = defineProps<{
  type?: string
  placeholder?: string
  debounce?: number
}>()

const localValue = ref(model.value ?? '')

watch(model, (val) => {
  localValue.value = val ?? ''
})

const debounced = useDebouncedValue(localValue, props.debounce ?? 100)

watch(debounced, (val) => {
  model.value = val
})


function onInput(event: Event) {
  localValue.value = (event.target as HTMLInputElement).value
}
</script>


<style scoped lang="scss">
  .base-input {
    background-color: transparent;
    border: none;
    outline: none;
    display: inline-block;
    font-size: 16px;
    block-size: 30px;
    cursor: pointer;
    inline-size: 100%;
  }
</style>
