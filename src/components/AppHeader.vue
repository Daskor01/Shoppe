<template>
  <header class="header">
    <div class="header__container">
      <NuxtLink to="/" class="header__logo">
        <img src="../assets/Logo.png" alt="Logo" class="header__logo-image" />
      </NuxtLink>

      <div class="header__nav-container">
        <nav class="header__nav">
          <NuxtLink to="/" class="header__link">Shop</NuxtLink>
          <NuxtLink to="/" class="header__link">Blog</NuxtLink>
          <NuxtLink to="/" class="header__link">Our Story</NuxtLink>
        </nav>

        <div class="header__divider" />

        <div class="header__icons">
          <button type="button" class="header__icons-button">
            <IconSearch />
          </button>
          <button type="button" class="header__icons-button">
            <IconCart />
          </button>
          <button type="button" class="header__icons-button">
            <IconUser />
          </button>
        </div>
      </div>

      <div class="header__buttons-container">
        <button class="header__button">
          <IconCart />
        </button>

        <button type="button" class="header__button" @click="toggleMenu">
          <IconMenu />
        </button>
      </div>
    </div>

    <div class="header__mobile-menu" v-if="mobileOpen">
      <SearchInput />
      <nav class="header__mobile-nav">
        <NuxtLink to="/" class="header__mobile-link">Home</NuxtLink>
        <NuxtLink to="/" class="header__mobile-link">Shop</NuxtLink>
        <NuxtLink to="/" class="header__mobile-link">About</NuxtLink>
        <NuxtLink to="/" class="header__mobile-link">Blog</NuxtLink>
        <NuxtLink to="/" class="header__mobile-link">Help</NuxtLink>
        <NuxtLink to="/" class="header__mobile-link">Contact</NuxtLink>
        <NuxtLink to="/" class="header__mobile-link">Search</NuxtLink>
      </nav>
      <div class="header__separator"></div>
      <div class="header__mobile-nav">
        <NuxtLink to="/" class="header__mobile-link">
          <IconAccount />
          My account
        </NuxtLink>
        <NuxtLink to="/" class="header__mobile-link">
          <IconLogout />
          Logout
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import SearchInput from "@/components/ui/SearchInput.vue";
import { watch } from "vue";

const mobileOpen = ref(false);
const toggleMenu = () => {
  mobileOpen.value = !mobileOpen.value;
};

onMounted(() => {
  watch(mobileOpen, (isOpen) => {
    document.body.classList.toggle("no-scroll", isOpen);
  });
});
</script>

<style scoped lang="scss">
@use "@/assets/scss/variables";

.header {
  position: sticky;
  inline-size: 100%;
  margin: 23px auto;
  background-color: transparent;

  &__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
  }

  &__nav-container {
    display: none;
  }

  &__divider {
    inline-size: 1px;
    block-size: 24px;
    background-color: $color-dark;
    margin: 0 2rem;
  }

  &__nav {
    display: flex;
    gap: 20px;
  }

  &__link {
    text-decoration: none;
    color: $color-dark;
    transition: 0.3s;

    &:hover {
      opacity: 0.5;
    }
  }

  &__icons-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      opacity: 0.5;
    }
  }

  &__buttons-container {
    display: flex;
    gap: 16px;
  }

  &__button {
    display: block;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      opacity: 0.5;
    }
  }

  &__mobile-menu {
    overflow: auto;
    inset: 0;
    background-color: $color-light;
  }

  &__mobile-nav {
    display: flex;
    flex-direction: column;
    align-items: start;
    row-gap: 24px;
    padding-block: 40px;
  }

  &__mobile-link {
    font-size: 20px;
    line-height: 130%;
    text-decoration: none;
    color: $color-dark;
    transition: 0.3s;

    &:hover {
      opacity: 0.5;
    }
  }

  &__separator {
    inline-size: 100%;
    block-size: 1px;
    background-color: $color-dark;
    margin-block: 30px 15px;
  }

  @media (min-width: $breakpoints-s) {
    &__nav-container {
      display: flex;
      align-items: center;
    }

    &__buttons-container {
      display: none;
    }
  }

  @media (max-width: $breakpoints-xs) {
    margin: 0 auto;

    &__logo-image {
      inline-size: 100px;
      block-size: auto;
    }
  }
}
</style>
