<template>
  <div class="reset-password">
    <h1 class="reset-password__title">Have you Forgotten Your Password ?</h1>
    <div class="reset-password__container">
      <p class="reset-password__subtitle">
        If you've forgotten your password, enter your e-mail address and we'll send you an e-mail
      </p>

      <form ref="formRef" class="reset-password__form" novalidate @submit.prevent="handleSubmit">
        <div class="reset-password__field">
          <BaseInput
            ref="emailInputRef"
            v-model="email"
            :error="showErrors ? errors.email : ''"
            class="reset-password__input"
            type="email"
            placeholder="Enter your email address*"
            name="email"
            required
            data-required-message="Please enter your email address"
            data-type-mismatch-message="Please enter a valid email address"
          />
        </div>

        <button type="submit" class="reset-password__button" :disabled="isLoading">
          {{ isLoading ? 'Sending...' : 'RESET PASSWORD' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useNotification } from '@/composables/useNotification'
  import { validateInput } from '@/utils/validateInput'
  import BaseInput from '@/components/ui/base/BaseInput.vue'
  import { navigateTo } from 'nuxt/app'

  definePageMeta({
    middleware: 'guest',
  })

  const formRef = ref<HTMLFormElement | null>(null)
  const emailInputRef = ref<InstanceType<typeof BaseInput> | null>(null)

  const email = ref('')
  const isLoading = ref(false)
  const showErrors = ref(false)
  const errors = reactive({
    email: '',
  })

  const { notify } = useNotification()

  const validateForm = (): boolean => {
    let isValid = true

    const emailInput = emailInputRef.value?.$el?.querySelector('input')
    const emailError = validateInput(emailInput)
    errors.email = emailError
    if (emailError) isValid = false

    return isValid
  }

  const resetForm = () => {
    email.value = ''
  }

  const handleSubmit = async () => {
    showErrors.value = true

    if (!validateForm()) {
      return
    }

    isLoading.value = true

    try {
      // Emulate API call to send reset password email
      await new Promise((resolve) => setTimeout(resolve, 1000))

      notify({
        message: 'We sent the password by email',
        type: 'success',
      })

      resetForm()
      showErrors.value = false
      errors.email = ''

      await navigateTo('/account')
    } catch (error) {
      console.error('Reset password error:', error)
      notify({
        message: 'Failed to send reset email. Please try again.',
        type: 'error',
      })
    } finally {
      isLoading.value = false
    }
  }
</script>

<style scoped lang="scss">
  .reset-password {
    @include mixins.flexCenter;

    flex-direction: column;
    width: 100%;
    margin-top: 80px;

    &__container {
      width: 100%;
      max-width: 500px;
      text-align: center;

      @media (max-width: vars.$breakpoints-s) {
        max-width: 288px;
      }
    }

    &__title {
      margin-bottom: 12px;
      font-size: 33px;
      font-weight: 500;
      text-align: center;

      @media (max-width: vars.$breakpoints-l) {
        font-size: 28px;
      }

      @media (max-width: vars.$breakpoints-s) {
        font-size: 20px;
      }
    }

    &__subtitle {
      font-size: 20px;
      line-height: 1.5;

      @media (max-width: vars.$breakpoints-l) {
        font-size: 16px;
      }

      @media (max-width: vars.$breakpoints-s) {
        font-size: 12px;
      }
    }

    &__form {
      width: 100%;
      margin-top: 76px;

      @media (max-width: vars.$breakpoints-s) {
        margin-top: 64px;
      }
    }

    &__field {
      margin-bottom: 20px;
    }

    &__input {
      border-bottom: 2px solid vars.$color-ligth-gray;
    }

    &__button {
      width: 100%;
      padding: 16px;
      margin-top: 26px;
      font-size: 14px;
      font-weight: 700;
      color: vars.$color-light;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      background: vars.$color-dark;
      border: none;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }

      @media (max-width: vars.$breakpoints-s) {
        padding: 10px;
        font-size: 12px;
        font-weight: 400;
      }

      &:hover:not(:disabled) {
        opacity: 0.8;
      }
    }
  }
</style>
