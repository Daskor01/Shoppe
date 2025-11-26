<template>
  <div class="register-form">
    <form ref="formRef" class="register-form__form" novalidate @submit.prevent="handleSubmit">
      <div class="register-form__field">
        <BaseInput
          ref="usernameInputRef"
          v-model="form.username"
          :error="showErrors ? errors.username : ''"
          :clearable="isMobile"
          class="register-form__input"
          type="text"
          placeholder="Choose username*"
          name="username"
          minlength="3"
          required
          data-min-length-message="Minimum of 3 characters"
          data-required-message="Enter your username"
        />
      </div>

      <div class="register-form__field">
        <BaseInput
          ref="emailInputRef"
          v-model="form.email"
          :error="showErrors ? errors.email : ''"
          :clearable="isMobile"
          class="register-form__input"
          type="email"
          placeholder="Enter your email*"
          name="email"
          required
          data-required-message="Enter your email"
          data-type-mismatch-message="Invalid email address"
        />
      </div>

      <div class="register-form__field">
        <BaseInput
          ref="passwordInputRef"
          v-model="form.password"
          :error="showErrors ? errors.password : ''"
          class="register-form__input"
          type="password"
          placeholder="Create password*"
          name="password"
          minlength="6"
          required
          data-min-length-message="Minimum of 6 characters"
          data-required-message="Enter your password"
        />
      </div>

      <div class="register-form__field">
        <BaseInput
          ref="confirmPasswordInputRef"
          v-model="form.confirmPassword"
          :error="showErrors ? errors.confirmPassword : ''"
          class="register-form__input"
          type="password"
          placeholder="Confirm password*"
          name="confirmPassword"
          required
          data-required-message="Confirm your password"
        />
      </div>

      <div class="register-form__field">
        <label class="register-form__checkbox-label">
          <input v-model="agreeTerms" type="checkbox" class="register-form__checkbox" required />
          I agree to the Terms of Service and Privacy Policy
        </label>
        <span v-if="showErrors && !agreeTerms" class="register-form__error">
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
  import { validateInput } from '@/utils/validateInput'
  import BaseInput from '@/components/ui/base/BaseInput.vue'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { TABLET_BREAKPOINT } from '@/constants/breakpoints'

  const formRef = ref<HTMLFormElement | null>(null)
  const usernameInputRef = ref<InstanceType<typeof BaseInput> | null>(null)
  const emailInputRef = ref<InstanceType<typeof BaseInput> | null>(null)
  const passwordInputRef = ref<InstanceType<typeof BaseInput> | null>(null)
  const confirmPasswordInputRef = ref<InstanceType<typeof BaseInput> | null>(null)
  const { isBelow: isMobile } = useBreakpoint(TABLET_BREAKPOINT)

  const form = reactive({
    username: 'mor_2314',
    email: 'ustal@mail.ru',
    password: '83r5^_',
    confirmPassword: '83r5^_',
  })

  const agreeTerms = ref(false)
  const isLoading = ref(false)
  const showErrors = ref(false)
  const errors = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const { notify } = useNotification()
  const authStore = useAuthStore()

  const validateForm = (): boolean => {
    let isValid = true

    // Validate username
    const usernameInput = usernameInputRef.value?.$el?.querySelector('input')
    const usernameError = validateInput(usernameInput)
    errors.username = usernameError
    if (usernameError) isValid = false

    // Validate email
    const emailInput = emailInputRef.value?.$el?.querySelector('input')
    const emailError = validateInput(emailInput)
    errors.email = emailError
    if (emailError) isValid = false

    // Validate password
    const passwordInput = passwordInputRef.value?.$el?.querySelector('input')
    const passwordError = validateInput(passwordInput)
    errors.password = passwordError
    if (passwordError) isValid = false

    // Validate confirm password
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
      isValid = false
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
      isValid = false
    } else {
      errors.confirmPassword = ''
    }

    // Validate terms
    if (!agreeTerms.value) {
      isValid = false
    }

    return isValid
  }

  const resetForm = () => {
    form.username = ''
    form.email = ''
    form.password = ''
    form.confirmPassword = ''
    agreeTerms.value = false
  }

  const handleSubmit = async () => {
    showErrors.value = true

    if (!validateForm()) {
      notify({
        message: 'Please check the form for errors',
        type: 'warning',
      })
      return
    }

    isLoading.value = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const fakeToken = `registered-user-${Date.now()}`
      authStore.login(fakeToken)

      notify({
        message: 'Account created successfully!',
        type: 'success',
      })

      resetForm()
      showErrors.value = false
      Object.keys(errors).forEach((key) => {
        errors[key as keyof typeof errors] = ''
      })

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
