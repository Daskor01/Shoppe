<template>
  <div class="account">
    <h1 class="account__title">My account</h1>
    <div class="account__container">
      <div class="account__tabs">
        <button
          class="account__tab"
          :class="{ 'account__tab--active': activeTab === 'signin' }"
          @click="activeTab = 'signin'"
        >
          Sign In
        </button>
        <button
          class="account__tab"
          :class="{ 'account__tab--active': activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
          Register
        </button>
      </div>

      <div class="account__forms">
        <AuthSignInForm v-if="activeTab === 'signin'" />
        <AuthRegisterForm v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: ['guest'],
  })

  const activeTab = ref<'signin' | 'register'>('signin')
</script>

<style scoped lang="scss">
  .account {
    @include mixins.flexCenter;

    flex-direction: column;
    margin-top: 50px;

    @media (max-width: vars.$breakpoints-l) {
      margin-top: 30px;
    }

    &__container {
      width: 100%;
      max-width: 500px;

      @media (max-width: vars.$breakpoints-l) {
        max-width: 360px;
      }

      @media (max-width: vars.$breakpoints-s) {
        max-width: 288px;
      }
    }

    &__title {
      font-size: 34px;
      font-weight: 500;
      text-align: center;

      @media (max-width: vars.$breakpoints-l) {
        font-size: 28px;
      }

      @media (max-width: vars.$breakpoints-s) {
        font-size: 20px;
      }
    }

    &__tabs {
      display: flex;
      width: 100%;
      padding: 4px;
      margin-inline: auto;
      margin-top: 50px;
      background: vars.$color-ligth-gray;
      border-radius: 8px;

      @media (max-width: vars.$breakpoints-s) {
        margin-top: 12px;
      }
    }

    &__tab {
      @include mixins.flexCenter;

      flex: 1;
      padding: 12px 16px;
      font-size: 20px;
      color: vars.$color-gray;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        opacity: 0.7;
      }

      &--active {
        color: vars.$color-dark;
        background: vars.$color-light;
      }

      @media (max-width: vars.$breakpoints-l) {
        padding: 8px;
        font-size: 16px;
      }

      @media (max-width: vars.$breakpoints-s) {
        font-size: 12px;
      }
    }

    &__forms {
      min-height: 300px;
      margin-top: 70px;

      @media (max-width: vars.$breakpoints-l) {
        margin-top: 40px;
      }

      @media (max-width: vars.$breakpoints-s) {
        margin-top: 72px;
      }
    }
  }
</style>
