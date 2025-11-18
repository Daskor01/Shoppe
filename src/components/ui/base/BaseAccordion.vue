<template>
  <div class="base-accordion">
    <div v-for="(item, index) in items" :key="index" class="base-accordion__item">
      <button class="base-accordion__header" @click="toggleItem(index)">
        {{ item.label }}
        <span
          class="base-accordion__arrow"
          :class="{ 'base-accordion__arrow-open': openIndex === index }"
        >
          <IconBaseArrowDown />
        </span>
      </button>

      <div v-show="openIndex === index" class="base-accordion__content">
        <slot :name="item.name" />
      </div>
    </div>

    <div class="base-accordion__divider"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import IconBaseArrowDown from '@/components/icons/IconBaseArrowDown.vue'

  interface AccordionItem {
    label: string
    name: string
  }

  defineProps<{
    items: AccordionItem[]
  }>()

  const openIndex = ref<number | null>(null)

  const toggleItem = (index: number) => {
    openIndex.value = openIndex.value === index ? null : index
  }

  const openItem = defineModel<number | null>('openIndex')

  watch(openItem, (newVal) => {
    if (newVal) {
      openIndex.value = newVal
    }
  })

  watch(openIndex, (newVal) => {
    openItem.value = newVal
  })
</script>

<style scoped lang="scss">
  .base-accordion {
    @media (max-width: vars.$breakpoints-m) {
      padding-block: 16px;
      border-block: 1px solid vars.$color-ligth-gray;
    }

    &__item {
      border-bottom: 1px solid vars.$color-ligth-gray;

      @media (max-width: vars.$breakpoints-m) {
        border: none;
      }

      &:last-child {
        border-bottom: none;
      }
    }

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 8px 0;
      font-size: 12px;
      text-align: left;
      cursor: pointer;
      background: transparent;
      border: none;
      transition: color 0.2s ease;

      &:hover {
        color: vars.$color-dark;
      }
    }

    &__content {
      padding-bottom: 1rem;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 14px;
      }
    }

    &__arrow {
      transition: transform 0.3s ease;

      & > svg {
        inline-size: 10px;
        block-size: 10px;
      }

      &-open {
        transform: rotate(180deg);
      }
    }

    &__divider {
      height: 1px;
      margin: 1rem 0;
      background-color: vars.$color-ligth-gray;

      @media (max-width: vars.$breakpoints-m) {
        display: none;
      }
    }
  }
</style>
