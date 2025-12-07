<template>
  <div class="account">
    <h1 class="account__title">My account</h1>
    <div class="account__container">
      <AuthTabs v-model="activeTab" />

      <div class="account__forms">
        <AuthSignInForm v-if="activeTab === Tabs.SIGNIN" />
        <AuthRegisterForm v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Tabs } from '@/enums/authTabs.enum'

  definePageMeta({
    middleware: 'guest',
  })

  const activeTab = ref<Tabs>(Tabs.SIGNIN)
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
