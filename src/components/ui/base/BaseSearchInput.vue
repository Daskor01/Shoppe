<template>
  <div class="search">
    <input v-model="search" type="text" class="search__input" placeholder="Search" />
    <IconSearchMobile v-if="!search" class="search__icon" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import IconSearchMobile from '@/components/icons/IconSearchMobile.vue'

  const search = ref('')
</script>

<style lang="scss" scoped>
  .search {
    position: relative;

    &__input {
      inline-size: 100%;
      block-size: 32px;
      padding: 0 10px;
      box-sizing: border-box;
      background-color: vars.$color-ligth-gray;
      border: none;
      border-radius: 4px;

      &::placeholder {
        padding-inline-start: 20px;
      }
    }

    &__icon {
      position: absolute;
      inset: 10px 0 10px 10px;
    }
  }
</style>
