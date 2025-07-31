<template>
  <button class="base-button">
    <slot />
  </button>
</template>

<style scoped lang="scss">
  .base-button {
    @include mixins.flexCenter;
    background-color: transparent;
    border: 1px solid;
    padding: 16px 32px;
    text-decoration: none;
    font-size: 1rem;
    cursor: pointer;
  }
</style>
