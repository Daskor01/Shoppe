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

          <button type="button" class="header__user-button" @click="handleUserAction">
            <IconUser />
            <span v-if="isAuthenticated" class="header__user-indicator"></span>
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

    <BaseSlidePanel
      v-model="mobileOpen"
      :top-offset="`${headerHeight}px`"
      :show-close-button="false"
    >
      <BaseSearchInput />
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
        <NuxtLink to="/account" class="header__mobile-link">
          <IconAccount />
          My account
        </NuxtLink>

        <button
          v-if="isAuthenticated"
          class="header__mobile-link header__mobile-link--button"
          @click="handleLogout"
        >
          <IconLogout />
          Logout
        </button>

        <NuxtLink v-else to="/account" class="header__mobile-link">
          <IconAddAccount />
          Sign In
        </NuxtLink>
      </div>
    </BaseSlidePanel>
  </header>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import BaseSearchInput from '@/components/ui/base/BaseSearchInput.vue'
  import { navigationLinks, headerLinks, headerActions } from '@/config/navigation'
  import BaseSlidePanel from '@/components/ui/base/BaseSlidePanel.vue'
  import IconCart from '@/components/icons/IconCart.vue'
  import IconMenu from '@/components/icons/IconMenu.vue'
  import IconClose from '@/components/icons/IconClose.vue'
  import { useCartStore } from '@/stores/useCartStore'
  import { useAuthStore } from '@/stores/useAuthStore'
  import { useNotification } from '@/composables/useNotification'
  import IconUser from '@/components/icons/IconUser.vue'
  import IconAddAccount from '@/components/icons/IconAddAccount.vue'
  import { useRoute } from 'vue-router'

  const cartStore = useCartStore()
  const authStore = useAuthStore()
  const { notify } = useNotification()
  const route = useRoute()

  const mobileOpen = ref(false)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const userMenuOpen = ref(false)

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
    }
  }

  const handleUserAction = () => {
    if (isAuthenticated.value) {
      handleLogout()
    } else {
      navigateTo('/account')
    }
  }

  const handleLogout = () => {
    authStore.logout()
    notify({
      message: 'You have been successfully logged out',
      type: 'success',
    })
    userMenuOpen.value = false
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

  const closeMobileMenu = () => {
    mobileOpen.value = false
  }

  watch(
    () => route.path,
    () => {
      closeMobileMenu()
    },
  )

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
    margin-block: 48px 36px;
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
      block-size: 17px;
      margin: 0 46px;
      background-color: vars.$color-gray;
    }

    &__nav {
      display: flex;
      gap: 64px;
    }

    &__link {
      color: vars.$color-dark;
      text-decoration: none;
      transition: 0.3s;

      &:hover {
        opacity: 0.5;
      }
    }

    &__icons {
      display: flex;
      gap: 28px;
      align-items: center;
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

    &__user-button {
      @include mixins.reset-appearance;

      position: relative;
      border: none;
    }

    &__user-indicator {
      position: absolute;
      top: -4px;
      left: -4px;
      width: 8px;
      height: 8px;
      background-color: #10b981;
      border: 1px solid white;
      border-radius: 50%;

      &--mobile {
        top: 2px;
        right: 2px;
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
      @include mixins.flexCenter;

      gap: 10px;
      font-size: 20px;
      line-height: 130%;
      color: vars.$color-dark;
      text-decoration: none;
      transition: 0.3s;

      &:hover {
        opacity: 0.5;
      }

      &--button {
        @include mixins.reset-appearance;

        max-width: fit-content;
        font-size: 20px;
        border: none;
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
