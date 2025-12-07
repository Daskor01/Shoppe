<template>
  <div class="register-form">
    <form ref="formRef" class="register-form__form" novalidate @submit.prevent="handleSubmit">
      <div class="register-form__field">
        <BaseInput
          v-model="form.username"
          :error="errors.username"
          :clearable="isMobile"
          class="register-form__input"
          type="text"
          placeholder="Choose username*"
          name="username"
        />
      </div>

      <div class="register-form__field">
        <BaseInput
          v-model="form.email"
          :error="errors.email"
          :clearable="isMobile"
          class="register-form__input"
          type="email"
          placeholder="Enter your email*"
          name="email"
        />
      </div>

      <div class="register-form__field">
        <BaseInput
          v-model="form.password"
          :error="errors.password"
          class="register-form__input"
          type="password"
          placeholder="Create password*"
          name="password"
        />
      </div>

      <div class="register-form__field">
        <BaseInput
          v-model="form.confirmPassword"
          :error="errors.confirmPassword"
          class="register-form__input"
          type="password"
          placeholder="Confirm password*"
          name="confirmPassword"
        />
      </div>

      <div class="register-form__field">
        <label class="register-form__checkbox-label">
          <input v-model="agreeTerms" type="checkbox" class="register-form__checkbox" required />
          I agree to the Terms of Service and Privacy Policy
        </label>
        <span v-if="!!errors.terms && !agreeTerms" class="register-form__error">
          You must agree to the terms
        </span>
      </div>

      <button type="submit" class="register-form__submit-button" :disabled="isLoading">
        {{ isLoading ? 'Creating Account...' : 'Create Account' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useAuthStore } from '@/stores/useAuthStore'
  import { useNotification } from '@/composables/useNotification'
  import { validateValue } from '@/utils/validate'
  import { VALIDATION_CONFIGS } from '@/constants/validation'
  import BaseInput from '@/components/ui/base/BaseInput.vue'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { TABLET_BREAKPOINT } from '@/constants/breakpoints'
  import { navigateTo } from 'nuxt/app'
  import { wait } from '@/utils/wait'
  import { DEFAULT_DELAY } from '@/constants/common'

  const { isBelow: isMobile } = useBreakpoint(TABLET_BREAKPOINT)

  const form = reactive({
    username: 'mor_2314',
    email: 'ustal@mail.ru',
    password: '83r5^_',
    confirmPassword: '83r5^_',
  })

  const agreeTerms = ref(false)
  const isLoading = ref(false)
  const errors = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
  })

  const { notify } = useNotification()
  const authStore = useAuthStore()

  const resetErrors = () => {
    errors.username = ''
    errors.email = ''
    errors.password = ''
    errors.confirmPassword = ''
    errors.terms = ''
  }

  const validateForm = () => {
    resetErrors()

    // Validate username
    const usernameError = validateValue(
      form.username,
      VALIDATION_CONFIGS.name.rules,
      VALIDATION_CONFIGS.name.messages,
    )
    if (usernameError) {
      errors.username = usernameError
    }

    // Validate email
    const emailError = validateValue(
      form.email,
      VALIDATION_CONFIGS.email.rules,
      VALIDATION_CONFIGS.email.messages,
    )
    if (emailError) {
      errors.email = emailError
    }

    // Validate password
    const passwordError = validateValue(
      form.password,
      VALIDATION_CONFIGS.password.rules,
      VALIDATION_CONFIGS.password.messages,
    )
    if (passwordError) {
      errors.password = passwordError
    }

    // Validate confirmPassword
    if (!form.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // Validate terms
    if (!agreeTerms.value) {
      errors.terms = 'You must agree to the terms and conditions'
    }

    return !(
      errors.username ||
      errors.email ||
      errors.password ||
      errors.confirmPassword ||
      errors.terms
    )
  }

  const resetForm = () => {
    form.username = ''
    form.email = ''
    form.password = ''
    form.confirmPassword = ''
    agreeTerms.value = false
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      notify({
        message: 'Please check the form for errors',
        type: 'warning',
      })
      return
    }

    isLoading.value = true

    try {
      await wait(DEFAULT_DELAY)

      const fakeToken = `registered-user-${Date.now()}`
      authStore.authorise(fakeToken)

      notify({
        message: 'Account created successfully!',
        type: 'success',
      })

      resetForm()
      await navigateTo('/')
    } catch (error) {
      console.error('Registration error:', error)
      notify({
        message: 'Registration failed. Please try again.',
        type: 'error',
      })
    } finally {
      isLoading.value = false
    }
  }
</script>

<style scoped lang="scss">
  .register-form {
    &__form {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    &__field {
      display: flex;
      flex-direction: column;
    }

    &__input {
      border-bottom: 2px solid vars.$color-ligth-gray;
    }

    &__checkbox-label {
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 14px;
      color: vars.$color-dark;
      cursor: pointer;

      @media (max-width: vars.$breakpoints-s) {
        font-size: 12px;
      }
    }

    &__checkbox {
      width: 16px;

      @media (max-width: vars.$breakpoints-s) {
        width: 13px;
      }
    }

    &__error {
      margin-top: 4px;
      font-size: 12px;
      color: vars.$color-accent-red;
    }

    &__submit-button {
      width: 100%;
      padding: 18px;
      font-size: 14px;
      font-weight: 700;
      color: vars.$color-light;
      text-transform: uppercase;
      cursor: pointer;
      background: vars.$color-dark;
      border: none;
      border-radius: 6px;
      transition: opacity 0.2s ease;

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
        opacity: 0.7;
      }
    }
  }
</style>
