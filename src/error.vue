<template>
  <NuxtLayout name="default">
    <div v-if="error?.statusCode === 404" class="error">
      <h1 class="error__title">404 Error</h1>
      <p class="error__subtitle">
        This page not found. 
        Please go back to home and start again.
      </p>
      <BaseButton class="error__button" @click="handleError()"> HomePage </BaseButton>
    </div>
    <div v-else class="error">
      <h1 class="error__title">{{ error?.statusCode }}</h1>
      <p class="error__subtitle">{{ error?.statusMessage }}</p>
      <BaseButton class="error__button" @click="handleError()"> HomePage </BaseButton>
    </div>

  </NuxtLayout>
</template>

<script setup lang="ts">
  import { type NuxtError, clearError } from 'nuxt/app'

  defineProps<{
    error?: NuxtError
  }>()

  const handleError = () => clearError({ redirect: '/' })
</script>

<style scoped lang="scss">
  .error {
    @include mixins.flexCenter;

    flex-direction: column;
    margin-top: 130px;

    &__title {
      font-size: 32px;
      font-weight: 500;
      line-height: 130%;
      text-transform: uppercase;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 20px;
      }
    }

    &__subtitle {
      max-width: 400px;
      font-size: 20px;
      line-height: 130%;
      color: vars.$color-gray;
      text-align: center;

      @media (max-width: vars.$breakpoints-m) {
        max-width: 160px;
        font-size: 12px;
      }
    }

    &__button {
      min-width: 186px;
      padding: 12px;
      margin-top: 40px;
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      border-radius: 4px;
      transition: all 0.5s;

      @media (max-width: vars.$breakpoints-m) {
        min-width: 115px;
        padding: 6px;
        margin-top: 20px;
        font-size: 12px;
        font-weight: 400;
      }

      &:hover {
        color: vars.$color-light;
        background-color: vars.$color-dark;
      }
    }

    &__contact {
      margin-top: 30px;
      font-size: 14px;
      line-height: 130%;
      color: vars.$color-gray;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 12px;
      }

      &--link {
        color: vars.$color-dark;
        text-decoration: underline;
        transition: opacity 0.3s;

        &:hover {
          opacity: 0.5;
        }
      }
    }
  }
</style>
