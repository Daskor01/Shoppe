<template>
  <div class="tabs-accordion">
    <div v-if="!isMobile" class="tabs-accordion__tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['tabs-accordion__tab', { 'tabs-accordion__tab-active': activeIndex === index }]"
        @click="activeIndex = index"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tabs-accordion__divider"></div>

    <div v-if="!isMobile" class="tabs-accordion__tab-content">
      <slot :name="tabs[activeIndex].name" />
    </div>

    <div v-if="isMobile" class="tabs-accordion__accordion">
      <div v-for="(tab, index) in tabs" :key="index" class="tabs-accordion__accordion-item">
        <button class="tabs-accordion__accordion-header" @click="toggleAccordion(index)">
          {{ tab.label }}
          <span
            class="tabs-accordion__arrow"
            :class="{ 'tabs-accordion__arrow-open': openIndex === index }"
          >
            <IconBaseArrowDown />
          </span>
        </button>
        <div v-show="openIndex === index" class="tabs-accordion__accordion-content">
          <slot :name="tab.name" />
        </div>
      </div>
      <div class="tabs-accordion__divider"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import IconBaseArrowDown from '@/components/icons/IconBaseArrowDown.vue'
  import { TABLET_BREAKPOINT } from '@/constants/breakpoints'
  import { ref } from 'vue'

  interface Tab {
    label: string
    name: string
  }

  defineProps<{
    tabs: Tab[]
  }>()

  const activeIndex = ref(0)
  const openIndex = ref<number | null>(null)

  const { isBelow: isMobile } = useBreakpoint(TABLET_BREAKPOINT)

  const toggleAccordion = (index: number) => {
    openIndex.value = openIndex.value === index ? null : index
  }
</script>

<style lang="scss" scoped>
  .tabs-accordion {
    &__tabs {
      display: flex;
      width: 50%;
      justify-content: space-between;
    }

    &__tab {
      padding: 0;
      cursor: pointer;
      border: none;
      background: transparent;
      color: vars.$color-gray;
      position: relative;

      &-active {
        color: vars.$color-dark;

        &::after {
          content: '';
          display: block;
          position: absolute;
          inset-block-end: -18px;
          height: 2px;
          background-color: vars.$color-dark;
          width: 100%;
        }
      }
    }

    &__divider {
      height: 1px;
      background-color: vars.$color-ligth-gray;
      margin: 1rem 0;
    }

    &__tab-content {
      margin-top: 1rem;
    }

    &__accordion {
      &-header {
        width: 100%;
        text-align: left;
        padding: 0.75rem 1rem;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      &-content {
        padding: 0.75rem 1rem;
      }
    }

    &__arrow {
      transition: transform 0.3s;

      &-open {
        transform: rotate(180deg);
      }
    }
  }
</style>
