<template>
  <div class="signin-form">
    <form ref="formRef" class="signin-form__form" novalidate @submit.prevent="handleSubmit">
      <div class="signin-form__field">
        <BaseInput
          v-model="form.username"
          :error="errors.username"
          :clearable="isMobile"
          class="signin-form__input"
          type="text"
          placeholder="Username"
          name="username"
        />
      </div>

      <div class="signin-form__field">
        <BaseInput
          v-model="form.password"
          :error="errors.password"
          class="signin-form__input"
          type="password"
          placeholder="Password"
          name="password"
        />
      </div>

      <div class="signin-form__field">
        <label class="signin-form__checkbox-label">
          <input v-model="rememberMe" type="checkbox" class="signin-form__checkbox" />
          Remember me
        </label>
      </div>

      <button type="submit" class="signin-form__submit-button" :disabled="isLoading">
        {{ isLoading ? 'Signing In...' : 'Sign In' }}
      </button>
    </form>

    <div class="signin-form__footer">
      <NuxtLink to="/ResetPassword" class="signin-form__forgot-link">
        Have you forgotten your password?
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useAuthStore } from '@/stores/useAuthStore'
  import { useNotification } from '@/composables/useNotification'
  import { validateValue } from '@/utils/validate'
  import { VALIDATION_CONFIGS } from '@/constants/validation'
  import BaseInput from '@/components/ui/base/BaseInput.vue'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { TABLET_BREAKPOINT } from '@/constants/breakpoints'
  import { navigateTo } from 'nuxt/app'
  import { getFromLocalStorage, setToLocalStorage, removeFromLocalStorage } from '@/utils/localStorage'

  const { isBelow: isMobile } = useBreakpoint(TABLET_BREAKPOINT)

  const form = reactive({
    username: 'mor_2314',
    password: '83r5^_',
  })

  const rememberMe = ref(false)
  const isLoading = ref(false)
  const errors = reactive({
    username: '',
    password: '',
  })

  const { notify } = useNotification()
  const authStore = useAuthStore()

  const resetErrors = () => {
    errors.username = ''
    errors.password = ''
  }

  const validateForm = () => {
    let isValid = true
    resetErrors()

    // Validate username
    const usernameError = validateValue(
      form.username,
      VALIDATION_CONFIGS.name.rules,
      VALIDATION_CONFIGS.name.messages,
    )
    if (usernameError) {
      errors.username = usernameError
      isValid = false
    }

    // Validate password
    const passwordError = validateValue(
      form.password,
      VALIDATION_CONFIGS.password.rules,
      VALIDATION_CONFIGS.password.messages,
    )
    if (passwordError) {
      errors.password = passwordError
      isValid = false
    }

    return isValid
  }

  const loadSavedUserData = () => {
    if (!import.meta.client) return

    const rememberMeSaved = Boolean(getFromLocalStorage('signinRememberMe'))
    if (rememberMeSaved) {
      const saved = getFromLocalStorage('signinUserData')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          form.username = parsed.username || ''
          rememberMe.value = true
        } catch {
          console.error('The data is corrupted')
        }
      }
    } else {
      rememberMe.value = false
    }
  }

  const saveUserData = () => {
    if (rememberMe) {
      setToLocalStorage(
        'signinUserData',
        JSON.stringify({
          username: form.username,
        }),
      )
      setToLocalStorage('signinRememberMe', 'true')
    } else {
      removeUserData()
    }
  }

  const removeUserData = () => {
    removeFromLocalStorage('signinUserData')
    removeFromLocalStorage('signinRememberMe')
  }

  const resetForm = () => {
    if (!rememberMe) {
      form.username = ''
    }
    form.password = ''
  }

  const handleSubmit = async () => {

    if (!validateForm()) {
      notify({
        message: 'Check that the form is filled out correctly',
        type: 'warning',
      })
      return
    }

    isLoading.value = true

    try {
      await authStore.loginWithApi({
        username: form.username,
        password: form.password,
      })

      if (rememberMe.value) {
        saveUserData()
      } else {
        removeUserData()
      }

      notify({
        message: 'You have successfully signed in!',
        type: 'success',
      })

      resetForm()
      resetErrors()
      await navigateTo('/')
      
    } catch (error) {
      console.error('Login error:', error)
      notify({
        message:
          error instanceof Error ? error.message : 'Sign in failed. Please check your credentials.',
        type: 'error',
      })
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    loadSavedUserData()
  })
</script>

<style scoped lang="scss">
  .signin-form {
    &__form {
      display: flex;
      flex-direction: column;
      gap: 36px;
    }

    &__field {
      display: flex;
      flex-direction: column;
    }

    &__input {
      border-bottom: 2px solid vars.$color-ligth-gray;

      &:not(:first-child) {
        margin-top: 36px;
      }
    }

    &__checkbox-label {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: -15px;
      font-size: 14px;
      color: vars.$color-dark;
      cursor: pointer;
    }

    &__checkbox {
      width: 16px;

      @media (max-width: vars.$breakpoints-s) {
        width: 13px;
      }
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

      @media (max-width: vars.$breakpoints-s) {
        margin-top: -26px;
      }

      &:hover:not(:disabled) {
        opacity: 0.7;
      }
    }

    &__footer {
      margin-top: 14px;
      text-align: center;
    }

    &__forgot-link {
      font-size: 14px;
      font-weight: 500;
      color: vars.$color-dark;
      text-decoration: none;
      transition: text-decoration 0.2s ease;

      &:hover {
        text-decoration: underline;
      }

      @media (max-width: vars.$breakpoints-s) {
        font-size: 12px;
      }
    }
  }
</style>
