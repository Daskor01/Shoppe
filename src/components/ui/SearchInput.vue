<template>
  <input type="text" class="search-input" placeholder="Search" />
</template>

<style lang="scss" scoped>
.search-input {
  inline-size: calc(100% - 20px);
  border: none;
  background-color: $color-ligth-gray;
  block-size: 32px;
  border-radius: 4px;
  padding: 0 10px;

  &::placeholder {
    padding-inline-start: 18px;
    background: url("@/assets/icon/icon-search.svg") no-repeat left;
  }
}
</style>
