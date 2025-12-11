<template>
  <NuxtLayout name="default">
    <div class="error">
      <h1 class="error__title">{{ title }}</h1>
      <p class="error__subtitle">{{ message }}</p>

      <BaseButton class="error__button" @click="$router.push('/')"> HomePage </BaseButton>

      <p v-if="showContact" class="error__contact">
        If the problem persists, please
        <NuxtLink to="/" class="error__contact--link"> contact us </NuxtLink>.
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useError } from '@/composables/useError'
  import { useRequestEvent } from 'nuxt/app'

  interface ErrorProps {
    statusCode?: number
    message?: string
  }

  const props = defineProps<{
    error?: ErrorProps
  }>()

  //use fallback status code 404
  const statusCode = computed(() => props.error?.statusCode || 404)
  const customMessage = computed(() => props.error?.message || 'Page not found')

  const { title, message, showContact } = useError(statusCode.value, customMessage.value)

  if (import.meta.server) {
    const event = useRequestEvent()
    if (event) {
      event.node.res.statusCode = statusCode.value
      event.node.res.statusMessage = message
    }
  }
</script>

<style scoped lang="scss">
  .error {
    @include mixins.flexCenter;
    flex-direction: column;
    margin-top: 130px;

    &__title {
      font-weight: 500;
      font-size: 32px;
      line-height: 130%;
      text-transform: uppercase;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 20px;
      }
    }

    &__subtitle {
      font-size: 20px;
      line-height: 130%;
      color: vars.$color-gray;
      max-width: 400px;
      text-align: center;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 12px;
        max-width: 160px;
      }
    }

    &__button {
      font-weight: 700;
      font-size: 16px;
      border-radius: 4px;
      margin-top: 40px;
      min-width: 186px;
      padding: 12px;
      text-transform: uppercase;
      transition: all 0.5s;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 12px;
        min-width: 115px;
        font-weight: 400;
        padding: 6px;
        margin-top: 20px;
      }

      &:hover {
        background-color: vars.$color-dark;
        color: vars.$color-light;
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
