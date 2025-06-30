<template>
  <div class="container">
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </div>
</template>

<style lang="scss">
  @use '@/assets/scss/variables';
  @use 'sass:map';

  .container {
    inline-size: calc(100% - 240px);
    margin: 0 auto;
    max-inline-size: 1680px;
    padding: 0 120px;

    @media (max-width: $breakpoints-xxl) {
      max-inline-size: 1248px;
      padding: 0 96px;
    }

    @media (max-width: $breakpoints-xl) {
      max-inline-size: 936px;
      padding: 0 36px;
    }

    @media (max-width: $breakpoints-l) {
      max-inline-size: 696px;
      padding: 0 36px;
    }

    @media (max-width: $breakpoints-m) {
      inline-size: calc(100% - 32px);
      padding: 0 16px;
    }
  }
</style>
