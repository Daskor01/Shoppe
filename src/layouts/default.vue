<template>
  <div class="container">
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

<style lang="scss">
  .container {
    inline-size: 100%;
    margin: 0 auto;
    max-inline-size: 1680px;
    padding: 0 120px;

    @media (max-width: vars.$breakpoints-xxl) {
      max-inline-size: 1248px;
      padding: 0 96px;
    }

    @media (max-width: vars.$breakpoints-xl) {
      max-inline-size: 936px;
      padding: 0 36px;
    }

    @media (max-width: vars.$breakpoints-l) {
      max-inline-size: 696px;
      padding: 0 36px;
    }

    @media (max-width: vars.$breakpoints-m) {
      inline-size: calc(100% - 32px);
      padding: 0 16px;
    }
  }
</style>
