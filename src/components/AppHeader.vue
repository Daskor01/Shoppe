<template>
  <header ref="headerRef" class="header">
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
        <button
          v-for="btn in headerButtons"
          :key="btn.key"
          class="header__button"
          @click="btn.action?.()"
        >
          <component :is="btn.altIcon && mobileOpen ? btn.altIcon : btn.icon" />
        </button>
      </div>
    </div>

    <SlidePanel v-model="mobileOpen" :top-offset="`${headerHeight}px`" :show-close-button="false">
      <SearchInput />
      <nav class="header__mobile-nav">
        <NuxtLink
          v-for="link in navigationLinks"
          :key="link.name"
          :to="link.path"
          class="header__mobile-link"
        >
          {{ link.name }}
        </NuxtLink>
      </nav>
      <div class="header__separator"></div>
      <div class="header__mobile-nav">
        <NuxtLink
          v-for="(link, index) in mobileLinks"
          :key="index"
          :to="link.path"
          class="header__mobile-link"
        >
          <component :is="link.icon" />
          {{ link.name }}
        </NuxtLink>
      </div>
    </SlidePanel>
  </header>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import SearchInput from '@/components/ui/SearchInput.vue'
  import { navigationLinks, headerLinks, headerActions, mobileLinks } from '@/config/navigation'
  import SlidePanel from '@/components/ui/SlidePanel.vue'
  import IconCart from '@/components/icons/IconCart.vue'
  import IconMenu from '@/components/icons/IconMenu.vue'
  import IconClose from '@/components/icons/IconClose.vue'
  import { useCartStore } from '@/stores/useCartStore'

  const cartStore = useCartStore()

  const mobileOpen = ref(false)

  const toggleMenu = () => {
    mobileOpen.value = !mobileOpen.value
  }

  const toggleCart = () => {
    cartStore.toggleCart()
  }

  const headerButtons = [
    {
      icon: IconCart,
      action: toggleCart,
      key: 'cart',
    },
    {
      icon: IconMenu,
      altIcon: IconClose,
      action: toggleMenu,
      key: 'menu',
    },
  ]

  function handleAction(action: string) {
    switch (action) {
      case 'openSearch':
        console.log('Поиск открыт')
        break
      case 'openCart':
        toggleCart()
        break
      case 'openUser':
        console.log('Профиль открыт')
        break
    }
  }

  //Определяем высоту header
  const headerRef = ref<HTMLElement | null>(null)
  const headerHeight = ref(0)

  function updateHeaderHeight() {
    const header = headerRef.value
    if (header) {
      const rect = header.getBoundingClientRect()
      const style = window.getComputedStyle(header)
      const marginTop = parseFloat(style.marginTop) || 0
      headerHeight.value = rect.height + marginTop
    }
  }

  onMounted(() => {
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateHeaderHeight)
  })
</script>

<style scoped lang="scss">
  .header {
    position: sticky;
    z-index: 2000;
    inline-size: 100%;
    margin: 24px auto;
    background-color: transparent;

    &__container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
    }

    &__nav-container {
      display: none;
    }

    &__divider {
      inline-size: 1px;
      block-size: 24px;
      margin: 0 2rem;
      background-color: vars.$color-dark;
    }

    &__nav {
      display: flex;
      gap: 20px;
    }

    &__link {
      color: vars.$color-dark;
      text-decoration: none;
      transition: 0.3s;

      &:hover {
        opacity: 0.5;
      }
    }

    &__icons-button {
      cursor: pointer;
      background-color: transparent;
      border: none;
      transition: 0.3s;

      &:hover {
        opacity: 0.5;
      }
    }

    &__buttons-container {
      display: flex;
      gap: 18px;
    }

    &__button {
      display: block;
      cursor: pointer;
      background-color: transparent;
      border: none;
      transition: 0.3s;

      &:hover {
        opacity: 0.5;
      }
    }

    &__mobile-nav {
      display: flex;
      flex-direction: column;
      row-gap: 24px;
      align-items: start;
      padding-block: 40px;
    }

    &__mobile-link {
      font-size: 20px;
      line-height: 130%;
      color: vars.$color-dark;
      text-decoration: none;
      transition: 0.3s;

      &:hover {
        opacity: 0.5;
      }
    }

    &__separator {
      inline-size: 100%;
      block-size: 1px;
      margin-block: 30px 16px;
      background-color: vars.$color-dark;
    }

    @media (min-width: vars.$breakpoints-s) {
      &__nav-container {
        display: flex;
        align-items: center;
      }

      &__buttons-container {
        display: none;
      }
    }

    @media (max-width: vars.$breakpoints-xs) {
      margin: 0 auto;

      &__logo-image {
        inline-size: 100px;
        block-size: auto;
      }
    }
  }
</style>
