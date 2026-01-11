<template>
  <footer class="footer">
    <div class="footer__container">
      <nav class="footer__nav" aria-label="Footer navigation">
        <NuxtLink v-for="link in footerLinks" :key="link.path" :to="link.path" class="footer__link">
          {{ link.name }}
        </NuxtLink>
      </nav>

      <div class="footer__copyright">
        © 2021 Shelly.
        <template v-for="(link, index) in copyrightLinks" :key="link.name">
          <NuxtLink :to="link.path" class="footer__link">{{ link.name }}</NuxtLink>
          <span v-if="index < copyrightLinks.length - 1"> and </span>
        </template>
      </div>

      <form 
        class="footer__form" 
        novalidate 
        @submit.prevent="handleSubmit"
        aria-label="Newsletter subscription"
      >
        <BaseInput
          v-model="email"
          :error="errors.email"
          type="email"
          name="email"
          placeholder="Give an email, get the newsletter."
          class="footer__form-input"
          aria-label="Email for newsletter"
        />

        <button type="submit" class="footer__form-button" aria-label="Subscribe">
          <IconArrowRight class="footer__form-button--icon" aria-hidden="true"/>
        </button>

        <div class="footer__form-consent-container">
          <input 
            v-model="consent"
            type="checkbox" 
            class="footer__form-consent-checkbox" 
            required 
            checked
            aria-label="Agree to terms and conditions"
          />
          <span class="footer__form-consent-text">i agree to the website’s terms and conditions</span>
        </div>
      </form>

      <div class="footer__socials">
        <p class="footer__socials-text" id="socials-label">Follow us</p>
        <div class="footer__socials-separator" role="presentation"></div>
        <div class="footer__socials-list" role="list" aria-labelledby="socials-label">
          <NuxtLink
            v-for="link in socialLinks"
            :key="link.name"
            :to="link.path"
            class="footer__socials-link"
            :aria-label="`Follow us on ${link.name}`"
            role="listitem"
          >
            <component class="footer__socials-link--icon" :is="link.icon" aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import BaseInput from '@/components/ui/base/BaseInput.vue'
  import { validateValue } from '@/utils/validate'
  import { VALIDATION_CONFIGS } from '@/constants/validation'
  import { copyrightLinks, footerLinks, socialLinks } from '@/config/navigation'
  import { useNotification } from '@/composables/useNotification'

  const email = ref('')
  const consent = ref(true)
  const errors = reactive({
    email: '',
    consent: '',
  })

  const { notify } = useNotification()

  const resetErrors = () => {
    Object.keys(errors).forEach((key) => (errors[key as keyof typeof errors] = ''))
  }

  const validateForm = () => {
    resetErrors()

    const emailError = validateValue(
      email.value,
      VALIDATION_CONFIGS.email.rules,
      VALIDATION_CONFIGS.email.messages,
    )

    if (emailError) {
      errors.email = emailError
    }

    if (!consent.value) {
      errors.consent = 'You must agree to the terms of use.'
    }

    return !emailError
  }

  const getStoredEmails = () => {
    const stored = localStorage.getItem('subscribedEmails') || '[]'
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }

  const isEmailNew = (emailValue: string, emails: string[]): boolean => {
    return !emails.includes(emailValue)
  }

  const saveEmail = (emailValue: string, emails: string[]): void => {
    emails.push(emailValue)
    localStorage.setItem('subscribedEmails', JSON.stringify(emails))
  }

  const resetForm = () => {
    email.value = ''
    consent.value = true
  }

  const handleSubmit = () => {
    email.value.trim()

    if (!validateForm()) {
      notify({
        message: 'Please check the form for errors',
        type: 'warning',
      })
      return
    }

    const emails = getStoredEmails()

    if (isEmailNew(email.value, emails)) {
      saveEmail(email.value, emails)
      notify({
        message: 'Email sent!',
        type: 'success',
      })
    } else {
      notify({
        message: 'This email has already been sent.',
        type: 'info',
      })
    }

    resetForm()
  }
</script>

<style scoped lang="scss">
.footer {
  position: relative;
  inline-size: 100%;
  padding-block: 2rem 20px;
  margin-block-start: 220px;

  @media (max-width: vars.$breakpoints-l) { margin-block-start: 120px; }
  @media (max-width: vars.$breakpoints-m) { margin-block-start: 70px; }
  @media (max-width: vars.$breakpoints-s) { font-size: 14px; }

  &::before {
    position: absolute;
    top: -22px;
    width: 100%;
    height: 2px;
    content: '';
    background-color: vars.$color-ligth-gray;

    @media (max-width: vars.$breakpoints-s) { display: none; }
  }

  &__container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'nav form'
      'copyright socials';
    row-gap: 50px;

    @media (max-width: vars.$breakpoints-l) {
      grid-template-columns: 1fr;
      grid-template-areas:
        'form'
        'nav'
        'socials'
        'copyright';
    }
  }

  &__nav {
    display: flex;
    grid-area: nav;
    column-gap: 40px;
    text-transform: uppercase;

    @media (max-width: vars.$breakpoints-s) {
      flex-direction: column;
      margin-block-start: 40px;
      gap: 15px;
    }
  }

  &__link {
    line-height: 169%;
    color: vars.$color-gray;
    text-decoration: none;
    transition: color 0.4s;

    &:hover { color: vars.$color-dark; }
  }

  &__form {
    position: relative;
    display: flex;
    gap: 14px;
    grid-area: form;
    align-items: center;
    justify-self: end;
    min-inline-size: 288px;
    max-inline-size: 396px;
    block-size: 40px;
    border-block-end: 2px solid vars.$color-gray;
    transition: border-color 0.2s;

    @media (max-width: vars.$breakpoints-l) { justify-self: start; }

    @media (max-width: vars.$breakpoints-s) {
      display: grid;
      grid-template-areas:
        'input button'
        'consent .';
      grid-template-columns: 1fr auto;
      inline-size: 100%;
    }

    &:has(input:focus) { border-block-end-color: vars.$color-dark; }

    &-input {
      inline-size: 100%;
      padding-block-start: 10px;
      @media (max-width: vars.$breakpoints-s) { font-size: 14px; }
    }

    &-consent-container {
      display: none;
      @media (max-width: vars.$breakpoints-s) {
        display: flex;
        grid-area: consent;
        align-items: center;
        margin-block-start: 10px;
      }
    }

    &-consent-text {
      @media (max-width: vars.$breakpoints-s) { font-size: 12px; }
    }

    &-button {
      @include mixins.reset-appearance;
      width: 24px;
      height: 24px;
      color: vars.$color-gray;
      transition: color 0.3s;

      &:hover { color: vars.$color-dark; }
    }
  }

  &__socials {
    display: flex;
    grid-area: socials;
    column-gap: 30px;
    align-items: center;
    justify-self: end;
    list-style: none;

    @media (max-width: vars.$breakpoints-l) { justify-self: start; }
    @media (max-width: vars.$breakpoints-s) { column-gap: 16px; }

    &-text {
      display: none;
      @media (max-width: vars.$breakpoints-s) { display: block; }
    }

    &-separator {
      display: none;
      inline-size: 54px;
      height: 2px;
      background-color: vars.$color-dark;

      @media (max-width: vars.$breakpoints-s) {
        display: block;
        inline-size: 47px;
        block-size: 1px;
      }
    }

    &-list {
      display: flex;
      column-gap: 24px;
    }

    &-link {
      color: vars.$color-gray;
      text-decoration: none;
      transition: color 0.4s;

      &:hover { color: vars.$color-dark; }
    }
  }

  &__copyright {
    grid-area: copyright;
  }
}
</style>
