<template>
  <header class="header" ref="headerRef">
    <div class="header__container">
      <NuxtLink to="/" class="header__logo">
        <img src="@/assets/Logo.png" alt="Logo" class="header__logo-image" />
      </NuxtLink>

      <div class="header__nav-container">
        <nav class="header__nav">
          <NuxtLink
            v-for="link in headerLinks"
            :key="link.name"
            :to="link.path"
            class="header__link"
          >
            {{ link.name }}
          </NuxtLink>
        </nav>

        <div class="header__divider" />

        <div class="header__icons">
          <button
            v-for="(item, index) in headerActions"
            :key="index"
            type="button"
            class="header__icons-button"
            @click="handleAction(item.action)"
          >
            <component :is="item.icon" />
          </button>
        </div>
      </div>

      <div class="header__buttons-container">
        <button class="header__button">
          <IconCart />
        </button>

        <button type="button" class="header__button" @click="toggleMenu">
          <IconMenu v-if="!mobileOpen" />
          <IconClose v-else />
        </button>
      </div>
    </div>

    <SlidePanel 
    v-model="mobileOpen" 
    :top-offset="`${headerHeight}px`"
    :show-close-button="false"
    >
      <SearchInput />
      <nav class="header__mobile-nav">
        <NuxtLink
          :to="link.path"
          class="header__mobile-link"
          v-for="link in navigationLinks"
          :key="link.name"
        >
          {{ link.name }}
        </NuxtLink>
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
    </SlidePanel>

  </header>
</template>

<script setup lang="ts">
import SearchInput from "@/components/ui/SearchInput.vue";
import { navigationLinks, headerLinks, headerActions } from "@/config/navigation";
import SlidePanel from "@/components/ui/SlidePanel.vue";

const mobileOpen = ref(false);
const toggleMenu = () => {
  mobileOpen.value = !mobileOpen.value;
};

function handleAction(action: string) {
  switch (action) {
    case 'openSearch':
      console.log('Поиск открыт')
      break
    case 'openCart':
      console.log('Корзина открыта')
      break
    case 'openUser':
      console.log('Профиль открыт')
      break
  }
}

//Определяем высоту header
const headerRef = ref<HTMLElement | null>(null)
const headerHeight = ref(0)

onMounted(() => {
  const header = document.querySelector('.header')
  if (header) {
    const rect = header.getBoundingClientRect()
    const style = window.getComputedStyle(header)

    const marginTop = parseFloat(style.marginTop)

    headerHeight.value = rect.height + marginTop
  }
})
</script>

<style scoped lang="scss">
.header {
  position: sticky;
  z-index: 2000;
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
    gap: 17px;
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
