<template>
  <div class="tabs">
    <button
      class="tabs__tab"
      :class="{ 'tabs__tab--active': activeTab === 'signin' }"
      @click="activeTab = 'signin'"
    >
      Sign In
    </button>
    <button
      class="tabs__tab"
      :class="{ 'tabs__tab--active': activeTab === 'register' }"
      @click="activeTab = 'register'"
    >
      Register
    </button>
  </div>
</template>

<script setup lang="ts">
  import { type Tabs } from '@/types/Auth'

  const activeTab = defineModel<Tabs>('activeTab')
</script>

<style lang="scss" scoped>
  .tabs {
    display: flex;
    width: 100%;
    padding: 4px;
    margin-inline: auto;
    margin-top: 50px;
    background: vars.$color-ligth-gray;
    border-radius: 8px;

    @media (max-width: vars.$breakpoints-s) {
      margin-top: 12px;
    }

    &__tab {
      @include mixins.flexCenter;

      flex: 1;
      padding: 12px 16px;
      font-size: 20px;
      color: vars.$color-gray;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        opacity: 0.7;
      }

      &--active {
        color: vars.$color-dark;
        background: vars.$color-light;
      }

      @media (max-width: vars.$breakpoints-l) {
        padding: 8px;
        font-size: 16px;
      }

      @media (max-width: vars.$breakpoints-s) {
        font-size: 12px;
      }
    }
  }
</style>
