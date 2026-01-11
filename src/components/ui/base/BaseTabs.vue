<template>
  <div class="base-tabs">
    <div class="base-tabs__header" role="tablist" aria-label="Product information">
      <button
        v-for="(tab, index) in tabs"
        :id="`tab-${tab.name}`"
        :key="tab.name"
        type="button"
        role="tab"
        :aria-selected="modelValue === index"
        :aria-controls="`panel-${tab.name}`"
        :tabindex="modelValue === index ? 0 : -1"
        :class="['base-tabs__tab', { 'base-tabs__tab--active': modelValue === index }]"
        @click="modelValue = index"
        @keydown.left.prevent="selectPrev"
        @keydown.right.prevent="selectNext"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="base-tabs__divider" aria-hidden="true"></div>

    <div class="base-tabs__content">
      <Transition name="fade" mode="out-in">
        <div
          :id="`panel-${activeTab.name}`"
          :key="modelValue"
          role="tabpanel"
          :aria-labelledby="`tab-${activeTab.name}`"
          class="base-tabs__panel"
        >
          <slot :name="activeTab.name" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface Tab {
    label: string
    name: string
  }

  const props = defineProps<{
    tabs: Tab[],
    modelValue?: number
  }>()

  const modelValue = defineModel<number>({ default: 0 })

  const activeTab = computed(() => props.tabs[modelValue.value])

  const selectNext = () => {
    modelValue.value = (modelValue.value + 1) % props.tabs.length
  }
  const selectPrev = () => {
    modelValue.value = (modelValue.value - 1 + props.tabs.length) % props.tabs.length
  }
</script>

<style scoped lang="scss">
  .base-tabs {
    &__header {
      display: flex;
      gap: 100px;

      @media (max-width: vars.$breakpoints-m) {
        gap: 40px;
        padding-bottom: 10px;
        overflow-x: auto;
        scrollbar-width: none;

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }

    &__divider {
      height: 1px;
      margin-top: 34px;
      background-color: vars.$color-ligth-gray;

      @media (max-width: vars.$breakpoints-m) {
        margin-top: 10px;
      }
    }

    &__content {
      margin-top: 40px;
    }
  }

  .base-tabs__tab {
    position: relative;
    padding: 0;
    font-size: 20px;
    line-height: 130%;
    color: vars.$color-gray;
    white-space: nowrap;
    cursor: pointer;
    background: transparent;
    border: none;
    transition: color 0.2s ease;

    @media (max-width: vars.$breakpoints-xl) {
      font-size: 16px;
    }

    &:focus-visible {
      outline: 2px solid vars.$color-dark;
      outline-offset: 8px;
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

        @media (max-width: vars.$breakpoints-m) {
          inset-block-end: -10px;
        }
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
