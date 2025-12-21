<template>
  <div class="base-tabs">
    <div class="base-tabs__header">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['base-tabs__tab', { 'base-tabs__tab--active': activeIndex === index }]"
        @click="setActiveTab(index)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="base-tabs__divider"></div>

    <div class="base-tabs__content">
      <slot :name="activeTab.name" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'

  interface Tab {
    label: string
    name: string
  }

  const props = defineProps<{
    tabs: Tab[],
    modelValue?: number
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number):void
  }>()

  const activeIndex = ref(props.modelValue ?? 0)

  const activeTab = computed(() => props.tabs[activeIndex.value])

  const setActiveTab = (index: number) => {
    activeIndex.value = index
    emit('update:modelValue', index)
  }

  watch(() => props.modelValue, (newVal) => {
    if (newVal !== undefined && newVal !== activeIndex.value) {
      activeIndex.value = newVal
    }
  })
</script>

<style scoped lang="scss">
  .base-tabs {
    &__header {
      display: flex;
      gap: 100px;
    }

    &__tab {
      position: relative;
      padding: 0;
      font-size: 20px;
      line-height: 130%;
      color: vars.$color-gray;
      cursor: pointer;
      background: transparent;
      border: none;
      transition: color 0.2s ease;

      @media (max-width: vars.$breakpoints-xl) {
        font-size: 16px;
      }

      &:hover {
        color: vars.$color-dark;
      }

      &--active {
        color: vars.$color-dark;

        &::after {
          position: absolute;
          inset-block-end: -34px;
          display: block;
          width: 100%;
          height: 2px;
          content: '';
          background-color: vars.$color-dark;
        }
      }
    }

    &__divider {
      height: 1px;
      margin-top: 34px;
      background-color: vars.$color-ligth-gray;
    }

    &__content {
      margin-top: 40px;
      line-height: 170%;
    }
  }
</style>
