<template>
  <div class="review-form">
    <h3 class="review-form__title">Add a Review</h3>
    <p class="review-form__description">
      Your email address will not be published. Required fields are marked *
    </p>

    <form ref="formRef" class="review-form__form" novalidate @submit.prevent="handleSubmit">
      <div class="review-form__field">
        <BaseTextarea
          ref="messageTextareaRef"
          v-model="form.message"
          :error="showErrors ? errors.message : ''"
          class="review-form__input"
          placeholder="Enter your message*"
          name="message"
          minlength="10"
          data-min-length-message="Minimum of 10 characters"
          data-required-message="Enter the text of the review"
        />
      </div>

      <div class="review-form__field">
        <BaseInput
          ref="nameInputRef"
          v-model="form.name"
          :error="showErrors ? errors.name : ''"
          class="review-form__input"
          type="text"
          placeholder="Enter your name*"
          name="name"
          minlength="2"
          required
          data-min-length-message="Minimum of 2 characters"
          data-required-message="Enter a name"
        />
      </div>

      <div class="review-form__field">
        <BaseInput
          ref="emailInputRef"
          v-model="form.email"
          :error="showErrors ? errors.email : ''"
          class="review-form__input"
          type="email"
          placeholder="Enter your email*"
          name="email"
          minlength="10"
          required
          data-min-length-message="Minimum of 10 characters"
          data-required-message="Enter your email address"
          data-type-mismatch-message="Incorrect email address"
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
  import { validateInput } from '@/utils/validateInput'
  import type { Review, FormData } from '@/types/Reviews'
  import BaseInput from '@/components/ui/BaseInput.vue'
  import BaseTextarea from '@/components/ui/BaseTextarea.vue'

  const props = defineProps<{
    productId: number | string
    productTitle: string
  }>()

  const reviews = defineModel<Review[]>('reviews', { required: true })

  const formRef = ref<HTMLFormElement | null>(null)
  const messageTextareaRef = ref<InstanceType<typeof BaseTextarea> | null>(null)
  const nameInputRef = ref<InstanceType<typeof BaseInput> | null>(null)
  const emailInputRef = ref<InstanceType<typeof BaseInput> | null>(null)

  const form = reactive<FormData>({
    name: '',
    message: '',
    email: '',
    rating: 5,
  })

  const rememberMe = ref(false)
  const showErrors = ref(false)
  const errors = reactive({
    name: '',
    email: '',
    message: '',
  })

  const { notify } = useNotification()

  const loadSavedUserData = () => {
    const rememberMeSaved = localStorage.getItem('reviewRememberMe')

    if (rememberMeSaved === 'true') {
      const saved = localStorage.getItem('reviewUserData')
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
    if (rememberMe.value) {
      localStorage.setItem(
        'reviewUserData',
        JSON.stringify({
          name: form.name,
          email: form.email,
        }),
      )
      localStorage.setItem('reviewRememberMe', 'true')
    } else {
      removeUserData()
    }
  }

  const removeUserData = () => {
    localStorage.removeItem('reviewUserData')
    localStorage.removeItem('reviewRememberMe')
  }

  const validateForm = (): boolean => {
    let isValid = true

    // Validate message
    const messageTextarea = messageTextareaRef.value?.$el?.querySelector('textarea')
    const messageError = validateInput(messageTextarea)
    errors.message = messageError
    if (messageError) isValid = false

    // Validate name
    const nameInput = nameInputRef.value?.$el?.querySelector('input')
    const nameError = validateInput(nameInput)
    errors.name = nameError
    if (nameError) isValid = false

    // Validate email
    const emailInput = emailInputRef.value?.$el?.querySelector('input')
    const emailError = validateInput(emailInput)
    errors.email = emailError
    if (emailError) isValid = false

    return isValid
  }

  const resetForm = () => {
    if (!rememberMe.value) {
      form.name = ''
      form.email = ''
    }
    form.message = ''
    form.rating = 5
  }

  const isReviewDuplicate = (email: string): boolean => {
    return reviews.value.some((r) => r.email === email.trim())
  }

  const handleSubmit = () => {
    showErrors.value = true

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

    if (rememberMe.value) {
      saveUserData()
    } else {
      removeUserData()
    }

    notify({
      message: 'Your review has been sent successfully!',
      type: 'success',
    })

    resetForm()
    showErrors.value = false
    Object.keys(errors).forEach((key) => {
      errors[key as keyof typeof errors] = ''
    })
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
      }
    }
  }
</style>
