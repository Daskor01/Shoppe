<template>
  <div class="signin-form">
    <form ref="formRef" class="signin-form__form" novalidate @submit.prevent="handleSubmit">
      <div class="signin-form__field">
        <BaseInput
          ref="usernameInputRef"
          v-model="form.username"
          :error="showErrors ? errors.username : ''"
          :clearable="isMobile"
          class="signin-form__input"
          type="text"
          placeholder="Username"
          name="username"
          minlength="2"
          required
          data-min-length-message="Minimum of 2 characters"
          data-required-message="Enter your username"
        />
      </div>

      <div class="signin-form__field">
        <BaseInput
          ref="passwordInputRef"
          v-model="form.password"
          :error="showErrors ? errors.password : ''"
          class="signin-form__input"
          type="password"
          placeholder="Password"
          name="password"
          minlength="6"
          required
          data-min-length-message="Minimum of 6 characters"
          data-required-message="Enter your password"
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
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import { validateInput } from '@/utils/validateInput'
  import BaseInput from '@/components/ui/base/BaseInput.vue'
  import { TABLET_BREAKPOINT } from '@/constants/breakpoints'

  const formRef = ref<HTMLFormElement | null>(null)
  const usernameInputRef = ref<InstanceType<typeof BaseInput> | null>(null)
  const passwordInputRef = ref<InstanceType<typeof BaseInput> | null>(null)
  const { isBelow: isMobile } = useBreakpoint(TABLET_BREAKPOINT)

  const form = reactive({
    username: 'mor_2314',
    password: '83r5^_',
  })

  const rememberMe = ref(false)
  const isLoading = ref(false)
  const showErrors = ref(false)
  const errors = reactive({
    username: '',
    password: '',
  })

  const { notify } = useNotification()
  const authStore = useAuthStore()

  // Safe localStorage functions
  const getLocalStorage = (key: string): string | null => {
    if (import.meta.client) {
      return localStorage.getItem(key)
    }
    return null
  }

  const setLocalStorage = (key: string, value: string): void => {
    if (import.meta.client) {
      localStorage.setItem(key, value)
    }
  }

  const removeLocalStorage = (key: string): void => {
    if (import.meta.client) {
      localStorage.removeItem(key)
    }
  }

  const loadSavedUserData = () => {
    if (!import.meta.client) return

    const rememberMeSaved = getLocalStorage('signinRememberMe')
    if (rememberMeSaved === 'true') {
      const saved = getLocalStorage('signinUserData')
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
      // form.username = ''
      // form.password = ''
      rememberMe.value = false
    }
  }

  const saveUserData = () => {
    if (rememberMe.value) {
      setLocalStorage(
        'signinUserData',
        JSON.stringify({
          username: form.username,
        }),
      )
      setLocalStorage('signinRememberMe', 'true')
    } else {
      removeUserData()
    }
  }

  const removeUserData = () => {
    removeLocalStorage('signinUserData')
    removeLocalStorage('signinRememberMe')
  }

  const validateForm = (): boolean => {
    let isValid = true

    // Validate username
    const usernameInput = usernameInputRef.value?.$el?.querySelector('input')
    const usernameError = validateInput(usernameInput)
    errors.username = usernameError
    if (usernameError) isValid = false

    // Validate password
    const passwordInput = passwordInputRef.value?.$el?.querySelector('input')
    const passwordError = validateInput(passwordInput)
    errors.password = passwordError
    if (passwordError) isValid = false

    return isValid
  }

  const resetForm = () => {
    if (!rememberMe.value) {
      form.username = ''
    }
    form.password = ''
  }

  const handleSubmit = async () => {
    showErrors.value = true

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
      showErrors.value = false
      Object.keys(errors).forEach((key) => {
        errors[key as keyof typeof errors] = ''
      })

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
