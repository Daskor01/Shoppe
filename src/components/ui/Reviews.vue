<template>
  <div class="reviews">
    <div v-if="reviews.length">
      <h3>{{ reviews.length }} Reviews for {{ productTitle }}</h3>
      <div v-for="(review, index) in reviews" :key="index" class="reviews__item">
        <p>
          <strong>{{ review.name }}</strong> {{ review.date }}
        </p>
        <StarRating :modelValue="review.rating" readonly />
        <p>{{ review.message }}</p>
      </div>
    </div>
    <p v-else>There are no reviews yet. Be the first!</p>

    <div>
      <h3 class="reviews__title">Add a Review</h3>
      <p class="reviews__description">
        Your email address will not be published. Required fields are marked *
      </p>
      <form ref="formRef" novalidate class="reviews__form form" @submit.prevent="submitReview">
        <div class="form-group">
          <textarea
            id="message"
            v-model="form.message"
            name="message"
            minlength="10"
            required
            placeholder=""
            class="form__message"
            data-min-length-message="Minimum of 10 characters"
            data-required-message="Enter the text of the review"
            @focus="focusedField = 'message'"
            @blur="focusedField = null"
          ></textarea>
          <label
            :class="{ active: form.message || focusedField === 'message' }"
            for="message"
            class="form__label"
            >Enter your message*</label
          >
          <div class="form__underliner" />
          <p v-if="errors.message" class="form__error-message">{{ errors.message }}</p>
        </div>

        <div class="form-group">
          <input
            id="name"
            v-model="form.name"
            type="text"
            name="name"
            placeholder=""
            minlength="2"
            class="form__input"
            data-min-length-message="Minimum of 2 characters"
            data-required-message="Enter a name"
          />
          <label for="name" class="form__label">Enter your name*</label>
          <div class="form__underliner" />
          <p v-if="errors.name" class="form__error-message">{{ errors.name }}</p>
        </div>

        <div class="form-group">
          <input
            id="email"
            v-model="form.email"
            type="email"
            name="email"
            placeholder=""
            minlength="15"
            class="form__input"
            data-min-length-message="Minimum of 15 characters"
            data-required-message="Enter your email address"
            data-type-mismatch-message="Incorrect email address"
          />
          <label for="email" class="form__label">Enter your email*</label>
          <div class="form__underliner" />
          <p v-if="errors.email" class="form__error-message">{{ errors.email }}</p>
        </div>

        <label for="checkbox">
          <input v-model="rememberMe" type="checkbox" name="checkbox" />
          Save my name, email, and website in this browser for the next time I comment
        </label>

        <label
          >Your rating*
          <StarRating v-model="form.rating" :readonly="false" />
        </label>

        <button type="submit" class="form__button">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useNotification } from '@/composables/useNotification'
  import { useFormValidation } from '@/composables/useFormValidation'
  import type { Review, FormData } from '@/types/Reviews'

  const props = defineProps<{
    productId: number | string
    productTitle: string
  }>()

  const formRef = ref<HTMLFormElement | null>(null)

  const form: FormData = reactive({
    name: '',
    message: '',
    email: '',
    rating: 5,
  })

  const focusedField = ref<string | null>(null)
  const rememberMe = ref(false)

  const { errors, validateAll } = useFormValidation(formRef)

  const reviews = ref<Review[]>([])
  const { notify } = useNotification()

  const loadSavedUserData = () => {
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
  }

  const saveUserDataIfNeeded = () => {
    if (rememberMe.value) {
      localStorage.setItem('reviewUserData', JSON.stringify({ name: form.name, email: form.email }))
    } else {
      localStorage.removeItem('reviewUserData')
    }
  }

  const loadReviews = () => {
    const stored = localStorage.getItem(`reviews_${props.productId}`)
    reviews.value = stored ? JSON.parse(stored) : []
  }

  const saveReviews = () => {
    localStorage.setItem(`reviews_${props.productId}`, JSON.stringify(reviews.value))
  }

  const resetForm = () => {
    if (!rememberMe.value) {
      form.name = ''
      form.email = ''
    }
    form.message = ''
    form.rating = 1
  }

  const submitReview = () => {
    const isValid = validateAll()
    if (!isValid) {
      notify({ message: 'Check that the form is filled out correctly', type: 'warning' })
      return
    }

    // Check for duplicate review by email
    if (reviews.value.some((r) => r.email === form.email.trim())) {
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
    saveReviews()

    saveUserDataIfNeeded()

    notify({
      message: 'Your review has been sent successfully!',
      type: 'success',
    })

    resetForm()
  }

  onMounted(() => {
    loadReviews()
    loadSavedUserData()
  })
</script>

<style scoped lang="scss">
  .reviews {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;

    @media (max-width: vars.$breakpoints-l) {
      flex-direction: column;
    }

    &__item {
      padding: 0.5rem 0;
      border-bottom: 1px solid vars.$color-gray-light;
    }

    &__form {
      display: flex;
      flex-direction: column;
      gap: 46px;
      margin-top: 1rem;
    }
  }

  .form {
    &-group {
      position: relative;
      display: flex;
      flex-direction: column;
      margin-block-start: 10px;
    }

    &__error-message {
      position: absolute;
      inset-block-end: -30px;
      inset-inline-start: 0;
      font-size: 10px;
      color: vars.$color-accent-red;
    }

    &__label {
      position: absolute;
      top: 0;
      left: 0;
      padding: 0 4px;
      font-size: 16px;
      color: vars.$color-ligth-gray;
      pointer-events: none;
      background: vars.$color-light;
      transition: all 0.2s ease;

      &.active {
        top: -8px;
        left: 8px;
        font-size: 12px;
        color: vars.$color-gray;
      }
    }

    &__message {
      @include mixins.reset-appearance;

      min-inline-size: 100%;
      min-block-size: 80px;
      padding: 10px;
      resize: none;
    }

    &__input {
      @include mixins.reset-appearance;

      width: 100%;
      padding: 12px 8px;
      font-size: 16px;
      border-radius: 4px;
    }

    &__button {
      inline-size: 125px;
      block-size: 50px;
      padding: 16px 33px;
      color: vars.$color-light;
      text-align: center;
      background-color: vars.$color-dark;
      border: none;
      border-radius: 4px;
    }

    &__underliner {
      width: 100%;
      height: 1px;
      background: vars.$color-gray;
    }
  }

  // Floating label effect for input and textarea
  .form-group input:focus + label,
  .form-group input:not(:placeholder-shown) + label {
    top: -8px;
    left: 8px;
    font-size: 12px;
    color: vars.$color-gray;
  }
</style>
