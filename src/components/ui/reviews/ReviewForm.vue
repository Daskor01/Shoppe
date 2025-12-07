<template>
  <div class="review-form">
    <h3 class="review-form__title">Add a Review</h3>
    <p class="review-form__description">
      Your email address will not be published. Required fields are marked *
    </p>

    <form ref="formRef" class="review-form__form" novalidate @submit.prevent="handleSubmit">
      <div class="review-form__field">
        <BaseTextarea
          v-model="form.message"
          :error="errors.message"
          class="review-form__input"
          placeholder="Enter your message*"
          name="message"
        />
      </div>

      <div class="review-form__field">
        <BaseInput
          v-model="form.name"
          :error="errors.name"
          class="review-form__input"
          type="text"
          placeholder="Enter your name*"
          name="name"
        />
      </div>

      <div class="review-form__field">
        <BaseInput
          v-model="form.email"
          :error="errors.email"
          class="review-form__input"
          type="email"
          placeholder="Enter your email*"
          name="email"
        />
      </div>

      <div class="review-form__field">
        <label class="review-form__checkbox-label">
          <input v-model="rememberMe" type="checkbox" class="review-form__checkbox" />
          Save my name, email, and website in this browser for the next time I comment
        </label>
      </div>

      <div class="review-form__field">
        <label class="review-form__rating-label">
          Your rating*
          <StarRating v-model="form.rating" />
        </label>
      </div>

      <button type="submit" class="review-form__submit-button">Submit</button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useNotification } from '@/composables/useNotification'
  import { validateValue } from '@/utils/validate'
  import type { Review, FormData } from '@/types/Reviews'
  import BaseInput from '@/components/ui/base/BaseInput.vue'
  import BaseTextarea from '@/components/ui/base/BaseTextarea.vue'
  import StarRating from '@/components/ui/base/BaseStarRating.vue'
  import { VALIDATION_CONFIGS } from '@/constants/validation'
  import { getFromLocalStorage, removeFromLocalStorage, setToLocalStorage } from '@/utils/localStorage'

  defineProps<{
    productId: number | string
    productTitle: string
  }>()

  const reviews = defineModel<Review[]>('reviews', { required: true })

  const form = reactive<FormData>({
    name: '',
    message: '',
    email: '',
    rating: 5,
  })

  const rememberMe = ref(false)
  const errors = reactive({
    name: '',
    email: '',
    message: '',
  })

  const { notify } = useNotification()

  const loadSavedUserData = () => {
    const rememberMeSaved = Boolean(getFromLocalStorage('reviewRememberMe'))

    if (rememberMeSaved) {
      const saved = getFromLocalStorage('reviewUserData')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          form.name = parsed.name || ''
          form.email = parsed.email || ''
          rememberMe.value = true
        } catch {
          console.error('The data is corrupted')
        }
      }
    } else {
      form.name = ''
      form.email = ''
      rememberMe.value = false
    }
  }

  const saveUserData = () => {
    if (rememberMe) {
      setToLocalStorage(
        'reviewUserData',
        JSON.stringify({
          name: form.name,
          email: form.email,
        }),
      )
      setToLocalStorage('reviewRememberMe', 'true')
    } else {
      removeUserData()
    }
  }

  const removeUserData = () => {
    removeFromLocalStorage('reviewUserData')
    removeFromLocalStorage('reviewRememberMe')
  }

  const resetErrors = () => {
    errors.name = ''
    errors.email = ''
    errors.message = ''
  }

  const validateForm = () => {
    resetErrors()

    // Validate message
    const messageError = validateValue(
      form.message,
      VALIDATION_CONFIGS.message.rules,
      VALIDATION_CONFIGS.message.messages,
    )
    if (messageError) {
      errors.message = messageError
    }

    // Validate name
    const nameError = validateValue(
      form.name,
      VALIDATION_CONFIGS.name.rules,
      VALIDATION_CONFIGS.name.messages,
    )
    if (nameError) {
      errors.name = nameError
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

    return !(messageError || nameError || emailError)
  }

  const resetForm = () => {
    if (!rememberMe) {
      form.name = ''
      form.email = ''
    }
    form.message = ''
    form.rating = 5
  }

  const isReviewDuplicate = (email: string) => {
    return reviews.value.some((r) => r.email === email.trim())
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      notify({
        message: 'Check that the form is filled out correctly',
        type: 'warning',
      })
      return
    }

    if (isReviewDuplicate(form.email)) {
      notify({
        message: 'Have you already left a review for this product.',
        type: 'info',
      })
      return
    }

    const newReview: Review = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      date: new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      rating: form.rating,
    }

    reviews.value.push(newReview)

    if (rememberMe) {
      saveUserData()
    } else {
      removeUserData()
    }

    notify({
      message: 'Your review has been sent successfully!',
      type: 'success',
    })

    resetForm()
    resetErrors()
  }

  onMounted(() => {
    loadSavedUserData()
  })
</script>

<style scoped lang="scss">
  .review-form {
    flex: 1;
    margin-left: 2rem;

    @media (max-width: vars.$breakpoints-l) {
      margin-top: 2rem;
      margin-left: 0;
    }

    @media (max-width: vars.$breakpoints-s) {
      margin-top: 0;
    }

    &__title {
      margin-bottom: 0.5rem;
      font-size: 20px;
      font-weight: 400;
      line-height: 130%;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 16px;
      }
    }

    &__description {
      margin-bottom: 1.5rem;
      font-size: 14px;
      color: vars.$color-gray;

      @media (max-width: vars.$breakpoints-m) {
        font-size: 12px;
      }
    }

    &__form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    &__field {
      display: flex;
      flex-direction: column;
    }

    &__input {
      border-bottom: 1px solid vars.$color-gray;
    }

    &__checkbox-label {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      font-size: 12px;
      color: vars.$color-gray;
      cursor: pointer;
    }

    &__checkbox {
      width: 18px;
      height: 18px;
      accent-color: vars.$color-dark;
    }

    &__rating-label {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-weight: 500;
    }

    &__submit-button {
      max-width: 136px;
      padding: 16px 34px;
      color: vars.$color-light;
      cursor: pointer;
      background: vars.$color-dark;
      border: none;
      border-radius: 4px;
      transition: 0.2s ease;

      &:hover {
        opacity: 0.7;
      }

      @media (max-width: vars.$breakpoints-s) {
        max-width: 100%;
        padding: 10px;
      }
    }
  }
</style>
