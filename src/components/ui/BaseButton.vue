<template>
  <button class="base-button">
    <slot />
  </button>
</template>

<style scoped lang="scss">
  .base-button {
    @include mixins.flexCenter;

    padding: 16px 32px;
    font-size: 1rem;
    text-decoration: none;
    cursor: pointer;
    background-color: transparent;
    border: 1px solid;
  }
</style>
